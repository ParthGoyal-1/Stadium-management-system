import React from "react";
import { 
  Play, ArrowRight, ArrowLeft, RotateCcw, Sparkles, 
  Cpu, CloudRain, Users, Shield, Compass, HeartPulse, RefreshCw
} from "lucide-react";
import { UserRole } from "../types";

export interface DemoStep {
  id: number;
  title: string;
  shortDesc: string;
  fullStory: string;
  role: UserRole;
  presetIndex: number;
  highlightGate: string | null;
  highlightSector: string | null;
  technicalCapability: string;
}

export const DEMO_STEPS: DemoStep[] = [
  {
    id: 1,
    title: "1. Supporters Arrive",
    shortDesc: "Pre-Match Rush begins. Gate A Congested.",
    fullStory: "Welcome to Match Day! Supporters are arriving in massive numbers. Live telemetry sensors detect that Gate A is highly congested with a 28-minute wait time, while Gate D remains empty.",
    role: "fan",
    presetIndex: 0,
    highlightGate: "gate-a",
    highlightSector: null,
    technicalCapability: "Real-time Telemetry Processing & Sensor Simulation"
  },
  {
    id: 2,
    title: "2. AI Predicts Queues",
    shortDesc: "Predictive model warns of Gate A gridlock.",
    fullStory: "Instead of reacting when it's too late, the Command Copilot runs a predictive simulation. It estimates that in 12 minutes, the queue at Gate A will overflow. It recommends redirecting traffic.",
    role: "organizer",
    presetIndex: 0,
    highlightGate: "gate-a",
    highlightSector: "sec-north",
    technicalCapability: "Predictive Analytics & Queue Modeling"
  },
  {
    id: 3,
    title: "3. Proactive Redirect",
    shortDesc: "Dynamic signage updated. Redirection route.",
    fullStory: "We issue a proactive redirect instruction. Stadium dynamic boards update to guide fans toward Gate D. The AI shows a 94% confidence recommendation based on walking distances and ticket scans.",
    role: "fan",
    presetIndex: 0,
    highlightGate: "gate-d",
    highlightSector: null,
    technicalCapability: "Confidence Metrics & Grounded Decision Reasoning"
  },
  {
    id: 4,
    title: "4. Accessibility Support",
    shortDesc: "Wheelchair fan dispatched step-free path.",
    fullStory: "A supporter requiring accessibility support requests assistance near Gate C. The Fan App instantly crafts a stairs-free route using Elevator 2 and dispatches closest volunteer Carlos Ramos.",
    role: "fan",
    presetIndex: 0,
    highlightGate: "gate-c",
    highlightSector: "sec-south",
    technicalCapability: "Dynamic Stairs-Free Navigation Routing"
  },
  {
    id: 5,
    title: "5. Sudden Thunderstorm",
    shortDesc: "Weather shifts. Roof closes. Concourse crowded.",
    fullStory: "Sudden heavy rain starts! The automated roof begins closing. Transit is delayed and fans rush to covered concourses. The AI updates all fans with dynamic rain guidance and ponchos stalls.",
    role: "organizer",
    presetIndex: 1,
    highlightGate: null,
    highlightSector: "sec-north",
    technicalCapability: "Event-Driven Environmental State Management"
  },
  {
    id: 6,
    title: "6. Emergency Medical Alert",
    shortDesc: "Volunteer logs medical incident at Sec 104.",
    fullStory: "A fan in Section 104 faints due to rapid concourse temperature shifts. Carlos logs this with the AI Incident Logger, which instantly classifies it as high-priority medical emergency.",
    role: "volunteer",
    presetIndex: 1,
    highlightGate: null,
    highlightSector: "sec-south",
    technicalCapability: "AI-Powered Incident Classification & Resolution Checklists"
  },
  {
    id: 7,
    title: "7. Autonomous Agent Sync",
    shortDesc: "5 Specialized Agents collaborate live.",
    fullStory: "Behind the scenes, role-specific agents (Fan, Operations, Volunteer, Security, Sustainability) collaborate inside an autonomous loop, sharing context to isolate the zone and dispatch medical kits.",
    role: "organizer",
    presetIndex: 1,
    highlightGate: null,
    highlightSector: "sec-south",
    technicalCapability: "Multi-Agent Collaboration Engine & Context Sharing"
  },
  {
    id: 8,
    title: "8. Final Whistle Egress",
    shortDesc: "Match ends. Staggered egress deactivated congestion.",
    fullStory: "Full time! 50,000 fans prepare to depart. To prevent extreme queues at Metro station, AI triggers a 'Staggered Departure Campaign' on giant screens, offering laser show entertainment.",
    role: "organizer",
    presetIndex: 3,
    highlightGate: "gate-a",
    highlightSector: null,
    technicalCapability: "Demand De-Peaking & Crowd Egress Control"
  }
];

