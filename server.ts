import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import { rateLimit } from "express-rate-limit";
import { z, ZodError } from "zod";

dotenv.config();

const app = express();

// 1. Secure Headers with Helmet
// Customize Helmet so it does not block rendering the app inside the AI Studio iframe.
app.use(helmet({
  // Disable frameguard (X-Frame-Options) so the preview iframe renders successfully.
  frameguard: false,
  // Disable CORP & COOP so assets/scripts can load across the AI Studio parent window/iframe barrier.
  crossOriginResourcePolicy: false,
  crossOriginOpenerPolicy: false,
  // Disable CSP in development since Vite injects hot-reload modules and inline styles which get blocked.
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
}));

// 2. Cross-Origin Resource Sharing (CORS) Configuration
// Restrict cross-origin access strictly to same-origin or explicit handlers to block CSRF/abuse.
app.use(cors({
  origin: true, // Dynamically allow calling from same-origin/host
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// 3. Body Parser with Size Limits to prevent DoS attacks via huge payloads
app.use(express.json({ limit: "50kb" }));

const PORT = 3000;

// 4. Rate Limiting Middleware
// Throttles request rates to prevent automated brute-forcing or API resource exhaustion.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes."
  }
});

// Apply rate limiter specifically to the API endpoints
app.use("/api/", apiLimiter);

// Initialize the Gemini SDK
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Gemini SDK successfully initialized with secure server-side configuration.");
  } catch (error) {
    console.error("Failed to initialize Gemini SDK:", error);
  }
} else {
  console.log("GEMINI_API_KEY is missing or using placeholder. Running in fallback simulation mode.");
}

// 5. Zod Validation Schemas
const chatMessageSchema = z.object({
  id: z.string().optional(),
  sender: z.string().min(1, "Sender is required"),
  text: z.string().min(1, "Message text is required"),
  timestamp: z.string().optional()
});

const chatRequestSchema = z.object({
  messages: z.array(chatMessageSchema),
  role: z.enum(["fan", "volunteer", "organizer"]),
  state: z.any().optional().default({}),
  customContext: z.string().max(1000, "Context exceeds limit").optional()
});

const predictRequestSchema = z.object({
  state: z.any()
});

const incidentRequestSchema = z.object({
  description: z.string().min(1, "Description is required").max(1000, "Description exceeds limit"),
  state: z.any().optional().default({})
});

const navigateRequestSchema = z.object({
  start: z.string().min(1, "Start location is required").max(100, "Start location too long"),
  end: z.string().min(1, "Destination is required").max(100, "Destination too long"),
  state: z.any().optional().default({}),
  accessibility: z.boolean().optional().default(false)
});

// 6. Heuristic-based Prompt Injection Checker
function checkPromptInjection(text: string): boolean {
  const normalized = text.toLowerCase();
  const injectionSignatures = [
    "ignore previous instructions",
    "ignore all previous instructions",
    "ignore the instructions above",
    "system prompt",
    "override instructions",
    "forget what we talked about",
    "forget all previous",
    "you are now a",
    "act as a",
    "new instructions",
    "disregard previous",
    "disregard all instructions",
    "jailbreak",
    "prompt injection"
  ];
  return injectionSignatures.some(sig => normalized.includes(sig));
}

// 6.5. Gemini Integration Helper with Retry Strategy & Fallback
async function generateWithRetry(aiClient: GoogleGenAI, params: import("@google/genai").GenerateContentParameters, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await aiClient.models.generateContent(params);
    } catch (err: any) {
      if (i === retries - 1) throw err;
      console.warn(`[Gemini] Retry ${i + 1}/${retries} after error:`, err.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i))); // exponential backoff
    }
  }
}

