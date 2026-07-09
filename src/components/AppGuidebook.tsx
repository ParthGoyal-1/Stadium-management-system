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
  Sparkles 
} from "lucide-react";

interface AppGuidebookProps {
  isOpen: boolean;
  onClose: () => void;
}

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
              <span>5. Presets & Scenarios</span>
            </button>
          </div>

          {/* Scrollable Content Container */}
          <div className="flex-1 p-6 md:p-8 overflow-y-auto scrollbar-thin space-y-6">
            
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
                    The Stadium Digital Command Center is a mock-live, fully simulated sports and entertainment venue ecosystem. It serves as a visual playground where you can model game-day crowd pressures, dispatch ground-crew volunteers, and query dynamic AI copilots.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950/20 border border-slate-850/80 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 font-mono">Core Ecosystem Elements</h4>
                    <ul className="space-y-2.5 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <Clock className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-200">Simulated Time Clock:</strong> Continually advances, shifting stadium entry & exit demands in sync with matches.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Cloud className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-200">Weather States:</strong> High wind, rainy conditions, or heat changes seating comfort and transit arrival timings.
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Activity className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-200">Telemetry Sensor Map:</strong> Displays visual real-time occupancies across North, South, East, and West sectors plus Gates A, B, C, D.
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-950/20 border border-slate-850/80 rounded-2xl p-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-3 font-mono">How the Roles Connect</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">
                      Actions taken in one interface ripple throughout the simulation in real-time:
                    </p>
                    <div className="space-y-2 text-xs text-slate-300">
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Fans Submit Help Requests</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Triggers Ticket</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Organizers Dispatch Work</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">Alerts Volunteers</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 flex items-center justify-between">
                        <span className="font-semibold text-slate-200">Volunteers Log Resolutions</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Clears Stadium Map</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-4 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 mb-1">Quick-Start Tip</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      To experience the full simulator depth, we recommend toggling between roles in the <strong className="text-slate-300">Settings Popover</strong> (passwords are simply <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">volunteer</code> or <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded border border-slate-800">organizer</code>) or running the <strong className="text-slate-300">Interactive Walkthrough Story</strong>!
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
                    Supporter App (Fan Portal Guide)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Simulates the mobile experience of an on-site supporter attending a match. Features navigation help, security feedback, access controls, and an AI chat assistant.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-teal-500/10 text-teal-400 font-mono text-xs font-bold">A</span>
                      <h4 className="text-xs font-bold text-slate-200">AI Smart Advisory &amp; Assistant Chat</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Fans can type normal questions to consult the AI. The assistant parses simulated conditions in real-time. Try asking:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pl-7 pt-1">
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 text-[11px] text-slate-300 italic">
                        &quot;Is Gate B congested?&quot;
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 text-[11px] text-slate-300 italic">
                        &quot;Where is wheelchair access near West Sector?&quot;
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 text-[11px] text-slate-300 italic">
                        &quot;Is metro delayed due to weather?&quot;
                      </div>
                      <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-900 text-[11px] text-slate-300 italic">
                        &quot;Where is the closest medical station?&quot;
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-teal-500/10 text-teal-400 font-mono text-xs font-bold">B</span>
                      <h4 className="text-xs font-bold text-slate-200">Interactive Coordinate Routing Map</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Allows fans to map routes between sectors. Choose starting coordinates (e.g., Sector North) and destination coordinates (e.g., Concession, Transit Hub). Adjust walking speed presets (Relaxed, Moderate, Rush) to estimate arrival times.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-teal-500/10 text-teal-400 font-mono text-xs font-bold">C</span>
                      <h4 className="text-xs font-bold text-slate-200">Accessibility &amp; Special Assist Hotkeys</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      For fans requiring wheelchair assistance, infant strollers, or sensory headsets. Clicking these hotkeys immediately generates an active ground alert, which automatically flows into the Organizer and Volunteer incident lists for active resolution!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: VOLUNTEER PORTAL */}
            {activeSection === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-slate-950/40 border border-slate-850 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl" />
                  <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-sky-400" />
                    Volunteer Portal (Ground Crew Operations)
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Guides on-the-ground support staff. Volunteers receive live assignments, self-report safety anomalies, and record activity logs on their shifts.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-sky-500/10 text-sky-400 font-mono text-xs font-bold">1</span>
                      <h4 className="text-xs font-bold text-slate-200">Duty Status Toggle</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Set status to <span className="text-emerald-400 font-semibold font-mono">Available</span> to receive tasks. Switch to <span className="text-amber-400 font-semibold font-mono">Busy</span> or <span className="text-slate-400 font-semibold font-mono">On Break</span> during downtime. When Busy, the automated command center routing flags you out of instant dispatches.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-sky-500/10 text-sky-400 font-mono text-xs font-bold">2</span>
                      <h4 className="text-xs font-bold text-slate-200">Duty Desk Task Resolution</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      When organizers dispatch tickets, they appear here. Select a ticket (e.g. &quot;Medical assist South Sector&quot;), write brief descriptive actions taken (e.g. &quot;Supplied water and guided fan to Sector medical unit&quot;), and hit <strong className="text-emerald-400">Resolve Task</strong>. This resolves the incident database-wide.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-sky-500/10 text-sky-400 font-mono text-xs font-bold">3</span>
                      <h4 className="text-xs font-bold text-slate-200">Ground Self-Reporting Form</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      Notice an issue on the ground (e.g. wet spills, broken turnstile)? Fill out the brief location coordinates and details to self-report it, alerting other command members immediately.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-sky-500/10 text-sky-400 font-mono text-xs font-bold">4</span>
                      <h4 className="text-xs font-bold text-slate-200">AI Dispatch Logger &amp; Shift Copilot</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pl-7">
                      A specialized AI helper. Read ongoing simulated radio traffic and ask the shift copilot to auto-summarize or format formal shift logs in Markdown layout to ease shift handovers!
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
                    The ultimate control bridge. Used by stadium directors to monitor safety, simulation presets, dispatch issues to volunteers, and analyze predictive models.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-amber-400" />
                      Tab 1: Tour &amp; Telemetry Walkthrough
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed pl-6">
                      Provides story cards representing sequential scenarios. Click on these cards to automatically synchronize active role views, load corresponding stadium simulation presets, and highlight hotspot sectors on the live arena map.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Tab 2: Live Operations Control
                    </h4>
                    <div className="text-xs text-slate-400 leading-relaxed pl-6 space-y-2">
                      <p>
                        <strong>Scenario Preset Engine:</strong> Instant presets to trigger crowd flow conditions (Normal, Rainy delay, Medical Emergency, Halftime, Egress).
                      </p>
                      <p>
                        <strong>Event-Aware Rule Alerts:</strong> Checks current states and flags potential security violations or crowd flow risks proactively.
                      </p>
                      <p>
                        <strong>Incidents Command Desk:</strong> View active complaints or safety alerts. Clicking <strong className="text-amber-400">Dispatch</strong> automatically assigns the ticket to the nearest available on-duty volunteer.
                      </p>
                      <p>
                        <strong>AI Agents Live Network:</strong> An advanced network overlay representing real-time consensus checks running on active IoT crowd sensors.
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/20 border border-slate-850 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-teal-400" />
                      Tab 3: Predictive Analytics &amp; What-If
                    </h4>
                    <div className="text-xs text-slate-400 leading-relaxed pl-6 space-y-2">
                      <p>
                        <strong>Predictive 'What-If' Simulation:</strong> Test scenarios like gate closures or transit delays. Calculates simulated queue growth, evacuation delays, accessibility impact, and suggests fallback crowd routes instantly with confidence ratings.
                      </p>
                      <p>
                        <strong>AI 20-Min Future Forecast:</strong> Run predictive AI analysis of crowd vectors and sensor loading to flag congestion zones before they disrupt fans.
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
                    Simulation Presets &amp; Game-Day Situations
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    The Command Center supports 5 high-fidelity presets simulating the natural pressure waves of a standard sport or music event.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">1. Normal Entry Flow (0-40% Gate Occupancy)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Smooth ticket scans. Crowd is distributed evenly. Weather is clear. Recommended for testing normal fan advisory.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">2. Rainy Delay &amp; Transit Lag (Elevators Caution Mode)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Public transit delayed. Elevated entrance slip risks. Elevators operate in slow safety mode. Test the 'What-If' metro delay simulation.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">3. Medical &amp; Elevator Alert (South Sector Hotspot)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Elevator failure reported in South Sector with an active fan medical assistance ticket. Dispatch a volunteer to resolve this quickly!</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">4. Halftime Concourse Rush (North/East 85% Occupancy)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Concourse zones experience massive food and restroom queues. Sector occupancies rise to maximum warnings. AI suggests dynamic concourse routing.</div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/30 border border-slate-850 flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-slate-200">5. Egress Exit Rush (All Gates 90% Occupancy)</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Full arena exit flow. Crowds streaming towards transport stations. Gate telemetry reflects massive outflows. AI suggests safety advisories for train stations.</div>
                    </div>
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
