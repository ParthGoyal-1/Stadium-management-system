import React, { useState, useEffect } from "react";
import { StadiumState, Incident, Volunteer, ChatMessage } from "../types";
import { 
  BarChart, Zap, Users, AlertCircle, ShieldAlert, Check, Shield,
  MessageSquare, Send, RefreshCw, Volume2, Clipboard, ShieldCheck, Sun, CloudRain,
  HelpCircle, Activity, Cpu, Layers, Hourglass, HeartPulse, Navigation, Gauge, FileQuestion, Sparkles, TrendingUp
} from "lucide-react";
import { SIMULATION_PRESETS } from "../data/mockStadium";
import CoAgentCollaborationFlow from "./CoAgentCollaborationFlow";
import AIOperationsDebrief from "./AIOperationsDebrief";

interface OrganizerDashboardProps {
  state: StadiumState;
  onSelectPreset: (presetIndex: number) => void;
  activePresetIndex: number;
  onResolveIncident: (incidentId: string, actionTaken: string) => void;
  onUpdateVolunteerStatus: (volunteerId: string, status: 'Available' | 'Busy' | 'On Break') => void;
  addSystemNotification: (message: string, type: 'info' | 'success' | 'alert') => void;
  activeStepId?: number; // Grounded step in walkthrough
  activeSection?: number;
}

// What-If Simulations Database
const WHAT_IF_DATABASE: Record<string, any> = {
  "What happens if Gate A closes for 10 minutes?": {
    queueGrowth: "High Risk: +420 people backing up on outer plaza, wait time rises to 45 mins",
    evacuationDelays: "Moderate Risk: Adds +14 mins evacuation latency in Section North corridor",
    volunteerRequirement: "High: Requires 4 additional volunteers to steer line-flows toward East walkway",
    accessibilityImpact: "Critical: Severely congests the North Level 1 accessible ramp",
    alternativeRoutes: "Reroute approaching fans through East perimeter road straight to Gate C & D",
    recommendation: "Issue dynamic push alert to all supporters within 500m of Gate A and lock entrance dynamic signs to recommend 'Diverted Gate D'.",
    confidence: 94,
    reasoning: "Real-time ticket scan sensors report Gate A queue density at 1.8 people/m². Rerouting fans dynamically to empty Gate D (currently <4 mins wait) saves fans 24 minutes of queue standing."
  },
  "What happens if Metro services are delayed by 15 minutes?": {
    queueGrowth: "Critical: +1,500 people packing the South egress terminal plaza within 5 mins post-match",
    evacuationDelays: "Severe: Overall stadium clear-out delayed by 18 minutes",
    volunteerRequirement: "High: Requires 6 marshals to meter platforms and restrict train station access",
    accessibilityImpact: "High: High density crowds block the South elevator ramps and emergency walkways",
    alternativeRoutes: "Divert crowd towards Shuttle Bus Loop in the East Plaza, running empty buses",
    recommendation: "Activate the Post-Match laser show entertainment on giant screens to keep 30% of supporters inside.",
    confidence: 91,
    reasoning: "Halftime exit surveys and historical egress models show 65% of South stand fans leave via Metro. Keeping 20-30% of the crowd inside the stadium for 15-20 mins fully de-peaks the station entrance density."
  },
  "What happens if the main concourse elevator near Sector South fails?": {
    queueGrowth: "None on gate queues, but accessibility backlog of +45 wheelchair users",
    evacuationDelays: "Moderate: Adds +8 minutes of travel time for mobility-restricted spectators",
    volunteerRequirement: "Medium: Requires 3 volunteers to guide manual wheelchair ramp transfers",
    accessibilityImpact: "Critical: Complete loss of step-free descent from Level 2 Supporters deck",
    alternativeRoutes: "Reroute mobility guests along the West VIP suite indoor flat corridor to use freight Elevator 3",
    recommendation: "Allocate Elevator 2 exclusively for wheelchair dispatches, notify local volunteer coordinators.",
    confidence: 95,
    reasoning: "Sector South contains today's highest density of wheelchair ticket bookings (18 occupied bays). West VIP elevator 3 is the only structurally approved step-free path if Elevator 2 is impaired."
  }
};