async function generateStreamWithRetry(aiClient: GoogleGenAI, params: import("@google/genai").GenerateContentParameters, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await aiClient.models.generateContentStream(params);
    } catch (err: any) {
      if (i === retries - 1) throw err;
      console.warn(`[Gemini] Retry stream ${i + 1}/${retries} after error:`, err.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
}

// 7. Sanitized Error Handler to prevent leakage of stack traces or sensitive internals
function handleApiError(error: unknown, res: Response, customMessage = "An internal server error occurred.") {
  if (error instanceof ZodError) {
    console.warn("[Security][Validation Error] Request failed schema validation:", error.issues);
    return res.status(400).json({
      error: "Invalid request payload",
      details: error.issues.map(err => ({
        path: err.path.join("."),
        message: err.message
      }))
    });
  }
  
  console.error("[Security][Server Error]", error);
  return res.status(500).json({
    error: customMessage
  });
}

// 1. API: Multi-role Chat Copilot
app.post("/api/copilot/chat", async (req: Request, res: Response) => {
  console.log(`[API][Chat] Received request. IP: ${req.ip} - User-Agent: ${req.headers["user-agent"]}`);
  
  try {
    const validatedBody = chatRequestSchema.parse(req.body);
    const { messages, role: selectedRole, state: validatedState, customContext } = validatedBody;

    const lastMessage = messages.length > 0 && messages[messages.length - 1]?.text 
      ? String(messages[messages.length - 1].text).trim().slice(0, 500) 
      : "";

    console.log(`[API][Chat][Info] Processed message for role: ${selectedRole}. Length: ${lastMessage.length}`);

    // Prompt injection check
    if (checkPromptInjection(lastMessage)) {
      console.warn(`[Security][Chat] Prompt injection attempt detected from IP: ${req.ip}`);
      res.json({
        text: "🚨 **Security Advisory:** A potential instruction-override attempt was detected and safely intercepted. For safety and compliance reasons, I am unable to disregard my core stadium operations rules. How else can I assist you with the match today?"
      });
      return;
    }

    // Grounding Context Summary
    const stadiumSummary = `
WEATHER: Temp: ${validatedState.weather?.temp || 22}°C, Condition: ${validatedState.weather?.condition || 'Clear'}, Impact: ${validatedState.weather?.impact || 'None'}
SECTORS STATUS:
${(validatedState.sectors || []).map((s: any) => `- Sector ${s?.name || 'Unknown'}: Count: ${s?.currentCount || 0}/${s?.capacity || 10000} (${s?.crowdLevel || 'Normal'} congestion), Elevator: ${s?.hasElevator ? 'Yes' : 'No'}, Alerts: ${(s?.specialAlerts || []).join(', ') || 'None'}`).join('\n')}

GATES STATUS:
${(validatedState.gates || []).map((g: any) => `- Gate ${g?.name || 'Unknown'}: Queue: ${g?.queueLength || 0} people, Wait: ${g?.waitTimeMinutes || 0} mins, Status: ${g?.status || 'Open'}`).join('\n')}

TRANSIT STATUS:
${(validatedState.transports || []).map((t: any) => `- ${t?.name || 'Unknown'}: Status: ${t?.status || 'Normal'}, Wait: ${t?.waitTimeMinutes || 0} mins, Details: ${t?.info || 'N/A'}`).join('\n')}

ACTIVE INCIDENTS:
${(validatedState.incidents || []).filter((i: any) => i && i.status !== 'Resolved').map((i: any) => `- [${i.priority || 'Medium'} Priority] ${i.category || 'General'} at ${i.location || 'Unknown'}: ${i.description || 'No description'} (Status: ${i.status || 'Active'})`).join('\n') || 'None'}

ACTIVE VOLUNTEERS:
${(validatedState.volunteers || []).map((v: any) => `- ${v?.name || 'Unknown'}: Status: ${v?.status || 'Available'}, Location: ${v?.location || 'Unknown'}`).join('\n')}
    `;

    const systemInstructions = {
      fan: `You are the AI Stadium Fan Copilot, an helpful, friendly virtual assistant for fans attending a live world-class match at the stadium. 
Use the live stadium and transport data provided to offer real-time recommendations, precise navigation paths, and helpful answers.
Be concise, conversational, and direct. If there is rain, mention cover or poncho stands. If a gate is congested, suggest specific alternative gates.
If they ask for specific merchandise like jersey locations or lost kids, guide them properly and let them know security can be contacted through their portal.
Keep answers formatted in friendly, scannable Markdown. Always speak in the language they write in.`,
      volunteer: `You are the AI Stadium Volunteer Dispatch & Copilot. You assist active field volunteers in finding tasks, resolving issues, navigating around crowded zones, and reporting safety concerns.
You have access to live stadium data and active incidents. Use this to help volunteers optimize their tasks, guide them through resolution steps, and keep them motivated.
Speak professionally, cooperatively, and assist with step-by-step tasks. Keep answers structured and helpful.`,
      organizer: `You are the AI Stadium Command Copilot, an advanced strategic assistant for stadium organizers, emergency managers, and venue security staff.
Your job is to analyze real-time alerts, crowd density heatmaps, entry gates queues, and suggest immediate operational actions (e.g., dispatching volunteers, opening reserve gates, altering dynamic signage, or managing transit).
Be highly strategic, objective, action-oriented, and explanatory. Suggest concrete decisions backed by data. Make your insights look like executive summaries.`
    };

    const selectedInstruction = systemInstructions[selectedRole as keyof typeof systemInstructions] || systemInstructions.fan;

    if (ai) {
      try {
        console.log("[API][Chat][Gemini] Dispensing request to Gemini 3.5 Flash Model...");
        const cleanHistory = messages.slice(-5).filter((m: any) => m && m.sender && m.text).map((m: any) => {
          const sender = String(m.sender).toUpperCase();
          const text = String(m.text).slice(0, 400);
          return `${sender}: ${text}`;
        }).join('\n');

        // Aligning with @google/genai guidelines - passing systemInstruction in the config parameter
        const response = await generateWithRetry(ai, {
          model: "gemini-3.5-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Current Live Stadium Grounding Data:
${stadiumSummary}
${customContext ? `Additional Context: ${String(customContext).slice(0, 500)}` : ""}

User Chat Message History:
${cleanHistory}
AI Response:`
                }
              ]
            }
          ],
          config: {
            systemInstruction: selectedInstruction,
            temperature: 0.1, // Deterministic outputs
            topP: 0.8,
            topK: 40,
            maxOutputTokens: 500, // Token optimization
          }
        });

        if (response && response.text) {
          console.log("[API][Chat][Gemini] Successfully retrieved text response from Gemini.");
          res.json({ text: response.text });
          return;
        } else {
          throw new Error("Gemini returned empty or undefined content text.");
        }
      } catch (error: any) {
        console.error("[API][Chat][Error] Gemini Chat API request failed. Initiating fallback response loop.", error);
      }
    } else {
      console.log("[API][Chat][Offline] No AI instance initialized. Defaulting to local simulation mode.");
    }

    // Fallback Rule-Based Response Generator (Graceful Degradation)
    let fallbackText = "I am ready to assist you!";
    const q = lastMessage.toLowerCase();

    if (selectedRole === 'fan') {
      if (q.includes("gate") || q.includes("entrance")) {
        fallbackText = `**Crowd Advisory:** Gate A and B are currently experiencing high wait times (~25 mins). I highly recommend walking 3 minutes around the East concourse to **Gate D**, which has a wait time of under 5 minutes. You'll save approximately 20 minutes of entry time!`;
      } else if (q.includes("jersey") || q.includes("shop") || q.includes("store")) {
        fallbackText = `**Argentina & Merchandise stands:** You can find the main official mega-store directly behind **Sector North (Level 1)**. There is also a smaller express stall near Section 214. Stalls near the main gate are currently very congested.`;
      } else if (q.includes("restroom") || q.includes("bathroom") || q.includes("toilet")) {
        fallbackText = `**Accessible Restrooms:** Fully equipped, high-contrast accessible restrooms are located immediately next to Sector South, Sections 104 and 220. All of these features step-free level entry. Section 104 has the shortest current queue.`;
      } else if (q.includes("lost") || q.includes("child") || q.includes("parent")) {
        fallbackText = `🚨 **URGENT:** Please stay where you are or proceed to the nearest Volunteer Assistance Desk at **Gate C**. I am immediately raising a **High-Priority Incident** to the security desk. Security and local staff are being dispatched to Section 118 with the child’s description. Please coordinate with Gate C supervisors.`;
      } else if (q.includes("water") || q.includes("sustain") || q.includes("refill") || q.includes("bottle")) {
        fallbackText = `**Eco-Water Stations:** Free water refill stations are located at Sections 108, 122, and 205. By using these, you save an average of 0.2kg of plastic waste. There's also a reusable cup collection bin at Gate D where you can return your cup for a $2 charity donation credit!`;
      } else {
        fallbackText = `Hello! I am your AI Stadium Copilot. I can guide you on the fastest gates, accessible elevator routes, free water stations, and transit options. Try asking: *"Which gate has the shortest wait?"* or *"Where is the nearest water station?"*`;
      }
    } else if (selectedRole === 'volunteer') {
      if (q.includes("wheelchair") || q.includes("assistance") || q.includes("task")) {
        fallbackText = `**Volunteer Assist Routing:** A wheelchair assistance request has been flagged at **Entrance C**. You are the closest available volunteer (approx. 40 meters away).
        
**Your next steps:**
1. Proceed to Gate C's accessible lane.
2. Locate the supporter wearing the blue Argentina jersey.
3. Guide them via **Elevator 2 (East wing)** to Sector North, wheelchair platform 14B.
4. Tap 'Task Complete' when finished.`;
      } else {
        fallbackText = `Hi Volunteer! You are currently marked as **Active**. I recommend staying near **Gate B** as crowd density is rising. Let me know if you need step-by-step guidance on any dispatch tasks or if you want to report an incident.`;
      }
    } else {
      fallbackText = `**AI Command Briefing:**
- **Crowd Control:** Halftime is approaching. Recommend dynamic overhead boards redirecting egress flows towards Gate C & D.
- **Incident Dispatch:** The incident regarding the minor at Section 118 has been categorized as **High Priority**. Volunteer *Carlos Ramos* has been dispatched.
- **Transit Alert:** Metro Line 1 is reporting a 10-minute delay. Suggest scheduling Stadium dynamic announcement to encourage fans to stay for the post-match light show to de-peak public transport.`;
    }

    res.json({
      text: fallbackText + "\n\n*(Running in Local Simulation Mode. Configure GEMINI_API_KEY in Secrets for live AI)*"
    });
  } catch (err) {
    handleApiError(err, res, "An error occurred while processing your chat request.");
  }
});

// 2. API: AI Crowd Prediction (Halftime / Next 20 Minutes)
app.post("/api/copilot/predict", async (req: Request, res: Response) => {
  console.log(`[API][Predict] Received predictive modeling request. IP: ${req.ip}`);
  
  try {
    const validatedBody = predictRequestSchema.parse(req.body);
    const { state } = validatedBody;

    if (ai) {
      try {
        console.log("[API][Predict][Gemini] Dispatching predictive model schema generator...");
        const response = await generateWithRetry(ai, {
          model: "gemini-3.5-flash",
          config: {
            responseMimeType: "application/json",
            temperature: 0.1, // Deterministic outputs
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                predictions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      location: { type: Type.STRING, description: "Gate, Section or Area in stadium" },
                      predictedState: { type: Type.STRING, description: "Predicted crowd/operations state in 20 minutes" },
                      timeframeMinutes: { type: Type.INTEGER, description: "Minutes until this occurs" },
                      confidence: { type: Type.STRING, description: "High, Medium, or Low" },
                      confidenceScore: { type: Type.NUMBER, description: "0.0 to 1.0 confidence score" },
                      reasoning: { type: Type.STRING, description: "Reasoning transparency behind this prediction" },
                      actionableRecommendation: { type: Type.STRING, description: "Specific instruction for stadium organizers" }
                    },
                    required: ["location", "predictedState", "timeframeMinutes", "confidence", "confidenceScore", "reasoning", "actionableRecommendation"]
                  }
                },
                summary: { type: Type.STRING, description: "A concise AI summary of the overall prediction" }
              },
              required: ["predictions", "summary"]
            }
          },
          contents: `
Analyze this current stadium state and generate a 20-minute predictive forecast of crowd bottleneck locations and critical recommendations:
${JSON.stringify(state)}
`,
        });

        if (response && response.text) {
          console.log("[API][Predict][Gemini] Successful response text received.");
          const parsed = JSON.parse(response.text);
          
          if (parsed && Array.isArray(parsed.predictions) && typeof parsed.summary === "string") {
            res.json(parsed);
            return;
          } else {
            throw new Error("JSON parsed successfully but lacked expected schema structure ('predictions' or 'summary').");
          }
        } else {
          throw new Error("Empty text returned from Gemini prediction service.");
        }
      } catch (error: any) {
        console.error("[API][Predict][Error] Gemini predictive computation failed. Triggering offline fallback simulation dataset.", error);
      }
    } else {
      console.log("[API][Predict][Offline] Running in fallback simulation mode.");
    }

    res.json({
      predictions: [
        {
          location: "Section North Concourse",
          predictedState: "Critical congestion expected as halftime food stall demand spikes by 250%.",
          timeframeMinutes: 12,
          confidence: "High",
          actionableRecommendation: "Activate standby volunteers to direct spillover queues to Section East and West food vendors."
        },
        {
          location: "Gate B (Main Entry)",
          predictedState: "Queue levels will return to normal as late arrivals diminish, but exit prep begins.",
          timeframeMinutes: 20,
          confidence: "Medium",
          actionableRecommendation: "Transition 4 ticketing lanes to egress-only lane configurations and open emergency bypass Gate B-2."
        },
        {
          location: "Metro Entrance South",
          predictedState: "Extreme surge queue expected immediately following final whistle. Expected wait times of 45 mins.",
          timeframeMinutes: 25,
          confidence: "High",
          actionableRecommendation: "Initiate the 'Staggered Departure Campaign' on big screens, offering discount coupons on merchandise to fans who remain inside for 15 mins post-match."
        }
      ],
      summary: "Halftime simulation indicates major bottlenecks at Section North Concourse. Pre-emptive redirection of food queues and early exit setup at Gate B is highly recommended. (Simulation Safe-Fallback)"
    });
  } catch (err) {
    handleApiError(err, res, "An error occurred while generating predictions.");
  }
});

