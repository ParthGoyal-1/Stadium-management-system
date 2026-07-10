import React, { useState } from "react";
import { 
  X, 
  BookOpen, 
  Compass, 
  Users, 
  Shield, 
  Zap, 
  Activity, 
  Clock, 
  Cloud, 
  Sparkles,
  Award,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  FileText
} from "lucide-react";

interface AppGuidebookProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * AppGuidebook Component.
 * Displays a detailed, comprehensive, tabbed documentation modal explaining all major features,
 * backend API pipelines, step-by-step walkthrough synchronizers, and role interfaces.
 *
 * @component
 */
export default function AppGuidebook({ isOpen, onClose }: AppGuidebookProps) {
  const [activeSection, setActiveSection] = useState<number>(1);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 md:p-6 pointer-events-auto animate-fadeIn"
      id="guidebook-modal"
    >
      {/* Backdrop Click close */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />
      
      {/* Main Modal Box */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full h-[90vh] max-h-[850px] shadow-2xl flex flex-col overflow-hidden animate-scaleIn font-sans">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/10">
              <BookOpen className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-bold tracking-tight text-slate-100 text-base md:text-lg flex items-center gap-2">
                Stadium Command Center — Operations Guidebook
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-500/15 text-teal-400 border border-teal-500/30">
                  v3.5 Manual
                </span>
              </h2>
              <p className="text-xs text-slate-400">Master the interactive simulator, role systems, and AI copilot services</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-slate-100 transition cursor-pointer"
            title="Close Guidebook"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Split layout: Sidebar navigation & main scroll area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-950/30 border-b md:border-b-0 md:border-r border-slate-800/80 p-4 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto scrollbar-none flex-shrink-0">
            <button
              onClick={() => setActiveSection(1)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer text-left whitespace-nowrap md:w-full ${
                activeSection === 1
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Compass className="w-4 h-4 flex-shrink-0" />
              <span>1. Platform Overview</span>
            </button>
            <button
              onClick={() => setActiveSection(2)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer text-left whitespace-nowrap md:w-full ${
                activeSection === 2
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Users className="w-4 h-4 flex-shrink-0" />
              <span>2. Supporter App</span>
            </button>
            <button
              onClick={() => setActiveSection(3)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer text-left whitespace-nowrap md:w-full ${
                activeSection === 3
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span>3. Volunteer Portal</span>
            </button>
            <button
              onClick={() => setActiveSection(4)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer text-left whitespace-nowrap md:w-full ${
                activeSection === 4
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Zap className="w-4 h-4 flex-shrink-0" />
              <span>4. Organizer Cockpit</span>
            </button>
            <button
              onClick={() => setActiveSection(5)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer text-left whitespace-nowrap md:w-full ${
                activeSection === 5
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Activity className="w-4 h-4 flex-shrink-0" />
              <span>5. Presets &amp; Scenarios</span>
            </button>
            <button
              onClick={() => setActiveSection(6)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-bold tracking-wide transition duration-200 cursor-pointer text-left whitespace-nowrap md:w-full ${
                activeSection === 6
                  ? "bg-teal-500 text-slate-950 shadow-md shadow-teal-500/15"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
              }`}
            >
              <Sparkles className="w-4 h-4 flex-shrink-0" />
              <span>6. Co-Agents &amp; Analytics</span>
            </button>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-thin space-y-6 bg-slate-950/10">
            
            {/* SECTION 1: OVERVIEW */}
            {activeSection === 1 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-teal-400" />
                    About Stadium Command Center
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The Stadium Digital Command Center is a high-fidelity, fully integrated sport and entertainment venue operations platform. It acts as a visual digital twin where fans, ground staff volunteers, and command organizers collaborate under unified state engines to guarantee safety, operational throughput, and sustainable event goals.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/20 border border-slate-850/80 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 font-mono">Core Ecosystem Elements</h4>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-200">Centralized State Sync:</strong> Maintains a single source of truth for weather, gate wait times, volunteer coordinates, and active hazards.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Cloud className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-200">Dynamic Telemetry Sensors:</strong> Captures physical stadium metrics across North, South, East, and West sectors, Concessions, and Gates A, B, C, D.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-200">Green Stadium Index:</strong> Monitors the environmental footprint of the event. Moves dynamically based on fans opting in for sustainable meal containers or reusable cups.
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/20 border border-slate-850/80 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 font-mono">How the Roles Connect</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Portals interact fluidly across a shared database model:
                    </p>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Fans trigger help notifications</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Active Ticket</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Organizers dispatch tickets</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Alerts Volunteers</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Volunteers log resolutions</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Clears Stadium Map</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 mb-1">Interactive Walkthrough Narrative</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      To help you test and explore easily, use the <strong className="text-slate-300">Demo Narrative cards</strong> on the Organizer Dashboard. Clicking any narrative step automatically updates the simulator's active states, triggers incidents, highlights map hotspots, and changes your active role automatically!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: SUPPORTER APP */}
            {activeSection === 2 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-400" />
                    Supporter Portal (Fan App Features)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed to simulate the on-site mobile app of a supporter visiting the stadium. It provides navigation assistance, food concessions with green pledge tracking, and a smart AI copilot.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-teal-500/15 text-teal-400 text-xs font-bold font-mono">1</span>
                        <h4 className="text-xs font-bold text-slate-200">AI Congestion Advisory Chat</h4>
                      </div>
                      <span className="text-[10px] text-teal-400 font-mono bg-teal-500/10 px-1.5 py-0.5 rounded">Gemini Grounded</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Fans can text questions naturally to query entry conditions. The server fetches current sensor variables (weather hazards, gate bottlenecks, active incidents) and instructs Gemini to formulate a safe response.
                      <br /><strong className="text-slate-300">Try typing:</strong> <em>"Which gate has the shortest wait time right now?"</em> or <em>"Is Metro delayed?"</em>
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-teal-500/15 text-teal-400 text-xs font-bold font-mono">2</span>
                      <h4 className="text-xs font-bold text-slate-200">Dynamic AI Route Generator</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Provides a visual coordinate-to-coordinate routing calculator. Select starting and destination points (e.g. Sector West to Metro Station). The app calls the backend router to generate step-by-step directions avoiding high-risk sectors or congested bottlenecks.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-teal-500/15 text-teal-400 text-xs font-bold font-mono">3</span>
                      <h4 className="text-xs font-bold text-slate-200">Step-Free Accessibility Toggle</h4>
                      <span className="text-[10px] text-indigo-400 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">High Priority</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Activating the accessibility toggle forces the path generator to calculate a dynamic step-free route, bypassing stairs, narrow escalators, or malfunctioning elevators to construct ramps and lift pathways.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-teal-500/15 text-teal-400 text-xs font-bold font-mono">4</span>
                      <h4 className="text-xs font-bold text-slate-200">Sustainable Concessions Menu</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Allows fans to order hot food and beverages. Opting into the <strong>Eco-Pledge (Compostable tray &amp; Reusable Cup)</strong> claims green coins and directly raises the public <strong>Green Stadium Index</strong> on the Organizer Dashboard!
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-teal-500/15 text-teal-400 text-xs font-bold font-mono">5</span>
                      <h4 className="text-xs font-bold text-slate-200">Instant Wheelchair Assistance Trigger</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Fans requiring physical mobility assistance can tap the hotkey. This automatically spawns a critical, high-priority incident on the central dispatch console, routing Carlos Ramos (or closest available volunteer) to Gate C with a physical wheelchair.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: VOLUNTEER PORTAL */}
            {activeSection === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-400" />
                    Volunteer Portal (Ground Staff Tools)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Designed to simulate the on-duty terminal of field workers (specifically tracking on-duty volunteer Carlos Ramos). Allows ground crews to manage shifts, claim open tasks, report hazards, and log resolutions.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-sky-500/15 text-sky-400 text-xs font-bold font-mono">1</span>
                      <h4 className="text-xs font-bold text-slate-200">Interactive Shift Status Switcher</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Volunteers can toggle between <span className="text-emerald-400 font-semibold">Available</span> (ready to be dispatched), <span className="text-amber-400 font-semibold">Busy</span> (currently resolving a ticket), and <span className="text-slate-400 font-semibold">On Break</span>. The central command dashboard monitors this to block dispatching to resting workers.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-sky-500/15 text-sky-400 text-xs font-bold font-mono">2</span>
                      <h4 className="text-xs font-bold text-slate-200">Self-Reporting Hazard Form (AI-Guided Triage)</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Volunteers can write raw text report descriptions (e.g. <em>"Turnstile card reader at Gate A has shorted out"</em>). Submitting this sends the description to the backend, where it is classified as Facility/Medium priority and logged onto the main map index.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-sky-500/15 text-sky-400 text-xs font-bold font-mono">3</span>
                      <h4 className="text-xs font-bold text-slate-200">Active Task Dispatch &amp; Protocols</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      When a ticket is assigned to you, it locks onto your dashboard. It displays step-by-step resolution steps compiled dynamically by the AI triage engine (e.g., verifying emergency exits, isolating the power supply).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded bg-sky-500/15 text-sky-400 text-xs font-bold font-mono">4</span>
                      <h4 className="text-xs font-bold text-slate-200">Open Alerts Claim Queue</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Shows any unassigned incidents flagged by fans or IoT sensors. Ground volunteers can monitor this queue in real-time and click <strong>Claim Ticket</strong> to manually accept ownership of the ticket, shifting their state to Busy.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1 rounded bg-sky-500/15 text-sky-400 text-xs font-bold font-mono">5</span>
                        <h4 className="text-xs font-bold text-slate-200">Volunteer Copilot Chat Assistant</h4>
                      </div>
                      <span className="text-[10px] text-sky-400 font-mono bg-sky-500/10 px-1.5 py-0.5 rounded">Medical/Safety-Focused</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      A specialized assistant context-tuned for field operations. Volunteers can consult the chat on first-aid protocols, standard safety procedures, elevator keys location, or evacuation staging rules.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 4: ORGANIZER COCKPIT */}
            {activeSection === 4 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Organizer Cockpit (Supervisor Manual)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The central command console. It aggregates real-time metrics, lists incident queues, models predictive what-if bottlenecks, and dispatches field resources.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-slate-200">Tab 1: Narrative &amp; Sensor Map</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-6">
                      Renders the visual map representing the 4 physical sectors (North, South, East, West), the stadium entry gates, and transport lines. It color-codes zones from <strong>Green (Clear)</strong> to <strong>Red (Severe)</strong> depending on sensor density values. Use the top narrative block to run step-by-step game scenarios.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <h4 className="text-xs font-bold text-slate-200">Tab 2: Operations Control Desk</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed pl-6 space-y-2">
                      <p>
                        <strong>Active Incident List:</strong> Tracks all safety incidents. If a ticket is unassigned, operators can click <strong>Auto Dispatch</strong>. The backend checks active volunteer coordinates and status to instantly allocate the best volunteer.
                      </p>
                      <p>
                        <strong>Incident Document Generators:</strong> Highlight any active incident card to access the <strong>PA Announcement Builder</strong> (generates loudspeakers safety script matches) and the <strong>Dossier Report Writer</strong> (writes official logs).
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-400" />
                      <h4 className="text-xs font-bold text-slate-200">Tab 3: Predictive Modeling &amp; Analytics</h4>
                    </div>
                    <div className="text-xs text-slate-400 leading-relaxed pl-6 space-y-2">
                      <p>
                        <strong>AI 20-Min Forecast Engine:</strong> Calls the backend crowd prediction tool to analyze sensor telemetry and forecast hotspots, gate queue growth, and mitigation plans before they trigger in real life.
                      </p>
                      <p>
                        <strong>Scenario 'What-If' Sandbox:</strong> Models custom hypothetical incidents (e.g., Gate closures, elevator outages, train strikes) using localized parameters to calculate simulated exit velocities, risk scales, and dynamic bypass routes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: PRESETS & SCENARIOS */}
            {activeSection === 5 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-teal-400" />
                    Simulated Event Presets
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The platform supports 5 pre-configured arena presets simulating standard crowd movements during an event. Choose these via the Operations Control panel.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">1. Normal Entry Flow (0-40% Gate Occupancy)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Weather is sunny, public transportation runs smoothly, and queues are distributed evenly. Ideal baseline.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">2. Heavy Storm &amp; Transit Delay (Elevator Slow Mode)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Heavy rain delays metro transit. Slippery stairs flag warnings. Elevators operate in a cautious slower speed. Test the "What-If" transit delay simulator under this preset.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">3. Medical &amp; Elevator Alert (South Sector Hotspot)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Triggers a malfunctioning elevator in the South Sector paired with an active fan medical emergency ticket. Excellent for testing active volunteer dispatching and checklist execution.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">4. Halftime Concourse Rush (North/East 85% Occupancy)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Spectators rush concessions and restrooms. Sensor densities reach warning levels. Test the concessions Eco-Pledge options during this rush.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">5. Egress Exit Rush (All Gates 90% Occupancy)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Full arena exit. Massive crowd flows toward public transportation stations. Run the "20-Min Future Forecast" to formulate bottleneck strategies.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 6: CO-AGENTS & ANALYTICS */}
            {activeSection === 6 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Co-Agent Consensus &amp; Operations Debrief
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Learn about the automated multi-agent sensory networks and analytics debrief systems that operate under the hood.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-indigo-400" />
                      Multi-Agent Pipeline
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      At the bottom of the main dashboard, you can see the active Multi-Agent consensus timeline. This visualizes sensory agents parsing hardware telemetry, analyzer agents calculating safety parameters, and coordinator agents proposing dispatch plans.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      Post-Event Analytics Debrief
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      When you conclude your simulated event, consult the Post-Event Debrief tab. It presents overall event safety scores, volunteer dispatch response velocities, overall accessibility satisfaction indices, and concession environmental sustainability scores.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs font-mono text-slate-500">
          <div>
            Read complete: Stadium Command Copilot OS Manual
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold font-sans transition cursor-pointer"
          >
            Close Manual
          </button>
        </div>

      </div>
    </div>
  );
}