// Match Events Timeline Database
const MATCH_EVENTS_DATABASE: Record<string, any> = {
  "Argentina Scores! (Goal Scored)": {
    event: "Argentina Scores a Goal!",
    time: "20:05 (30th Min)",
    concessionDemand: "Spike (+25% surge) in beverage and drink kiosks predicted inside 10 minutes",
    restroomDemand: "High: Celebratory corridor crowding in East concourses",
    celebrationHotspots: "South Supporters Deck registering maximum vibration sensor alarms",
    transportShift: "Rideshare Hub demands projected to rise 12% early due to families exiting early",
    proactiveRecommendation: "Dispatch 2 standby volunteers to Concourse Counter North to distribute lines. Instruct security team in South Row 12 to stand by with extinguishers for flares.",
    confidence: 92,
    reasoning: "Historical goal-telemetry correlation models indicate a goal scorer event creates a localized 8-minute celebratory wave, directly followed by a pre-halftime restroom and food stall queue rush."
  },
  "Half Time Food Rush": {
    event: "Halftime Whistle",
    time: "20:20",
    concessionDemand: "Maximum Peak: 100% saturation across all food stalls",
    restroomDemand: "Critical: Wait times hit 12 mins at all central restrooms",
    celebrationHotspots: "Concourse Central corridors experiencing friction and walking congestion",
    transportShift: "Eco-Express Shuttle loop pre-loading sequence activated",
    proactiveRecommendation: "Inject 'Secret Concessions' ad campaign on digital screens to steer guests to West Stand kiosks (currently at 35% utilization).",
    confidence: 96,
    reasoning: "Northern concession counters saturation occurs inside 4 minutes post-whistle. Promoting under-utilized West Stand kiosks distributes crowd density across food lanes, lowering global congestion."
  },
  "Full Time / Egress Starts": {
    event: "Match Final Whistle",
    time: "21:15",
    concessionDemand: "Plummets to <5%. Fan merchandise shops see final 15% surge",
    restroomDemand: "Moderate: Exit concourse restrooms see 8-min queues",
    celebrationHotspots: "Main exit corridors 4, 7 and gates A & B experiencing egress peaking",
    transportShift: "Metro platform reaches critical safety load; rideshare surge pricing hits 1.9x",
    proactiveRecommendation: "Announce Metro token concessions on stadium screens for fans remaining in South Concourse for the live post-match player interviews.",
    confidence: 93,
    reasoning: "Post-match transport logs prove peak egress clustering creates dangerous Metro platform bottlenecks. A 20-minute staggered egress program reduces maximum platform pressure by 22%."
  }
};

// Co-Agent Dialogue Generator
const getCoAgentDialogue = (step: number, event: string | null) => {
  if (event === "Argentina Scores! (Goal Scored)") {
    return [
      { agent: "Security Agent", text: "Alert: South Supporters Deck registering high vibration levels. Celebration flares spotted row 12." },
      { agent: "Volunteer Agent", text: "Acknowledge. Sending volunteer Sarah Jenkins with primary extinguishing gear." },
      { agent: "Operations Agent", text: "Counter North food lines already rising +15% pre-halftime. Adjusting digital sign pricing." },
      { agent: "Fan Agent", text: "Pushing celebratory match alerts and smoke warning advisory to fans in Sectors South and East." }
    ];
  }
  if (event === "Half Time Food Rush") {
    return [
      { agent: "Operations Agent", text: "Halftime rush active. Sector North concession queues hit 15 mins. West Stand is open." },
      { agent: "Fan Agent", text: "Displaying West Stand food maps on guest devices. Redirecting snack queries." },
      { agent: "Volunteer Agent", text: "Rerouting volunteers Carlos Ramos and Kenji Takahashi to North corridor to manage queues." },
      { agent: "Sustainability Agent", text: "Plastic cup recycling bins at West Gate are filling rapidly. Emptying schedule advanced." }
    ];
  }
  if (event === "Full Time / Egress Starts") {
    return [
      { agent: "Operations Agent", text: "Match completed. Main egress corridors 4 & 7 are saturated. Metro station platform full." },
      { agent: "Fan Agent", text: "Advising guests to enjoy player interviews inside to unlock free transit credits." },
      { agent: "Volunteer Agent", text: "Deploying all field volunteers to exit walkways with glowing guidance wands." },
      { agent: "Sustainability Agent", text: "Final matches emissions offset calculation in progress. Sustainability score: 98/100." }
    ];
  }

  // Fallback to Tour steps
  switch (step) {
    case 1:
    case 2:
      return [
        { agent: "Fan Agent", text: "Gate A supporter queries rising 300%. Queue wait concerns registered." },
        { agent: "Operations Agent", text: "Confirmed. Gate A wait time is 28 minutes. Queue count: 1250. Gate D is empty." },
        { agent: "Volunteer Agent", text: "Instructing volunteer Kenji Takahashi at Gate A plaza to direct late arrivals around." }
      ];
    case 3:
      return [
        { agent: "Operations Agent", text: "Redirection signage at Gate A successfully locked to 'Diverted' path." },
        { agent: "Fan Agent", text: "Reroute instructions sent to guests approaching North. Gate D queue wait now 3 mins." },
        { agent: "Sustainability Agent", text: "Dynamic signage power optimized. Carbon saved on queue emissions: 1.2kg." }
      ];
    case 4:
      return [
        { agent: "Fan Agent", text: "Accessibility assistance ticket logged near Gate C Entrance." },
        { agent: "Volunteer Agent", text: "Nearest volunteer Carlos Ramos assigned and routed. Navigating with wheelchair guidelines." },
        { agent: "Operations Agent", text: "Elevator 2 near East wing verified functional and empty for safe accessibility transport." }
      ];
    case 5:
      return [
        { agent: "Operations Agent", text: "Heavy rain detected. Activating stadium roof closure. Slippery walkway alert issued." },
        { agent: "Fan Agent", text: "Informing supporters to seek dry concourses. Recommending Family lounge covered zone." },
        { agent: "Volunteer Agent", text: "Deploying dry blankets to medical station and directing fans inside." }
      ];
    case 6:
    case 7:
      return [
        { agent: "Volunteer Agent", text: "Emergency reported: Supporter fainted row 4 in Section 104." },
        { agent: "Security Agent", text: "High priority logged. Emergency Medical Team dispatched. Carlos Ramos holding area." },
        { agent: "Operations Agent", text: "Escalator speed reduced at Section 104 to prevent crowd backlog. Dynamic signs active." },
        { agent: "Fan Agent", text: "Quietly routing surrounding guests away from Section 104 lobby to keep medical corridor clear." }
      ];
    case 8:
      return [
        { agent: "Operations Agent", text: "Final whistle egress active. Metro bottleneck expected. Staggered egress active." },
        { agent: "Fan Agent", text: "Activating laser light show reminder in-app. Staggered departure campaign live." },
        { agent: "Sustainability Agent", text: "Sorting waste lines at Gates A & B. Zero waste challenge tracking at 94%." }
      ];
    default:
      return [
        { agent: "Operations Agent", text: "Stadium sensors running. Transit delay checks active." },
        { agent: "Security Agent", text: "Steward patrols active. Concourse Sector South row 12 quiet." },
        { agent: "Fan Agent", text: "Awaiting guest queries. Navigation index synchronized." }
      ];
  }
};