interface DemoNarrativeProps {
  currentStepId: number;
  onStepChange: (stepId: number) => void;
  onResetDemo: () => void;
}

const DemoNarrative = React.memo(function DemoNarrative({
  currentStepId,
  onStepChange,
  onResetDemo
}: DemoNarrativeProps) {
  const stepIndex = currentStepId - 1;
  const currentStep = DEMO_STEPS[stepIndex] || DEMO_STEPS[0];

  return (
    <div className="bg-slate-900 border-2 border-teal-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden font-sans mb-6" id="demo-tour-banner">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-4 z-10 relative">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/15 flex items-center justify-center border border-teal-500/40 animate-pulse">
            <Sparkles className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="font-bold text-sm tracking-tight text-slate-100 uppercase">
              Interactive Story Tour Walkthrough
            </h2>
            <p className="text-[10px] text-slate-400 font-mono">
              Experience the stadium lifecycle step-by-step
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onResetDemo}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800 text-[10px] font-semibold transition focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none cursor-pointer"
            title="Reset Tour"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            Restart
          </button>
          
          <div className="w-px h-4 bg-slate-800" />

          <button
            type="button"
            aria-label="Previous Step"
            disabled={currentStepId === 1}
            onClick={() => onStepChange(currentStepId - 1)}
            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 disabled:opacity-40 border border-slate-800 transition focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>

          <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            {currentStepId} / {DEMO_STEPS.length}
          </span>

          <button
            type="button"
            aria-label="Next Step"
            disabled={currentStepId === DEMO_STEPS.length}
            onClick={() => onStepChange(currentStepId + 1)}
            className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 disabled:opacity-40 transition focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Step Stepper Dot indicators */}
      <div className="flex justify-between gap-1 mb-4 z-10 relative overflow-x-auto py-1 scrollbar-thin" role="tablist" aria-label="Walkthrough chapters">
        {DEMO_STEPS.map((s) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={s.id === currentStepId}
            aria-label={`Go to step ${s.id}`}
            onClick={() => onStepChange(s.id)}
            className={`flex-1 min-w-[32px] h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 outline-none cursor-pointer ${
              s.id === currentStepId
                ? "bg-teal-400 shadow-md shadow-teal-500/20"
                : s.id < currentStepId
                ? "bg-teal-700/85"
                : "bg-slate-800"
            }`}
            title={s.title}
          />
        ))}
      </div>

      {/* Active Step Panel */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start z-10 relative">
        
        {/* Left info (9 cols) */}
        <div className="md:col-span-9 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold font-sans text-teal-400 flex items-center gap-1 bg-teal-500/10 border border-teal-500/20 px-2 py-0.5 rounded-md">
              Current Step: {currentStep.title}
            </span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded-md uppercase">
              Active Role: {currentStep.role.toUpperCase()}
            </span>
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-md">
              🛰️ Cap: {currentStep.technicalCapability}
            </span>
          </div>

          <h3 className="text-slate-100 font-semibold font-sans text-sm mt-1 leading-snug">
            {currentStep.shortDesc}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {currentStep.fullStory}
          </p>
        </div>

        {/* Right shortcut box / Action Guide (3 cols) */}
        <div className="md:col-span-3 bg-slate-950/75 border border-slate-800 rounded-xl p-3 flex flex-col gap-2 self-stretch justify-between">
          <div className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">
            Interactive Action Guide
          </div>
          
          <div className="text-[11px] text-teal-400 leading-tight">
            ⚡ Clicking this step automatically switches the active portal to the <b>{currentStep.role === 'fan' ? 'Supporter App' : currentStep.role === 'volunteer' ? 'Volunteer App' : 'Organizer Portal'}</b> and focuses the map.
          </div>

          {currentStepId < DEMO_STEPS.length ? (
            <button
              type="button"
              onClick={() => onStepChange(currentStepId + 1)}
              className="mt-2 w-full bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 outline-none cursor-pointer"
            >
              Next Story Chapter
              <ArrowRight className="w-3 h-3" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onResetDemo}
              className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-[10px] font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 outline-none cursor-pointer"
            >
              Restart Narrative
              <RotateCcw className="w-3 h-3" aria-hidden="true" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
})

export default DemoNarrative;