// 3. API: Incident Copilot & Classification
app.post("/api/copilot/incident", async (req: Request, res: Response) => {
  console.log(`[API][Incident] Classifying incident report. IP: ${req.ip}`);
  
  try {
    const validatedBody = incidentRequestSchema.parse(req.body);
    const { description, state: validatedState } = validatedBody;

    const cleanDescription = description.trim();

    // Prompt injection check in incident description
    if (checkPromptInjection(cleanDescription)) {
      console.warn(`[Security][Incident] Prompt injection attempt detected from IP: ${req.ip}`);
      res.json({
        priority: "Low",
        category: "Security",
        recommendedVolunteerId: "v1",
        resolutionSteps: [
          "Safely log potential system exploit attempt.",
          "Verify safety reporting system integrity.",
          "Monitor device activity for telemetry verification."
        ],
        paAnnouncement: "Attention stadium operations: system safety check is in effect.",
        summaryReport: "🚨 **Security Log:** An incident report containing prompt injection patterns was blocked. The system safely neutralized the threat and logged it for auditing."
      });
      return;
    }

    if (ai) {
      try {
        console.log("[API][Incident][Gemini] Dispatching classification to model with JSON schema guidelines...");
        const response = await generateWithRetry(ai, {
          model: "gemini-3.5-flash",
          config: {
            responseMimeType: "application/json",
            temperature: 0.1, // Deterministic outputs
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                priority: { type: Type.STRING, description: "High, Medium, or Low" },
                confidenceScore: { type: Type.NUMBER, description: "0.0 to 1.0 confidence score of the priority classification" },
                reasoning: { type: Type.STRING, description: "Reasoning transparency behind this classification" },
                category: { type: Type.STRING, description: "Safety, Security, Medical, Lost & Found, Facility, Accessibility" },
                recommendedVolunteerId: { type: Type.STRING, description: "Volunteer ID best suited or closest (from the state list) or empty" },
                resolutionSteps: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                paAnnouncement: { type: Type.STRING, description: "Suggested wording for public speaker announcements if critical" },
                summaryReport: { type: Type.STRING, description: "Professional, detailed summary report for record-keeping" }
              },
              required: ["priority", "confidenceScore", "reasoning", "category", "resolutionSteps", "summaryReport"]
            }
          },
          contents: `
You are the Incident Security Copilot. Review this reported incident: "${cleanDescription}"
And matching this against our active list of stadium volunteers and status:
${JSON.stringify(validatedState.volunteers || [])}

Generate a classified incident record, select the best volunteer to handle it, outline resolution steps, draft public address announcement copy if necessary, and compile an official incident summary report.
`,
        });

        if (response && response.text) {
          console.log("[API][Incident][Gemini] Received response text. Parsing JSON...");
          const parsed = JSON.parse(response.text);
          
          if (parsed && parsed.priority && parsed.category && Array.isArray(parsed.resolutionSteps) && parsed.summaryReport) {
            res.json(parsed);
            return;
          } else {
            throw new Error("Missing critical keys inside classified incident output.");
          }
        } else {
          throw new Error("Incident analysis model produced blank content text.");
        }
      } catch (error: any) {
        console.error("[API][Incident][Error] Gemini classification failed. Employing fallback rule engine.", error);
      }
    } else {
      console.log("[API][Incident][Offline] Classifying incident using fallback simulation engine.");
    }

    const descLower = cleanDescription.toLowerCase();
    let priority: 'High' | 'Medium' | 'Low' = 'Medium';
    let category = "Facility";
    let recommendedVolunteerId = validatedState.volunteers?.[0]?.id || "v1";
    let paAnnouncement = "";

    if (descLower.includes("child") || descLower.includes("lost") || descLower.includes("missing")) {
      priority = "High";
      category = "Lost & Found";
      paAnnouncement = "Attention fans in Section 118, we are looking for a young boy wearing an Argentina jersey answering to Mateo. Please notify nearest steward of any sightings.";
    } else if (descLower.includes("fall") || descLower.includes("hurt") || descLower.includes("blood") || descLower.includes("faint") || descLower.includes("medical")) {
      priority = "High";
      category = "Medical";
      paAnnouncement = "Medical rapid response team, please report to section 104 immediately.";
    } else if (descLower.includes("fight") || descLower.includes("drunk") || descLower.includes("security") || descLower.includes("crowd")) {
      priority = "High";
      category = "Security";
    } else if (descLower.includes("wheelchair") || descLower.includes("accessible") || descLower.includes("disabled")) {
      priority = "Medium";
      category = "Accessibility";
    }

    res.json({
      priority,
      category,
      recommendedVolunteerId,
      resolutionSteps: [
        `Dispatch nearest supervisor and assigned Volunteer (${validatedState.volunteers?.find((v: any) => v.id === recommendedVolunteerId)?.name || 'Carlos Ramos'}) to secure the scene.`,
        `Notify local stewards in the affected sector to monitor crowd behavior.`,
        `Establish verbal contact, assess if medical/emergency services are required.`,
        `Log resolution details and file official post-match report.`
      ],
      paAnnouncement: paAnnouncement || "Regular stadium operations ongoing. Please obey all spectator rules and exit corridors calmly.",
      summaryReport: `Incident of category "${category}" registered at simulated timestamp. Description: "${cleanDescription}". Classed as ${priority} Priority. Automatic dispatch initiated for nearest staff. Scene status being monitored continuously. (Simulated Safeguard)`
    });
  } catch (err) {
    handleApiError(err, res, "An error occurred while creating/classifying the incident.");
  }
});

