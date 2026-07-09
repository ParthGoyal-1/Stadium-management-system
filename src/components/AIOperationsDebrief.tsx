import React, { useState, useEffect } from "react";
import { 
  FileCheck, TrendingDown, Users, AlertTriangle, ShieldCheck, 
  Hourglass, Zap, Download, RefreshCw, Send, CheckCircle2, ChevronRight, Award
} from "lucide-react";

interface AIOperationsDebriefProps {
  activePresetIndex: number;
  activeStepId: number;
  activeMatchEvent: string | null;
  addSystemNotification: (message: string, type: "info" | "success" | "alert") => void;
}

/**
 * AIOperationsDebrief Component.
 * Compiles a post-event tactical debrief and analytics review, synthesizing lessons
 * from simulated crowd surges, dispatch response rates, accessibility routing completions,
 * and sustainability outcomes.
 *
 * @component
 * @param {AIOperationsDebriefProps} props Component props.
 * @returns {React.ReactElement} The AI post-operations debrief dashboard.
 */
export default function AIOperationsDebrief({
  activePresetIndex,
  activeStepId,
  activeMatchEvent,
  addSystemNotification
}: AIOperationsDebriefProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"executive" | "analytics">("executive");

  // Dynamic metrics depending on scenario
  const getDebriefData = () => {
    switch (activePresetIndex) {
      case 1: // Incident reported or Step 6/7
        return {
          title: "Supporters Congestion & Dispatch Resolution",
          attendance: "52,341",
          predictedBottlenecks: 6,
          preventedBottlenecks: 5,
          queueReduction: "15 mins",
          volunteersDispatched: 19,
          accessibilityCompleted: "100%",
          emissionsReduced: "8%",
          keyLessons: "Maintain secondary standby wardens at Gate A's buffer zone when high-occupancy transport alerts trigger.",
          agentInsights: [
            "Event Agent identified late-arrival crowd spikes 15 minutes prior to queue building.",
            "Operations Agent adjusted dynamic pathfinders, shifting 1,200 fans to East plazas.",
            "Volunteer Agent successfully deployed Kenji Takahashi to direct fans on-foot."
          ]
        };
      case 2: // Severe Weather
        return {
          title: "Microclimate Storm Mitigation Audit",
          attendance: "49,812",
          predictedBottlenecks: 8,
          preventedBottlenecks: 8,
          queueReduction: "22 mins",
          volunteersDispatched: 25,
          accessibilityCompleted: "100%",
          emissionsReduced: "14%",
          keyLessons: "Increase staffing near Gate C during rainy conditions. Pre-deploy indoor anti-slip floor mats near West escalators.",
          agentInsights: [
            "Retractable roof closed automatically 8 minutes before rainfall started.",
            "Indoor food kiosks optimized queue-times, avoiding concourse cluster locks.",
            "Sustainability Agent harvested 42,000 liters of greywater runoff for mechanical systems."
          ]
        };
      case 3: // Egress
        return {
          title: "Post-Match De-Peaking & Staggered Egress",
          attendance: "54,209",
          predictedBottlenecks: 9,
          preventedBottlenecks: 8,
          queueReduction: "24 mins",
          volunteersDispatched: 28,
          accessibilityCompleted: "100%",
          emissionsReduced: "18%",
          keyLessons: "Incentivize local transit credit programs early to flatten the initial 10-minute egress curve.",
          agentInsights: [
            "Laser show entertainment retained 32% of fans inside, preventing platform crush.",
            "Volunteer exit wardens funneled 4,100 supporters toward under-utilized West Bus Loops.",
            "Fan Agent pushed dynamically delayed navigation cards to avoid crowding of Metro staircases."
          ]
        };
      default: // Normal / Supporters Rush
        return {
          title: "Match Summary - Active Phase Operations",
          attendance: "52,341",
          predictedBottlenecks: 7,
          preventedBottlenecks: 6,
          queueReduction: "18 minutes",
          volunteersDispatched: 23,
          accessibilityCompleted: "100%",
          emissionsReduced: "12%",
          keyLessons: "Increase staffing near Gate C during rainy conditions. Pre-stage wheelchair support in south corridor.",
          agentInsights: [
            "Gate A overflow predicted in 12 mins; successfully bypassed 1,800 fans to alternate gates.",
            "Operations Agent adjusted dynamic signage to point to under-utilized Gate D.",
            "Fan app guided wheelchair guests to stair-free routes with 100% on-time arrival."
          ]
        };
    }
  };

  const data = getDebriefData();

  // Handle a simulated "Regenerate/Audit" cycle
  const handleRegenerate = () => {
    setIsGenerating(true);
    addSystemNotification("Synthesizing live telemetry into AI Operations Debrief...", "info");
    setTimeout(() => {
      setIsGenerating(false);
      addSystemNotification("Operations Debrief generated successfully.", "success");
    }, 1200);
  };

  const handleExport = () => {
    addSystemNotification("Executive debrief PDF exported successfully.", "success");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="ai-operations-debrief-card">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-center">
            <FileCheck className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              AI Operations Debrief
              <span className="text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-1.5 py-0.5 rounded uppercase font-normal">
                Synthesized Live
              </span>
            </h3>
            <p className="text-xs text-slate-400">Post-event executive analysis &amp; operational metrics</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="p-2 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-300 transition text-xs flex items-center gap-1.5 font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-teal-400 ${isGenerating ? 'animate-spin' : ''}`} />
            Recalculate
          </button>
          <button
            onClick={handleExport}
            className="p-2 rounded-xl bg-teal-500 hover:bg-teal-600 text-slate-950 font-sans font-bold transition text-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-slate-900 pb-3">
        <button
          onClick={() => setActiveTab("executive")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "executive"
              ? "bg-slate-950 text-teal-400 border border-slate-800"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Executive Summary
        </button>
        <button
          onClick={() => setActiveTab("analytics")}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
            activeTab === "analytics"
              ? "bg-slate-950 text-teal-400 border border-slate-800"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          Co-Agent Audits
        </button>
      </div>

      {isGenerating ? (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
          <p className="text-xs text-slate-400 font-mono italic">AI operations agent processing 10k+ telemetry points...</p>
        </div>
      ) : activeTab === "executive" ? (
        <div className="space-y-4 animate-fadeIn">
          {/* Subtitle / Selected Scope */}
          <div className="bg-slate-950/60 border border-slate-850/60 rounded-xl p-3 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-300">{data.title}</span>
            <span className="text-[10px] font-mono text-slate-500">Status: Verified Ledger</span>
          </div>

          {/* Grid Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Attendance", value: data.attendance, icon: Users, color: "text-slate-200" },
              { label: "Predicted Bottlenecks", value: data.predictedBottlenecks, icon: AlertTriangle, color: "text-amber-400" },
              { label: "Prevented Bottlenecks", value: data.preventedBottlenecks, icon: ShieldCheck, color: "text-emerald-400" },
              { label: "Queue Reduction", value: data.queueReduction, icon: Hourglass, color: "text-teal-400" },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-slate-950/80 border border-slate-850 rounded-xl p-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-tight">{stat.label}</span>
                    <Icon className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span className={`text-sm md:text-base font-extrabold font-mono ${stat.color}`}>{stat.value}</span>
                </div>
              );
            })}
          </div>

          {/* Additional Grid Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-tight block mb-1">Volunteer Dispatches</span>
              <span className="text-sm font-bold font-mono text-slate-200 block">{data.volunteersDispatched} dispatches completed</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-tight block mb-1">Accessibility Requests</span>
              <span className="text-sm font-bold font-mono text-emerald-400 block">{data.accessibilityCompleted} Completed (100% SLA)</span>
            </div>
            <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-3">
              <span className="text-[10px] text-slate-400 uppercase tracking-tight block mb-1">Emissions Reduced</span>
              <span className="text-sm font-bold font-mono text-teal-400 block">-{data.emissionsReduced} carbon offset</span>
            </div>
          </div>

          {/* Key Lessons Learnings */}
          <div className="bg-teal-500/5 border border-teal-500/10 rounded-xl p-4 flex gap-3 items-start">
            <Award className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">Key Executive Lessons:</h5>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{data.keyLessons}</p>
            </div>
          </div>
        </div>
      ) : (
        /* Analytics Co-Agent Audit Log */
        <div className="space-y-2.5 animate-fadeIn">
          {data.agentInsights.map((insight, idx) => (
            <div key={idx} className="bg-slate-950 border border-slate-850/60 p-3 rounded-xl flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-[10px] font-mono text-teal-400 shrink-0 mt-0.5">
                0{idx + 1}
              </span>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">{insight}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