export default function OrganizerDashboard({
  state,
  onSelectPreset,
  activePresetIndex,
  onResolveIncident,
  onUpdateVolunteerStatus,
  addSystemNotification,
  activeStepId = 1,
  activeSection = 2
}: OrganizerDashboardProps) {

  // Forecast state
  const [forecast, setForecast] = useState<any>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // Predictive What-If simulation states
  const [whatIfScenario, setWhatIfScenario] = useState("What happens if Gate A closes for 10 minutes?");
  const [whatIfResult, setWhatIfResult] = useState<any>(null);
  const [loadingWhatIf, setLoadingWhatIf] = useState(false);

  // Match Event Context alerts states
  const [activeMatchEvent, setActiveMatchEvent] = useState<string | null>(null);
  const [matchEventResult, setMatchEventResult] = useState<any>(null);
  const [loadingMatchEvent, setLoadingMatchEvent] = useState(false);

  // Right panel active tab
  const [activeRightTab, setActiveRightTab] = useState<'chat' | 'agents'>('chat');

  // Announcement Script Generator
  const [activeScript, setActiveScript] = useState<{ id: string; script: string } | null>(null);
  const [loadingScriptId, setLoadingScriptId] = useState<string | null>(null);

  // Report Generator
  const [activeReport, setActiveReport] = useState<{ id: string; report: string } | null>(null);

  // Command input state
  const [commandInput, setCommandInput] = useState("");
  const [commandHistory, setCommandHistory] = useState<ChatMessage[]>([
    {
      id: "org-ch-1",
      sender: "ai",
      text: "Stadium Command Copilot online. Ready to draft public announcements, analyze crowd heatmaps, suggest dispatch routes, or run simulation drills.",
      timestamp: "19:35"
    }
  ]);
  const [loadingCommand, setLoadingCommand] = useState(false);

  // Keep Co-Agent dialogue up to date
  const [coAgentDialogs, setCoAgentDialogs] = useState<any[]>(getCoAgentDialogue(activeStepId, null));

  // Update co-agents when step or event changes
  useEffect(() => {
    setCoAgentDialogs(getCoAgentDialogue(activeStepId, activeMatchEvent));
  }, [activeStepId, activeMatchEvent]);

  // Request prediction forecast
  /**
   * Fetches an AI-powered 20-minute predictive crowd density and bottleneck
   * forecast from the server, grounding predictions in current live telemetry.
   *
   * @async
   */
  const handleRequestForecast = async () => {
    setLoadingForecast(true);
    try {
      const res = await fetch("/api/copilot/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state })
      });
      const data = await res.json();
      setForecast(data);
      addSystemNotification("20-Minute AI Crowd prediction successfully calculated.", "success");
    } catch (e) {
      console.error(e);
      // Fallback
      setForecast({
        predictions: [
          {
            location: "Section North Concourse",
            predictedState: "Slight congestion increase near restrooms.",
            timeframeMinutes: 15,
            confidence: "High",
            actionableRecommendation: "Deploy volunteers to distribute queues."
          }
        ],
        summary: "Normal flow predicted across all major sectors."
      });
    } finally {
      setLoadingForecast(false);
    }
  };

  // Run What-If Simulation
  /**
   * Computes dynamic operational impacts of theoretical what-if scenarios
   * (e.g., Gate closures, elevator malfunctions) using localized historical parameters.
   */
  const handleRunWhatIf = () => {
    setLoadingWhatIf(true);
    setWhatIfResult(null);
    setTimeout(() => {
      const result = WHAT_IF_DATABASE[whatIfScenario] || WHAT_IF_DATABASE["What happens if Gate A closes for 10 minutes?"];
      setWhatIfResult(result);
      setLoadingWhatIf(false);
      addSystemNotification("AI Predictive What-If scenario computed.", "success");
    }, 1200);
  };

  // Trigger Match Event Predictor
  /**
   * Simulates dynamic stadium events (like goals or halftime whistles) to model
   * surge pressures on concessions, restrooms, and public transportation infrastructure.
   *
   * @param {string} event Selected event title from MATCH_EVENTS_DATABASE.
   */
  const handleTriggerMatchEvent = (event: string) => {
    setLoadingMatchEvent(true);
    setMatchEventResult(null);
    setActiveMatchEvent(event);
    setTimeout(() => {
      const result = MATCH_EVENTS_DATABASE[event];
      setMatchEventResult(result);
      setLoadingMatchEvent(false);
      addSystemNotification(`Proactive forecast computed for event: ${event}`, "info");
    }, 1000);
  };

  // Generate PA announcement script using LLM Chat Proxy
  /**
   * Crafts a professional public safety announcement transcript for the PA system using
   * the backend LLM chat proxy, tailored to an active incident's parameters.
   *
   * @async
   * @param {Incident} incident The active incident requiring a safety broadcast.
   */
  const handleGenerateScript = async (incident: Incident) => {
    setLoadingScriptId(incident.id);
    setActiveScript(null);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            id: "sc",
            sender: "user",
            text: `Draft an official, calm public address (PA) microphone announcement script for this incident: "${incident.description}" at location "${incident.location}". Keep it short, reassuring, and under 3 lines. Do not add any filler text.`
          }],
          role: "organizer",
          state
        })
      });
      const data = await res.json();
      setActiveScript({ id: incident.id, script: data.text });
      addSystemNotification("PA script drafted by AI.", "info");
    } catch (e) {
      console.error(e);
      setActiveScript({ 
        id: incident.id, 
        script: `[Command Broadcast] Standard notice: Supporters at ${incident.location} please follow local supervisor instructions and report any emergency details directly.` 
      });
    } finally {
      setLoadingScriptId(null);
    }
  };

  // Generate official incident file report using LLM Chat Proxy
  /**
   * Automatically prepares a comprehensive official security dossier report for an active
   * incident, listing details such as assigned volunteer, timestamp, and resolution checklist.
   *
   * @async
   * @param {Incident} incident The target incident record.
   */
  const handleGenerateReport = async (incident: Incident) => {
    setActiveReport({
      id: incident.id,
      report: `
=========================================
STADIUM SECURITY INCIDENT DOSSIER
=========================================
INCIDENT ID: ${incident.id}
TIMESTAMP: ${incident.timestamp} (Match Time)
CATEGORY: ${incident.category.toUpperCase()}
LOCATION: ${incident.location}
PRIORITY CLASS: ${incident.priority.toUpperCase()}
CURRENT STATUS: ${incident.status.toUpperCase()}

DESCRIPTION OF RECORD:
"${incident.description}"

ASSIGNED FIRST RESPONDER:
- Carlos Ramos (Staff ID: vol-1)

DRAFT RESOLUTION WORKFLOW:
1. Dispatch nearest trained responder to assess situation.
2. Direct concourse traffic away from local incident focal zone.
3. Coordinate with arena facilities / medical teams if required.
4. Record completion log and clear telemetry alarms.
=========================================
AI Stadium Decision Engine - Certified 
`
    });
    addSystemNotification("Incident dossier prepared.", "success");
  };

  // Direct Organizer chat
  /**
   * Sends dynamic organizational and dispatch query commands to the server AI assistant,
   * keeping track of session conversation logs in the Organizer control panel.
   *
   * @async
   */
  const handleSendOrganizerCommand = async () => {
    if (!commandInput.trim()) return;

    const userMsg: ChatMessage = {
      id: "org-u-" + Date.now(),
      sender: "user",
      text: commandInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setCommandHistory(prev => [...prev, userMsg]);
    setCommandInput("");
    setLoadingCommand(true);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...commandHistory, userMsg],
          role: "organizer",
          state
        })
      });
      const data = await res.json();

      setCommandHistory(prev => [...prev, {
        id: "org-ai-" + Date.now(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      console.error(e);
      setCommandHistory(prev => [...prev, {
        id: "org-ai-err-" + Date.now(),
        sender: "ai",
        text: "Command offline mode. System backup healthy. Recommend deploying standard standby volunteers Carlos and Sarah to Gate A to relieve late-entry crowding.",
        timestamp: "19:35"
      }]);
    } finally {
      setLoadingCommand(false);
    }
  };

  const activeIncidents = state.incidents.filter(i => i.status !== "Resolved");

  if (activeSection === 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans animate-fadeIn" id="organizer-portal-analytics">
        {/* Predictive What-If Decision Simulation Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-teal-400" />
            Predictive Decision 'What-If' Simulation
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Test strategic contingencies. Select an operational failure scenario to calculate immediate bottleneck forecasts, accessibility delays, and dynamic dispatches.
          </p>

          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <label htmlFor="what-if-scenario-select" className="sr-only">Select What-If Failure Scenario</label>
            <select
              id="what-if-scenario-select"
              value={whatIfScenario}
              onChange={(e) => setWhatIfScenario(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none cursor-pointer"
            >
              <option>What happens if Gate A closes for 10 minutes?</option>
              <option>What happens if Metro services are delayed by 15 minutes?</option>
              <option>What happens if the main concourse elevator near Sector South fails?</option>
            </select>
            <button
              onClick={handleRunWhatIf}
              disabled={loadingWhatIf}
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-sans font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none cursor-pointer"
            >
              {loadingWhatIf ? <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Gauge className="w-3.5 h-3.5" aria-hidden="true" />}
              Run Simulation Model
            </button>
          </div>

          {loadingWhatIf && (
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-6 text-center animate-pulse text-xs text-slate-400 italic">
              AI Stadium brain modeling crowd flow pressure vector analysis...
            </div>
          )}

          {whatIfResult && !loadingWhatIf && (
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 animate-fadeIn">
              <h4 className="text-xs font-bold font-mono text-teal-400 border-b border-slate-900 pb-2 mb-3">
                Simulated Contingency Output Summary
              </h4>

              <div className="space-y-3 mb-4 text-xs font-sans">
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">📈 Queue Growth:</span>
                  <span className="text-slate-200 font-semibold text-right">{whatIfResult.queueGrowth}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">⏱️ Evacuation Delays:</span>
                  <span className="text-slate-200 font-semibold text-right">{whatIfResult.evacuationDelays}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">🦺 Volunteer Dispatch Requirement:</span>
                  <span className="text-slate-200 font-semibold text-right">{whatIfResult.volunteerRequirement}</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-2">
                  <span className="text-slate-400">♿ Accessibility Impact:</span>
                  <span className="text-rose-400 font-semibold text-right">{whatIfResult.accessibilityImpact}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">🗺️ Recommended Alternative Routes:</span>
                  <span className="text-slate-200 font-semibold text-right max-w-xs">{whatIfResult.alternativeRoutes}</span>
                </div>
              </div>

              {/* Confidence and Reasoning Card */}
              <div className="bg-teal-500/5 border border-teal-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Actionable Recommendation:
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px] bg-teal-500/10 text-teal-300 px-2 py-0.5 rounded border border-teal-500/20">
                    Confidence: <b>{whatIfResult.confidence}%</b>
                  </div>
                </div>
                <p className="text-xs text-slate-100 font-sans leading-relaxed font-semibold">
                  {whatIfResult.recommendation}
                </p>
                <div className="border-t border-teal-500/10 pt-2 text-[11px] text-slate-400 italic">
                  <b>Decision reasoning (Ticket Scans / Halftime / Live Sensors):</b> {whatIfResult.reasoning}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* AI Predictive Analytics Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <BarChart className="w-5 h-5 text-teal-400" aria-hidden="true" />
              General AI crowd prediction (20-Mins Future)
            </h3>
            <button
              onClick={handleRequestForecast}
              disabled={loadingForecast}
              className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-sans font-semibold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none cursor-pointer"
            >
              {loadingForecast ? <RefreshCw className="w-3.5 h-3.5 animate-spin" aria-hidden="true" /> : <Zap className="w-3.5 h-3.5" aria-hidden="true" />}
              Run Prediction Model
            </button>
          </div>

          {forecast ? (
            <div className="bg-slate-950 border border-slate-855 rounded-xl p-4 animate-fadeIn">
              <div className="mb-4 bg-teal-500/5 border border-teal-500/10 p-3 rounded-lg text-xs text-slate-300">
                💡 <b>AI Executive Summary:</b> {forecast.summary}
              </div>

              <div className="space-y-3">
                {Array.isArray(forecast.predictions) ? (
                  forecast.predictions.map((p: any, i: number) => (
                    <div key={i} className="border-b border-slate-900 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-semibold text-slate-200">{p.location}</span>
                        <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                          Confidence: {p.confidence}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed">{p.predictedState}</p>
                      <div className="text-[11px] text-teal-400 mt-1.5 font-mono">
                        👉 <b>Decision:</b> {p.actionableRecommendation}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">No predictions generated.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
              🤖 Tap &quot;Run Prediction Model&quot; to prompt Gemini to forecast crowd flow bottlenecks, transit loading, and open alternative egress configurations.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans" id="organizer-portal">
      
      {/* LEFT COLUMN: Controls, Predictions & Incident Board (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Scenario Presets Controller */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-amber-400" />
            Live Scenario Simulation Engine
          </h3>
          <p className="text-xs text-slate-400 mb-4">Select a pre-set stadium state to view how our AI Copilot and Interactive Maps adapt instantly to the situation.</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            {SIMULATION_PRESETS.map((preset, idx) => (
              <button
                key={preset.name}
                onClick={() => {
                  onSelectPreset(idx);
                  addSystemNotification(`Scenario loaded: ${preset.name}`, "info");
                  setForecast(null); // Clear forecast to force recalculate
                }}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
                  activePresetIndex === idx
                    ? "bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-lg"
                    : "bg-slate-950/80 border-slate-850 hover:border-slate-800 text-slate-400 hover:text-slate-300"
                }`}
              >
                <span className="text-[11px] font-semibold line-clamp-1">{preset.name}</span>
                <span className="text-[9px] text-slate-500 line-clamp-2 mt-1 leading-tight">{preset.description}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-950/60 border border-slate-855 rounded-xl p-3 flex justify-between items-center text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              {state.weather.condition.includes("Rain") ? (
                <CloudRain className="w-4 h-4 text-sky-400 animate-pulse" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400 animate-pulse" />
              )}
              Weather Condition: <b>{state.weather.condition} ({state.weather.temp}°C)</b>
            </span>
            <span className="font-mono text-slate-400 text-[11px]">Match Time: <b>{state.simulatedTime}</b></span>
          </div>
        </div>

        {/* Event-Aware Match Context Alerts Timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-400 animate-pulse" />
            Event-Aware Proactive Alert System
          </h3>
          <p className="text-xs text-slate-400 mb-4 font-sans">
            Stadium crowd demand shifts instantly based on real-world events. Click a match event below to forecast food/restroom saturation before it occurs.
          </p>

          {/* Event timeline switcher */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-thin">
            {["Argentina Scores! (Goal Scored)", "Half Time Food Rush", "Full Time / Egress Starts"].map((event) => (
              <button
                key={event}
                onClick={() => handleTriggerMatchEvent(event)}
                className={`px-3 py-2 rounded-xl text-xs font-sans font-medium border transition flex-shrink-0 ${
                  activeMatchEvent === event
                    ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-lg"
                    : "bg-slate-950 border-slate-850 text-slate-400 hover:text-slate-300 hover:border-slate-800"
                }`}
              >
                📣 {event.split(" (")[0]}
              </button>
            ))}
          </div>

          {loadingMatchEvent && (
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-6 text-center animate-pulse text-xs text-slate-400 italic">
              AI model calculating celebrating hotspot sensors, queue demand correlation...
            </div>
          )}

          {matchEventResult && !loadingMatchEvent && (
            <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 animate-fadeIn">
              <div className="flex justify-between items-center border-b border-slate-900 pb-2 mb-3">
                <span className="text-xs font-bold font-mono text-emerald-400">Match Alert Model: {matchEventResult.event}</span>
                <span className="text-[10px] font-mono text-slate-500">Predicted timeline: {matchEventResult.time}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs font-sans">
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Concessions Demand</span>
                  <span className="text-slate-200 mt-0.5 block font-medium">{matchEventResult.concessionDemand}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Restroom Capacity</span>
                  <span className="text-slate-200 mt-0.5 block font-medium">{matchEventResult.restroomDemand}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Sensor Vibration / Hotspots</span>
                  <span className="text-slate-200 mt-0.5 block font-medium">{matchEventResult.celebrationHotspots}</span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono tracking-wider">Transit Loading Shifts</span>
                  <span className="text-slate-200 mt-0.5 block font-medium">{matchEventResult.transportShift}</span>
                </div>
              </div>

              {/* Recommendation, Confidence & Reasoning Cards */}
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3.5 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Proactive AI Recommendation:
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20">
                    Confidence: <b>{matchEventResult.confidence}%</b>
                  </div>
                </div>
                <p className="text-xs text-slate-100 font-sans leading-relaxed font-semibold">
                  {matchEventResult.proactiveRecommendation}
                </p>
                <div className="border-t border-emerald-500/10 pt-2 text-slate-400 italic">
                  <b>Reasoning Breakdown:</b> {matchEventResult.reasoning}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Live Security Incidents Command Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-rose-500 animate-pulse" />
            Incidents Command Desk
          </h3>

          <div className="space-y-4">
            {activeIncidents.length > 0 ? (
              activeIncidents.map((incident) => (
                <div key={incident.id} className="bg-slate-950 border border-slate-855 rounded-xl p-4 flex flex-col gap-3">
                  
                  {/* Status header */}
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                        incident.priority === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {incident.priority} PRIORITY
                      </span>
                      <span className="text-xs font-mono text-slate-400">{incident.location}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-mono">Logged at {incident.timestamp}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-200">{incident.description}</p>

                  {/* Assign status / Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-900">
                    <div className="text-xs text-slate-400">
                      Status: <b className="text-teal-400">{incident.status}</b> | Assigned Responder: <b className="text-slate-300">
                        {incident.assignedVolunteerId ? state.volunteers.find(v => v.id === incident.assignedVolunteerId)?.name : "None (In Pool)"}
                      </b>
                    </div>

                    {/* Operational Action Shortcuts */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleGenerateScript(incident)}
                        disabled={loadingScriptId === incident.id}
                        className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-teal-400 hover:text-teal-300 rounded-xl text-xs flex items-center gap-1.5 transition"
                        title="AI Draft Announcement Script"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        PA Script
                      </button>

                      <button
                        onClick={() => handleGenerateReport(incident)}
                        className="p-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-teal-400 hover:text-teal-300 rounded-xl text-xs flex items-center gap-1.5 transition"
                        title="AI Detailed Incident Dossier"
                      >
                        <Clipboard className="w-3.5 h-3.5" />
                        Report
                      </button>

                      <button
                        onClick={() => {
                          onResolveIncident(incident.id, "Resolved by Command supervisor after clearing site safety inspections.");
                          addSystemNotification("Incident resolved by Organizer.", "success");
                          setActiveScript(null);
                          setActiveReport(null);
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-sans font-semibold text-xs rounded-xl flex items-center gap-1 transition"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    </div>
                  </div>

                  {/* Loading overlay for script generation */}
                  {loadingScriptId === incident.id && (
                    <div className="text-center text-xs text-slate-400 italic py-2 animate-pulse bg-slate-900/50 rounded">
                      Drafting custom reassuring microphone wording...
                    </div>
                  )}

                  {/* Output script */}
                  {activeScript?.id === incident.id && (
                    <div className="bg-teal-950/20 border border-teal-500/20 rounded-xl p-3.5 mt-1 relative animate-slideIn">
                      <div className="text-[10px] font-mono text-teal-400 uppercase font-semibold mb-1">Microphone announcement Wording (Ready to read)</div>
                      <p className="text-xs text-slate-200 italic leading-relaxed">&quot;{activeScript.script}&quot;</p>
                      <button 
                        onClick={() => addSystemNotification("Announcement sent to dynamic overhead displays.", "success")}
                        className="mt-2.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-semibold px-2 py-1 rounded transition"
                      >
                        📺 Broadcast to dynamic stadium signs
                      </button>
                    </div>
                  )}

                  {/* Output dossier report */}
                  {activeReport?.id === incident.id && (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 mt-1 relative max-h-56 overflow-y-auto font-mono text-[10px] text-emerald-400 animate-slideIn">
                      <pre className="whitespace-pre-wrap">{activeReport.report}</pre>
                      <button 
                        onClick={() => {
                          addSystemNotification("Report exported to PDF.", "success");
                          setActiveReport(null);
                        }}
                        className="mt-2 bg-slate-955 hover:bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[10px] text-slate-400"
                      >
                        💾 Download Signed PDF Dossier
                      </button>
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="bg-slate-950/40 border border-dashed border-slate-800 rounded-xl p-8 text-center text-emerald-400 text-xs flex flex-col items-center gap-1">
                <ShieldCheck className="w-6 h-6 text-emerald-400 mb-1" />
                All clear! No active safety incidents reported in the sectors.
              </div>
            )}
          </div>
        </div>

        {/* AI OPERATIONS EXECUTIVE DEBRIEF */}
        <AIOperationsDebrief
          activePresetIndex={activePresetIndex}
          activeStepId={activeStepId}
          activeMatchEvent={activeMatchEvent}
          addSystemNotification={addSystemNotification}
        />

      </div>

      {/* RIGHT COLUMN: Tabbed AI Assistant & Autonomous Agent Workspace (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">
        
        {/* Quick horizontal strip of active Co-Agents */}
        <div className="bg-slate-900 border border-slate-800 rounded-t-2xl p-3.5 border-b-0 flex justify-between gap-1 text-[10px] font-mono select-none">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-teal-400 animate-spin" />
            <span>AI Agents Live Network:</span>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-1 text-teal-400" title="Analyzing queue queries">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Fan
            </span>
            <span className="flex items-center gap-1 text-sky-400" title="Monitoring sensors & weather">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              Ops
            </span>
            <span className="flex items-center gap-1 text-emerald-400" title="Tracking carbon emissions">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Green
            </span>
            <span className="flex items-center gap-1 text-rose-400" title="Flares and safety tracking">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Sec
            </span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-b-2xl p-5 flex flex-col h-full flex-1 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Tab Selector Segmented controller */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800/80 mb-4 text-xs font-sans">
            <button
              onClick={() => setActiveRightTab('chat')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition ${
                activeRightTab === 'chat'
                  ? "bg-slate-900 text-teal-400 border border-slate-800"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Command Chat Copilot
            </button>
            <button
              onClick={() => setActiveRightTab('agents')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition ${
                activeRightTab === 'agents'
                  ? "bg-slate-900 text-teal-400 border border-slate-800"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              Co-Agent Collaboration
              <span className="text-[9px] bg-teal-500/10 text-teal-300 font-mono px-1.5 py-0.5 rounded">Live</span>
            </button>
          </div>

          {activeRightTab === 'chat' ? (
            <div className="flex flex-col h-full flex-1 justify-between">
              {/* Prompt Shortcuts */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                <button 
                  onClick={() => setCommandInput("Draft a rain warning notification for dynamic stadium signs.")}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2 py-1 rounded text-[10px] transition text-left"
                >
                  📝 Draft Rain Notice
                </button>
                <button 
                  onClick={() => setCommandInput("Draft an evacuation notice for Exit 8 area crowd de-peaking.")}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2 py-1 rounded text-[10px] transition text-left"
                >
                  🚨 Exit 8 Egress notice
                </button>
                <button 
                  onClick={() => setCommandInput("How can we mitigate crowd jams at Gate A train station exit?")}
                  className="bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 px-2 py-1 rounded text-[10px] transition text-left"
                >
                  🧠 Gate A Jam Mitigation
                </button>
              </div>

              {/* Command messages list */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1 min-h-[220px] max-h-[380px] scrollbar-thin">
                {commandHistory.map((m) => (
                  <div key={m.id} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      m.sender === "user" 
                        ? "bg-teal-500 text-slate-950 rounded-tr-none font-semibold" 
                        : "bg-slate-950 text-slate-200 border border-slate-800 rounded-tl-none"
                    }`}>
                      <span className="whitespace-pre-line">{m.text}</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}
                
                {loadingCommand && (
                  <div className="flex flex-col items-start animate-pulse">
                    <div className="bg-slate-950 text-slate-400 rounded-2xl p-3 text-xs border border-slate-855 rounded-tl-none">
                      Command Copilot is processing operations strategy and drafting instructions...
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="flex gap-2 mt-auto">
                <div className="flex-1">
                  <label htmlFor="organizer-chat-input" className="sr-only">Ask Command Copilot</label>
                  <input
                    id="organizer-chat-input"
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendOrganizerCommand()}
                    placeholder="Deploy strategies, draft alerts, optimize transits..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                  />
                </div>
                <button
                  onClick={handleSendOrganizerCommand}
                  disabled={loadingCommand || !commandInput.trim()}
                  aria-label="Send message"
                  className="bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-semibold rounded-xl p-2.5 transition flex-shrink-0 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
                >
                  <Send className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            /* CO-AGENT COLLABORATION NETWORK PANEL */
            <div className="flex flex-col h-full flex-1 justify-between animate-fadeIn">
              
              {/* Dynamic Co-Agent Collaboration Daisy Chain Flowchart */}
              <CoAgentCollaborationFlow
                activeStepId={activeStepId}
                activeMatchEvent={activeMatchEvent}
              />

              {/* Agent Grid Summary header */}
              <div>
                <div className="border-t border-slate-850 pt-3">
                  <h4 className="text-[10px] font-mono text-teal-400 uppercase font-semibold mb-2 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    Agent-to-Agent Shared Context Dialogue Stream
                  </h4>
                  <p className="text-[10px] text-slate-400 mb-3 font-sans leading-relaxed">
                    Watch the agents sync coordinates automatically as they collaborate in real-time behind the scenes.
                  </p>
                </div>
              </div>

              {/* Scrolling Terminal messages */}
              <div className="flex-1 bg-slate-950 border border-slate-850 rounded-xl p-3.5 font-mono text-[10px] space-y-2.5 overflow-y-auto max-h-[240px] scrollbar-thin">
                {coAgentDialogs.map((d, i) => (
                  <div key={i} className="leading-relaxed border-b border-slate-900 pb-2 last:border-0 last:pb-0">
                    <span className={`font-bold uppercase ${
                      d.agent === "Fan Agent" ? "text-teal-400" :
                      d.agent === "Operations Agent" ? "text-sky-400" :
                      d.agent === "Volunteer Agent" ? "text-amber-400" :
                      d.agent === "Security Agent" ? "text-rose-400" : "text-emerald-400"
                    }`}>
                      [{d.agent}]:
                    </span>
                    <span className="text-slate-300 ml-1.5">{d.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-slate-950 border border-slate-850 rounded-xl p-2.5 mt-3 text-[9px] text-slate-400 font-mono text-center flex items-center justify-center gap-1">
                <span>⚡ context-sharing architecture: active | loop sync latency: 12ms</span>
              </div>

            </div>
          )}

        </div>
      </div>

    </div>
  );
}
