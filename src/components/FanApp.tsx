import React, { useState, useEffect } from "react";
import { StadiumState, ChatMessage, Incident } from "../types";
import { 
  Send, Compass, HelpCircle, Eye, Accessibility, RefreshCw, 
  Leaf, MapPin, Search, Plane, AlertCircle, ShoppingBag, ShieldAlert, CheckCircle, Navigation
} from "lucide-react";

interface FanAppProps {
  state: StadiumState;
  addIncident: (inc: Incident) => void;
  addSystemNotification: (message: string, type: 'info' | 'success' | 'alert') => void;
  activeFanTab?: number;
}

const FanApp = React.memo(function FanApp({ state, addIncident, addSystemNotification, activeFanTab = 2 }: FanAppProps) {
  // Navigation State
  const [startPoint, setStartPoint] = useState("Gate A (Main North)");
  const [endPoint, setEndPoint] = useState("Sector South (Supporters Deck)");
  const [accessRequired, setAccessRequired] = useState(false);
  const [navResult, setNavResult] = useState<any>(null);
  const [loadingNav, setLoadingNav] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "m-1",
      sender: "ai",
      text: "Hola! Welcome to the Stadium! 🏟️ I am your AI Copilot. I speak any language. Try asking: *'Where is the nearest water station?'*, *'How do I get to Sector South avoiding stairs?'*, or *'Where to buy jerseys?'*",
      timestamp: "19:35"
    }
  ]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState("English");

  // Accessibility State
  const [highContrast, setHighContrast] = useState(false);
  const [signLanguageActive, setSignLanguageActive] = useState(false);
  const [assistanceRequested, setAssistanceRequested] = useState(false);

  // Eco pledge
  const [ecoPledgeClaimed, setEcoPledgeClaimed] = useState(false);

  // Custom Navigation function
  /**
   * Contacts the Dynamic AI Navigation API to generate a personalized step-by-step
   * walking route through the stadium, dynamically avoiding congested zones.
   * Leverages a local fallback route if the cloud server is offline.
   *
   * @async
   */
  const handleCalculateRoute = async () => {
    setLoadingNav(true);
    try {
      const res = await fetch("/api/copilot/navigate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: startPoint,
          end: endPoint,
          state,
          accessibility: accessRequired
        })
      });
      const data = await res.json();
      setNavResult(data);
    } catch (e) {
      console.error(e);
      // Fallback
      setNavResult({
        route: [
          `Depart from ${startPoint}.`,
          accessRequired ? "Use Elevator 2 near East concourse (level access)." : "Take Section 102 entry corridor stairwell.",
          "Avoid congested North food concourse.",
          `Arrive safely at ${endPoint}.`
        ],
        explanation: "Bypassing the central food court bottleneck to optimize crowd flow speeds and comfort.",
        estimatedTimeMinutes: accessRequired ? 9 : 5,
        distanceMeters: 310
      });
    } finally {
      setLoadingNav(false);
    }
  };

  // Custom Chat send
  /**
   * Appends the user's message to the chat history and triggers the multi-role
   * AI Copilot Chat API to retrieve a contextually aware, localized reply.
   *
   * @async
   * @param {string} [overrideText] Optional text to send immediately (e.g., quick suggestions).
   */
  const handleSendChat = async (overrideText?: string) => {
    const textToSend = overrideText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    if (!overrideText) setChatInput("");
    setLoadingChat(true);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...chatHistory, userMsg],
          role: "fan",
          state
        })
      });
      const data = await res.json();

      setChatHistory(prev => [...prev, {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      console.error(e);
      setChatHistory(prev => [...prev, {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: "I am having trouble connecting to the cloud server, but I am operating in offline local safety mode. Please ask at any physical Help Desk if you have an urgent inquiry.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Quick wheelchair assistance alert trigger
  /**
   * Spawns a high-priority incident on the central organizer console
   * requesting physical navigation assistance for a supporter at Gate C.
   * Dispatches the nearest volunteer (Carlos Ramos) instantly.
   */
  const triggerWheelchairAssistance = () => {
    setAssistanceRequested(true);
    const description = "Supporter requesting immediate physical wheelchair navigation assistance near Entrance Gate C (Fan triggered in Accessibility Console).";
    
    const newInc: Incident = {
      id: "inc-acc-" + Date.now(),
      description,
      location: "Gate C Entrance",
      priority: "High",
      status: "Logged",
      assignedVolunteerId: null,
      timestamp: state.simulatedTime,
      category: "Accessibility"
    };

    addIncident(newInc);
    addSystemNotification("Wheelchair Assistance Request logged. Volunteer Carlos Ramos has been alerted.", "success");
    
    setChatHistory(prev => [...prev, {
      id: "ai-acc-" + Date.now(),
      sender: "ai",
      text: "🚨 **Accessibility Assistance Registered:** Your request has been dispatched. **Carlos Ramos** (our nearest trained volunteer) is currently 10m away at Gate C and has been routed to you. Please look for a volunteer with a yellow armband.",
      timestamp: state.simulatedTime
    }]);
  };

  return (
    <div className={`w-full font-sans ${highContrast ? "contrast-125 saturate-150" : ""}`} id="fan-portal">
      
      {/* SECTION 2: AI Smart Advisory Panels & Arena Navigation */}
      {activeFanTab === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn items-start">
          {/* Smart Advisory Cards */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-sky-400" />
                AI Smart Advisory Panels
              </h3>
              
              <div className="space-y-4">
                {/* Gate Congestion Redirect */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-rose-400 font-bold uppercase tracking-wider block mb-1">Gate Bypassing</span>
                    <p className="text-xs text-slate-300">
                      <b className="text-slate-100">Gate A Main North</b> is currently highly congested (28 mins wait).
                    </p>
                  </div>
                  <div className="mt-3 bg-teal-500/5 border border-teal-500/20 rounded-lg p-2 text-[11px] text-teal-400">
                    💡 <b>AI Advice:</b> Walk 3 minutes to <b>Gate C</b>. Queue wait time is under 4 minutes, saving you 24 mins.
                  </div>
                </div>

                {/* Egress Staggered Advice */}
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider block mb-1">Transit Departure Advice</span>
                    <p className="text-xs text-slate-300">
                      Metro Line 1 stations see extreme crowding immediately post-match.
                    </p>
                  </div>
                  <div className="mt-3 bg-sky-500/5 border border-sky-500/20 rounded-lg p-2 text-[11px] text-sky-300">
                    🚇 <b>AI Recommendation:</b> Stay 10 minutes inside for the post-match laser light show. Station lines clear by 40%, saving you 25 mins waiting on platforms!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Navigation Tool */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Navigation className="w-5 h-5 text-teal-400" />
              Dynamic AI Arena Navigation
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="start-point" className="block text-xs font-mono text-slate-400 mb-1">Your Starting Location</label>
                <select 
                  id="start-point"
                  value={startPoint} 
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                >
                  <option>Gate A (Main North)</option>
                  <option>Gate B (South West)</option>
                  <option>Gate C (Accessible Lane)</option>
                  <option>Sector East Concourse</option>
                </select>
              </div>
              <div>
                <label htmlFor="end-point" className="block text-xs font-mono text-slate-400 mb-1">Target Destination</label>
                <select 
                  id="end-point"
                  value={endPoint} 
                  onChange={(e) => setEndPoint(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                >
                  <option>Sector South (Supporters Deck)</option>
                  <option>Argentina Megastore (North Level 1)</option>
                  <option>Sector West VIP Suites</option>
                  <option>Family Lounge (East Concourse)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                <input 
                  type="checkbox" 
                  checked={accessRequired} 
                  onChange={(e) => setAccessRequired(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-teal-500 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <Accessibility className="w-4 h-4 text-sky-400" aria-hidden="true" />
                Stairs-Free Accessibility Route Required (Elevator / Ramp)
              </label>
            </div>

            <button
              onClick={handleCalculateRoute}
              disabled={loadingNav}
              className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-sans font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            >
              {loadingNav ? <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Compass className="w-4 h-4" aria-hidden="true" />}
              Calculate AI-Optimized Walking Route
            </button>

            {navResult && (
              <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-4 animate-fadeIn">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-mono font-semibold text-teal-400">Route Calculated:</span>
                  <span className="text-[11px] font-mono text-slate-400">
                    Est: <b>{navResult.estimatedTimeMinutes} mins</b> | {navResult.distanceMeters}m
                  </span>
                </div>
                <div className="space-y-2 mb-3">
                  {Array.isArray(navResult.route) ? (
                    navResult.route.map((step: string, index: number) => (
                      <div key={index} className="flex gap-2 text-xs text-slate-300 items-start">
                        <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] text-teal-400 flex-shrink-0 font-mono">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{step}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">No route segments calculated.</div>
                  )}
                </div>
                <div className="border-t border-slate-900 pt-2.5 text-[11px] text-slate-400 italic">
                  <b>AI Path Decision reasoning:</b> {navResult.explanation || "None"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SECTION 3: Inclusive Support Desk & Sustainability Console */}
      {activeFanTab === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn items-start">
          {/* Inclusive Support Desk (Accessibility Panel) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                <Accessibility className="w-5 h-5 text-sky-400" aria-hidden="true" />
                Inclusive Support Desk
              </h3>
              <button 
                onClick={() => setHighContrast(!highContrast)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-sans font-medium transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none ${
                  highContrast 
                    ? "bg-sky-500 text-slate-950 border-sky-400" 
                    : "bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-900"
                }`}
              >
                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                High Contrast
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Sign Language Simulator widget */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono text-sky-400 mb-1 font-semibold uppercase tracking-wider">AI Sign Language Avatar</h4>
                  <p className="text-xs text-slate-400 mb-3">Provides instantaneous video translations of public voice announcements for deaf and hard-of-hearing fans.</p>
                </div>

                {signLanguageActive ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 relative aspect-video flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-transparent pointer-events-none" />
                    <div className="flex items-center justify-center h-28 relative">
                      <div className="w-10 h-10 rounded-full bg-slate-700 border border-sky-400/40 relative flex items-center justify-center">
                        <span className="w-4 h-4 bg-sky-400/30 rounded-full" />
                      </div>
                      <div className="absolute w-8 h-8 border border-sky-400/60 rounded-full animate-ping opacity-40 left-12" />
                      <div className="absolute w-6 h-6 border border-teal-400/60 rounded-full animate-ping opacity-40 right-12" />
                      <span className="absolute bottom-2 text-[10px] font-mono text-teal-300 bg-slate-950/80 px-2 py-0.5 rounded border border-teal-500/20">
                        [AI Sign translation active]
                      </span>
                    </div>
                    <div className="bg-slate-950/90 border-t border-slate-800/80 p-1.5 text-[10px] font-mono text-slate-300 text-center rounded">
                      &quot;Gate A congested. Redirect to Gate C. Elevator access clear.&quot;
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSignLanguageActive(true)}
                    className="bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-sans font-medium text-xs py-2 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-sky-400 outline-none"
                  >
                    <Eye className="w-4 h-4 text-sky-400" aria-hidden="true" />
                    Activate Deaf Assist Video Avatar
                  </button>
                )}
              </div>

              {/* Live Volunteer Assistance Trigger */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-mono text-rose-400 mb-1 font-semibold uppercase tracking-wider">Wheelchair / Mobility Assist</h4>
                  <p className="text-xs text-slate-400 mb-3">If you are near a gate and require immediate step-free help, tap below. The system automatically routes the closest available volunteer.</p>
                </div>

                {assistanceRequested ? (
                  <div className="bg-teal-950/30 border border-teal-500/30 rounded-xl p-3 flex items-start gap-2.5">
                    <CheckCircle className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-bold text-teal-300">Request Sent to Dispatch</h5>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Volunteer **Carlos Ramos** has accepted and is navigating. Stay near Gate C accessible lane.
                      </p>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={triggerWheelchairAssistance}
                    className="bg-rose-950/30 hover:bg-rose-950/55 border border-rose-500/30 text-rose-400 font-sans font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 outline-none"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400" aria-hidden="true" />
                    Dispatch Mobility Assistant
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sustainability Goals & Green Meter */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-400" />
                  Sustainability AI Console
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  FIFA Green Initiative
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-center">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">CO₂ Saved</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{state.sustainability.co2SavedKg} kg</div>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-center">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Plastic Reduced</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{state.sustainability.wasteReducedKg} kg</div>
                </div>
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 text-center">
                  <div className="text-[9px] font-mono text-slate-400 uppercase">Water saved</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">{state.sustainability.waterSavedLiters} L</div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-850 rounded-xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-semibold text-slate-200">Personal Eco-Transit Pledge</span>
                  {ecoPledgeClaimed && <span className="text-[10px] font-mono text-emerald-400">Claimed 🏅</span>}
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  By refilling water at Sections 108/122/205 and using the Subway/Metro instead of rideshares, you directly offset carbon emissions.
                </p>
                {ecoPledgeClaimed ? (
                  <div className="bg-emerald-950/20 border border-emerald-500/25 p-2 rounded-lg text-[11px] text-emerald-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" />
                    <span>Dynamic QR generated! Present at any hydration stall for a free reusable cup.</span>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => {
                      setEcoPledgeClaimed(true);
                      addSystemNotification("Eco Badge claimed! CO2 offset offset recorded.", "success");
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-sans font-semibold text-xs py-2 rounded-xl transition cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-500 outline-none"
                  >
                    Sign Eco-Transit Pledge & Claim Solar Cup
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: Multilingual Fan Copilot */}
      {activeFanTab === 4 && (
        <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col h-[520px] relative overflow-hidden animate-fadeIn">
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center border border-teal-500/35">
                <Compass className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <h3 className="font-sans font-semibold text-sm text-slate-100">
                  Multilingual Fan Copilot
                </h3>
                <span className="text-[10px] text-teal-400 font-mono block">Powered by Gemini 3.5 Flash</span>
              </div>
            </div>

            <label htmlFor="language-select" className="sr-only">Select language</label>
            <select
              id="language-select"
              value={activeLanguage}
              onChange={(e) => {
                setActiveLanguage(e.target.value);
                const greeting = {
                  "English": "Hi! How can I help you?",
                  "Spanish": "¡Hola! ¿Cómo te puedo ayudar hoy con el estadio?",
                  "Arabic": "مرحباً! كيف يمكنني مساعدتك في الملعب اليوم؟",
                  "Portuguese": "Olá! Como posso ajudar você no estádio hoje?",
                  "German": "Hallo! Wie kann ich dir heute im Stadion helfen?",
                  "Japanese": "こんにちは！本日はスタジアムのサポートをいたします。"
                }[e.target.value] || "Hello!";
                
                setChatHistory(prev => [...prev, {
                  id: "lang-" + Date.now(),
                  sender: "ai",
                  text: greeting,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
              }}
              className="bg-slate-950 border border-slate-800 text-[10px] font-sans font-medium text-slate-400 rounded px-2 py-1 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500"
            >
              <option>English</option>
              <option>Spanish</option>
              <option>Arabic</option>
              <option>Portuguese</option>
              <option>German</option>
              <option>Japanese</option>
            </select>
          </div>

          {/* Quick suggestions shortcuts */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            <button 
              onClick={() => handleSendChat("Which entrance gate has the shortest queue right now?")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2.5 py-1.5 rounded-lg text-[10px] transition text-left cursor-pointer"
            >
              🚀 Fast Entrance?
            </button>
            <button 
              onClick={() => handleSendChat("Where is the official merchandise stall for Argentina jerseys?")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2.5 py-1.5 rounded-lg text-[10px] transition text-left cursor-pointer"
            >
              👕 Buy Jerseys?
            </button>
            <button 
              onClick={() => handleSendChat("How can I find accessible toilets near section 104?")}
              className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2.5 py-1.5 rounded-lg text-[10px] transition text-left cursor-pointer"
            >
              ♿ Accessible Toilet?
            </button>
            <button 
              onClick={() => handleSendChat("I lost my child near Section 118.")}
              className="bg-slate-950 hover:bg-rose-950/20 border border-rose-500/10 text-rose-400 px-2.5 py-1.5 rounded-lg text-[10px] transition text-left font-semibold cursor-pointer"
            >
              🚨 Lost Child Emergency
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
            aria-live="polite"
            aria-relevant="additions"
          >
            {chatHistory.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  m.sender === "user" 
                    ? "bg-teal-500 text-slate-950 rounded-tr-none font-medium" 
                    : "bg-slate-950/80 text-slate-200 border border-slate-800/80 rounded-tl-none"
                }`}>
                  <span className="whitespace-pre-line">
                    {m.text}
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
            
            {loadingChat && (
              <div className="flex flex-col items-start animate-pulse">
                <div className="bg-slate-950 text-slate-400 rounded-2xl p-3 text-xs border border-slate-850 rounded-tl-none">
                  Copilot is reviewing live sensors and composing recommendations...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex gap-2 mt-auto">
            <div className="flex-1">
              <label htmlFor="fan-chat-input" className="sr-only">Ask Fan Copilot</label>
              <input
                id="fan-chat-input"
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Ask anything (shortest gate, dynamic paths, help)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
              />
            </div>
            <button
              onClick={() => handleSendChat()}
              disabled={loadingChat || !chatInput.trim()}
              aria-label="Send message"
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-semibold rounded-xl p-2.5 transition flex-shrink-0 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            >
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
});

export default FanApp;
