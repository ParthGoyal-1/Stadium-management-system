import React from "react";
import { Plus, Clock, Zap, ChevronRight } from "lucide-react";

interface VolunteerIncidentLoggerProps {
  reportedLocation: string;
  setReportedLocation: (val: string) => void;
  reportText: string;
  setReportText: (val: string) => void;
  isReporting: boolean;
  onReportIncident: () => void;
  recentReportResult: any;
}

/**
 * VolunteerIncidentLogger Component.
 * Provides interactive fields for ground volunteers to log incidents. Passes the text description
 * and location up to the AI-guided triage API, and renders the dynamic classification results, 
 * including suggested resolution checklists and emergency announcer copy.
 *
 * @component
 */
const VolunteerIncidentLogger = React.memo(function VolunteerIncidentLogger({
  reportedLocation,
  setReportedLocation,
  reportText,
  setReportText,
  isReporting,
  onReportIncident,
  recentReportResult
}: VolunteerIncidentLoggerProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl" id="incident-logger-panel">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
        <Plus className="w-5 h-5 text-teal-400" />
        AI-Classified Incident Logger
      </h3>
      <p className="text-xs text-slate-400 mb-4 leading-relaxed">
        Spotted something? Type details below. The AI Copilot will automatically classify priority class, sector routing, and map immediate resolution procedures.
      </p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="spot-location" className="block text-xs font-mono text-slate-400 mb-1">Incident Spot Location</label>
            <select
              id="spot-location"
              value={reportedLocation}
              onChange={(e) => setReportedLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
            >
              <option>Sector North, Section 112</option>
              <option>Sector East, Section 202</option>
              <option>Sector South, Section 104</option>
              <option>Entrance Gate B Plaza</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="describe-see" className="block text-xs font-mono text-slate-400 mb-1">Describe What You See</label>
          <textarea
            id="describe-see"
            rows={3}
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Examples: 'Faint supporter row 4 in Sector South', 'Water spill creating slippery area near concession North', 'Minor fight near turnstile'"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none font-sans"
          />
        </div>

        <button
          onClick={onReportIncident}
          disabled={isReporting || !reportText.trim()}
          className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-sans font-semibold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
        >
          {isReporting ? <Clock className="w-4 h-4 animate-spin" aria-hidden="true" /> : <Zap className="w-4 h-4" aria-hidden="true" />}
          File Incident with AI Auto-Classification
        </button>

        {recentReportResult && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 animate-fadeIn border-l-2 border-l-teal-500">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold text-teal-400 font-mono">Incident Classified:</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                recentReportResult.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {recentReportResult.priority} | {recentReportResult.category}
              </span>
            </div>
            <div className="mb-3">
              <h5 className="text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1.5">Auto-Generated Safeguards</h5>
              <div className="space-y-1.5">
                {Array.isArray(recentReportResult.resolutionSteps) ? (
                  recentReportResult.resolutionSteps.map((step: string, idx: number) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <ChevronRight className="w-3.5 h-3.5 text-teal-400 flex-shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-400">No resolution steps calculated.</div>
                )}
              </div>
            </div>
            <div className="text-[10px] text-slate-400 italic border-t border-slate-900 pt-2">
              <b>Copilot Summary:</b> {recentReportResult.summaryReport}
            </div>
          </div>
        )}
      </div>
    </div>
  );
})

export default VolunteerIncidentLogger;
