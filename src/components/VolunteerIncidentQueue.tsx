import React from "react";
import { Incident } from "../types";
import { AlertTriangle } from "lucide-react";

interface VolunteerIncidentQueueProps {
  openAlertPool: Incident[];
  onClaimTask: (incId: string) => void;
}

/**
 * VolunteerIncidentQueue Component.
 * Renders the pool of open, unassigned stadium incidents. Volunteers can monitor
 * this queue in real-time and self-claim ("Accept & Dispatch") open tasks to resolve them.
 *
 * @component
 * @param {VolunteerIncidentQueueProps} props Component props.
 * @returns {React.ReactElement} The unassigned alerts pool UI.
 */
export default function VolunteerIncidentQueue({
  openAlertPool,
  onClaimTask
}: VolunteerIncidentQueueProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="alerts-pool-panel">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-amber-500 animate-pulse" />
        Command Incident Queue (Open Pool)
      </h3>

      <div className="space-y-3">
        {openAlertPool.length > 0 ? (
          openAlertPool.map((alert) => (
            <div key={alert.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <div className="flex gap-2 items-center mb-1.5">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-semibold font-mono ${
                    alert.priority === "High" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {alert.priority}
                  </span>
                  <span className="text-[10px] text-slate-400">{alert.location}</span>
                </div>
                <p className="text-xs text-slate-200">{alert.description}</p>
              </div>
              <button
                onClick={() => onClaimTask(alert.id)}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-750 text-teal-400 hover:text-teal-300 font-sans font-semibold text-xs rounded-xl transition whitespace-nowrap cursor-pointer"
              >
                Accept & Dispatch
              </button>
            </div>
          ))
        ) : (
          <div className="text-center text-xs text-slate-500 py-3 bg-slate-950/30 rounded-xl">
            🟢 No open unassigned alarms in the sector queue.
          </div>
        )}
      </div>
    </div>
  );
}
