import React from "react";
import { Incident } from "../types";
import { CheckSquare, Clock, ListTodo, CheckCircle } from "lucide-react";

interface VolunteerActiveTaskPanelProps {
  myAssignedIncidents: Incident[];
  resolutionNotes: string;
  setResolutionNotes: (val: string) => void;
  onResolveTask: (incId: string) => void;
}

/**
 * VolunteerActiveTaskPanel Component.
 * Displays the current active task assigned to the logged-in volunteer (e.g. Carlos Ramos).
 * Allows the volunteer to view the incident details, look at AI-guided safety steps,
 * input on-site resolution actions, and submit the incident resolution report back to the command center.
 *
 * @component
 * @param {VolunteerActiveTaskPanelProps} props Component props.
 * @returns {React.ReactElement} The active dispatch control panel.
 */
export default function VolunteerActiveTaskPanel({
  myAssignedIncidents,
  resolutionNotes,
  setResolutionNotes,
  onResolveTask
}: VolunteerActiveTaskPanelProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6" id="assigned-dispatch-panel">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
        <CheckSquare className="w-5 h-5 text-teal-400" aria-hidden="true" />
        Your Assigned Dispatch Task
      </h3>

      {myAssignedIncidents.length > 0 ? (
        myAssignedIncidents.map((task) => (
          <div key={task.id} className="bg-slate-950 border border-slate-800 rounded-xl p-5 animate-fadeIn">
            <div className="flex justify-between items-center mb-3">
              <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold font-mono ${
                task.priority === "High" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}>
                {task.priority} Priority
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                Logged at {task.timestamp}
              </span>
            </div>

            <h4 className="font-semibold text-sm text-slate-100 mb-2">{task.category} Alert</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4 p-3 bg-slate-900 rounded-lg border border-slate-850">
              {task.description}
            </p>

            {/* AI Guided Steps */}
            <div className="mb-4">
              <h5 className="text-xs font-mono font-semibold text-teal-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                <ListTodo className="w-4 h-4" aria-hidden="true" />
                AI Action Checklist
              </h5>
              <div className="space-y-2">
                <div className="flex gap-2 text-xs text-slate-300 items-start">
                  <span className="w-4 h-4 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">1</span>
                  <span>Proceed immediately to <b>{task.location}</b>.</span>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 items-start">
                  <span className="w-4 h-4 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">2</span>
                  <span>Secure safety parameter and isolate broken/damaged items.</span>
                </div>
                <div className="flex gap-2 text-xs text-slate-300 items-start">
                  <span className="w-4 h-4 bg-teal-500/15 border border-teal-500/30 text-teal-400 rounded-full flex items-center justify-center text-[10px] flex-shrink-0">3</span>
                  <span>Render aid or report resolution notes directly back to organizers below.</span>
                </div>
              </div>
            </div>

            {/* Resolution input form */}
            <div className="border-t border-slate-900 pt-4 mt-4">
              <label htmlFor={`resolution-notes-${task.id}`} className="block text-xs font-mono text-slate-400 mb-1.5">Resolution Actions Log (Required)</label>
              <textarea
                id={`resolution-notes-${task.id}`}
                rows={2}
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                placeholder="Describe steps taken (e.g., 'Secured and taped safety zone', 'Assisted child to Lost desk')"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 focus-visible:ring-2 focus-visible:ring-teal-500 outline-none mb-3"
              />
              <button
                onClick={() => onResolveTask(task.id)}
                className="w-full bg-teal-500 hover:bg-teal-600 text-slate-950 font-sans font-semibold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-500 outline-none"
              >
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Resolve Incident & Log to Command
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-slate-950/60 border border-dashed border-slate-800 rounded-xl p-8 text-center text-slate-400 text-xs">
          😴 You do not have any active dispatches right now.
          <p className="text-[10px] text-slate-500 mt-1">Status set to Available. Monitor the security pool below to claim open alarms.</p>
        </div>
      )}
    </div>
  );
}
