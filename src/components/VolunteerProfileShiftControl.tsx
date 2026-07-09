import React from "react";
import { Volunteer } from "../types";
import { User, Shield } from "lucide-react";

interface VolunteerProfileShiftControlProps {
  volunteer: Volunteer;
  onUpdateStatus: (volunteerId: string, status: 'Available' | 'Busy' | 'On Break') => void;
  addNotification: (message: string, type: 'info' | 'success' | 'alert') => void;
}

/**
 * VolunteerProfileShiftControl Component.
 * Renders the primary volunteer profile summary (Carlos Ramos) and provides
 * interactive state toggles to synchronize shift availability ("Available", "Busy", "On Break")
 * with the central coordinator state machine.
 *
 * @component
 */
export default function VolunteerProfileShiftControl({
  volunteer,
  onUpdateStatus,
  addNotification
}: VolunteerProfileShiftControlProps) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="shift-control-panel">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-950 border border-teal-500/40 flex items-center justify-center">
            <User className="w-6 h-6 text-teal-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 font-sans">{volunteer.name}</h3>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Shield className="w-3.5 h-3.5 text-teal-400" />
              Primary Location: <b>{volunteer.location}</b>
            </p>
          </div>
        </div>

        {/* Shift Radio Button Toggles */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          {(['Available', 'Busy', 'On Break'] as const).map((st) => (
            <button
              key={st}
              onClick={() => {
                onUpdateStatus(volunteer.id, st);
                addNotification(`Shift status set to ${st}`, "info");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                volunteer.status === st
                  ? st === 'Available' ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                    : st === 'Busy' ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                    : "bg-slate-700 text-slate-200"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