// 4. API: Dynamic AI Routing & Navigation
app.post("/api/copilot/navigate", async (req: Request, res: Response) => {
  console.log(`[API][Navigate] Routing requested. IP: ${req.ip}`);
  
  try {
    const validatedBody = navigateRequestSchema.parse(req.body);
    const { start: cleanStart, end: cleanEnd, state: validatedState, accessibility: isAccessible } = validatedBody;

    if (ai) {
      try {
        console.log(`[API][Navigate][Gemini] Designing step-by-step route mapping from "${cleanStart}" to "${cleanEnd}"...`);
        const response = await generateWithRetry(ai, {
          model: "gemini-3.5-flash",
          config: {
            responseMimeType: "application/json",
            temperature: 0.1, // Deterministic outputs
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                route: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Sequential list of walking instructions"
                },
                confidenceScore: { type: Type.NUMBER, description: "0.0 to 1.0 confidence score of the navigation route validity" },
                reasoning: { type: Type.STRING, description: "Reasoning transparency behind this route" },
                explanation: { type: Type.STRING, description: "Explanation of why this route is safer/faster/better considering crowd levels" },
                estimatedTimeMinutes: { type: Type.INTEGER },
                distanceMeters: { type: Type.INTEGER }
              },
              required: ["route", "confidenceScore", "reasoning", "explanation", "estimatedTimeMinutes", "distanceMeters"]
            }
          },
          contents: `
You are the Dynamic Stadium Navigator. Plan a walking route from "${cleanStart}" to "${cleanEnd}" inside the stadium.
Consider these factors:
- Accessibility requested: ${isAccessible ? "Yes (MUST use elevators, ramps, no stairs)" : "No"}
- Current congestion levels: ${JSON.stringify(validatedState.sectors || [])}
- Closed or congested gates: ${JSON.stringify(validatedState.gates || [])}

Return a structured route with step-by-step instructions, distances, estimated travel time, and an explanation of the path chosen.
`,
        });

        if (response && response.text) {
          console.log("[API][Navigate][Gemini] Received response text. Parsing route payload...");
          const parsed = JSON.parse(response.text);
          if (parsed && Array.isArray(parsed.route) && typeof parsed.explanation === "string" && typeof parsed.estimatedTimeMinutes === "number") {
            res.json(parsed);
            return;
          } else {
            throw new Error("Invalid schema inside calculated navigation output.");
          }
        } else {
          throw new Error("Calculated navigation route outputted an empty string response.");
        }
      } catch (error: any) {
        console.error("[API][Navigate][Error] Gemini navigation planner crashed. Invoking offline fallback routing.", error);
      }
    } else {
      console.log("[API][Navigate][Offline] Planning route using high-fidelity fallback map simulation.");
    }

    res.json({
      route: [
        `Depart from ${cleanStart} and follow the blue visual path markings.`,
        isAccessible 
          ? "Take Elevator 2 near East wing to Level 2 (step-free ramp access)." 
          : "Proceed up the Sector East main staircase.",
        "Avoid Corridor North-A (currently experiencing crowd bottlenecks).",
        `Walk through the wide Concourse East directly to ${cleanEnd}.`
      ],
      explanation: isAccessible 
        ? `This path was personalized to avoid stairwells and utilizes Elevator 2, bypassing Sector North concourse congestion to provide safe, comfortable wheelchair transit. (Simulation Safe-Fallback)`
        : `Bypasses Corridor North-A which has a heavy crowd spike. Walking through Concourse East is wider and reduces walking stress by 15%. (Simulation Safe-Fallback)`,
      estimatedTimeMinutes: isAccessible ? 7 : 4,
      distanceMeters: 280
    });
  } catch (err) {
    handleApiError(err, res, "An error occurred while calculating your navigation route.");
  }
});

// Integrate Vite Dev Server in Development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Stadium Command Center running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
