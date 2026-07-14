import React from "react";
import { StadiumState, StadiumSector, EntryGate, Incident } from "../types";
import { AlertTriangle, Users, Compass } from "lucide-react";

interface StadiumVisualizerProps {
  state: StadiumState;
  selectedSectorId: string | null;
  onSelectSector: (sectorId: string | null) => void;
  selectedGateId: string | null;
  onSelectGate: (gateId: string | null) => void;
}

const getCrowdColor = (level: string) => {
  switch (level) {
    case "Low": return "fill-emerald-500/20 stroke-emerald-500 hover:fill-emerald-500/30";
    case "Medium": return "fill-amber-500/20 stroke-amber-500 hover:fill-amber-500/30";
    case "High": return "fill-orange-500/35 stroke-orange-500 hover:fill-orange-500/45";
    case "Critical": return "fill-rose-600/50 stroke-rose-600 hover:fill-rose-600/60";
    default: return "fill-slate-700/20 stroke-slate-500 hover:fill-slate-700/30";
  }
};

const getCrowdbadge = (level: string) => {
  switch (level) {
    case "Low": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    case "Medium": return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    case "High": return "bg-orange-500/10 text-orange-400 border-orange-500/30";
    case "Critical": return "bg-rose-500/10 text-rose-400 border-rose-500/30";
    default: return "bg-slate-500/10 text-slate-400 border-slate-500/30";
  }
};

const StadiumVisualizer = React.memo(function StadiumVisualizer({
  state,
  selectedSectorId,
  onSelectSector,
  selectedGateId,
  onSelectGate
}: StadiumVisualizerProps) {

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full relative overflow-hidden" id="stadium-map">
      <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div>
          <h3 className="font-sans font-semibold text-lg text-slate-100 flex items-center gap-2">
            <Compass className="w-5 h-5 text-teal-400" />
            Live Arena Telemetry
          </h3>
          <p className="text-xs text-slate-400">Interactive sector map, gate load sensors, and response dispatches</p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Low Density
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Moderate
          </span>
          <span className="flex items-center gap-1 text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Heavy
          </span>
          <span className="flex items-center gap-1 text-rose-500">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            Critical
          </span>
        </div>
      </div>

      {/* Visual Canvas Container */}
      <div className="relative flex-1 min-h-[320px] bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-center p-4">
        {/* SVG Stadium Map */}
        <svg viewBox="0 0 400 400" className="w-full max-w-[340px] h-auto aspect-square drop-shadow-2xl select-none z-10">
          
          {/* Outermost pitch glow */}
          <circle cx="200" cy="200" r="160" className="fill-none stroke-slate-800/40 stroke-2" />
          
          {/* SEC NORTH (Upper arc) */}
          <path
            tabIndex={0}
            role="button"
            aria-label={`North Sector: ${state.sectors[0].crowdLevel} crowding, ${state.sectors[0].currentCount} inside`}
            aria-pressed={selectedSectorId === "sec-north"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectSector(selectedSectorId === "sec-north" ? null : "sec-north");
              }
            }}
            d="M 60 140 A 150 150 0 0 1 340 140 L 290 170 A 90 90 0 0 0 110 170 Z"
            className={`cursor-pointer transition-all duration-300 stroke-2 focus-visible:outline-none focus-visible:stroke-teal-400 ${getCrowdColor(state.sectors[0].crowdLevel)} ${
              selectedSectorId === "sec-north" ? "stroke-teal-400 fill-teal-500/20" : "stroke-slate-700"
            }`}
            onClick={() => onSelectSector(selectedSectorId === "sec-north" ? null : "sec-north")}
          />
          <text x="200" y="105" className="fill-slate-100 font-sans font-semibold text-[11px] text-center pointer-events-none" textAnchor="middle">
            NORTH
          </text>
          
          {/* SEC EAST (Right arc) */}
          <path
            tabIndex={0}
            role="button"
            aria-label={`East Sector: ${state.sectors[1].crowdLevel} crowding, ${state.sectors[1].currentCount} inside`}
            aria-pressed={selectedSectorId === "sec-east"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectSector(selectedSectorId === "sec-east" ? null : "sec-east");
              }
            }}
            d="M 340 140 A 150 150 0 0 1 340 260 L 290 230 A 90 90 0 0 0 290 170 Z"
            className={`cursor-pointer transition-all duration-300 stroke-2 focus-visible:outline-none focus-visible:stroke-teal-400 ${getCrowdColor(state.sectors[1].crowdLevel)} ${
              selectedSectorId === "sec-east" ? "stroke-teal-400 fill-teal-500/20" : "stroke-slate-700"
            }`}
            onClick={() => onSelectSector(selectedSectorId === "sec-east" ? null : "sec-east")}
          />
          <text x="325" y="205" className="fill-slate-100 font-sans font-semibold text-[11px] pointer-events-none" textAnchor="middle">
            EAST
          </text>
 
          {/* SEC SOUTH (Lower arc) */}
          <path
            tabIndex={0}
            role="button"
            aria-label={`South Sector: ${state.sectors[2].crowdLevel} crowding, ${state.sectors[2].currentCount} inside`}
            aria-pressed={selectedSectorId === "sec-south"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectSector(selectedSectorId === "sec-south" ? null : "sec-south");
              }
            }}
            d="M 340 260 A 150 150 0 0 1 60 260 L 110 230 A 90 90 0 0 0 290 230 Z"
            className={`cursor-pointer transition-all duration-300 stroke-2 focus-visible:outline-none focus-visible:stroke-teal-400 ${getCrowdColor(state.sectors[2].crowdLevel)} ${
              selectedSectorId === "sec-south" ? "stroke-teal-400 fill-teal-500/20" : "stroke-slate-700"
            }`}
            onClick={() => onSelectSector(selectedSectorId === "sec-south" ? null : "sec-south")}
          />
          <text x="200" y="305" className="fill-slate-100 font-sans font-semibold text-[11px] pointer-events-none" textAnchor="middle">
            SOUTH
          </text>
 
          {/* SEC WEST (Left arc) */}
          <path
            tabIndex={0}
            role="button"
            aria-label={`West Sector: ${state.sectors[3].crowdLevel} crowding, ${state.sectors[3].currentCount} inside`}
            aria-pressed={selectedSectorId === "sec-west"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectSector(selectedSectorId === "sec-west" ? null : "sec-west");
              }
            }}
            d="M 60 260 A 150 150 0 0 1 60 140 L 110 170 A 90 90 0 0 0 110 230 Z"
            className={`cursor-pointer transition-all duration-300 stroke-2 focus-visible:outline-none focus-visible:stroke-teal-400 ${getCrowdColor(state.sectors[3].crowdLevel)} ${
              selectedSectorId === "sec-west" ? "stroke-teal-400 fill-teal-500/20" : "stroke-slate-700"
            }`}
            onClick={() => onSelectSector(selectedSectorId === "sec-west" ? null : "sec-west")}
          />
          <text x="75" y="205" className="fill-slate-100 font-sans font-semibold text-[11px] pointer-events-none" textAnchor="middle">
            WEST
          </text>

          {/* Pitch Area (Center) */}
          <rect x="145" y="165" width="110" height="70" rx="6" className="fill-teal-950/80 stroke-teal-500/30 stroke-2" />
          <line x1="200" y1="165" x2="200" y2="235" className="stroke-teal-500/20" />
          <circle cx="200" cy="200" r="18" className="fill-none stroke-teal-500/20" />
          <text x="200" y="203" className="fill-teal-400/50 font-mono text-[9px]" textAnchor="middle">
            PITCH
          </text>

          {/* GATES SENSORS (Outer circles) */}
          {/* Gate A (Main North) */}
          <g 
            tabIndex={0}
            role="button"
            aria-label={`Gate A (Main North): Queue length ${state.gates[0]?.queueLength || 0}, Wait time ${state.gates[0]?.waitTimeMinutes || 0} minutes`}
            aria-pressed={selectedGateId === "gate-a"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectGate(selectedGateId === "gate-a" ? null : "gate-a");
              }
            }}
            className="cursor-pointer focus-visible:outline-none focus-visible:stroke-teal-400" 
            onClick={() => onSelectGate(selectedGateId === "gate-a" ? null : "gate-a")}
          >
            <circle cx="200" cy="25" r="14" className={`${selectedGateId === "gate-a" ? "fill-teal-500 stroke-white" : "fill-slate-900 stroke-rose-500"} stroke-2`} />
            <text x="200" y="29" className="fill-slate-200 font-mono text-[9px] font-bold text-center" textAnchor="middle">A</text>
          </g>

          {/* Gate B (Southwest) */}
          <g 
            tabIndex={0}
            role="button"
            aria-label={`Gate B (Southwest): Queue length ${state.gates[1]?.queueLength || 0}, Wait time ${state.gates[1]?.waitTimeMinutes || 0} minutes`}
            aria-pressed={selectedGateId === "gate-b"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectGate(selectedGateId === "gate-b" ? null : "gate-b");
              }
            }}
            className="cursor-pointer focus-visible:outline-none focus-visible:stroke-teal-400" 
            onClick={() => onSelectGate(selectedGateId === "gate-b" ? null : "gate-b")}
          >
            <circle cx="45" cy="315" r="14" className={`${selectedGateId === "gate-b" ? "fill-teal-500 stroke-white" : "fill-slate-900 stroke-emerald-500"} stroke-2`} />
            <text x="45" y="319" className="fill-slate-200 font-mono text-[9px] font-bold text-center" textAnchor="middle">B</text>
          </g>

          {/* Gate C (Southeast) */}
          <g 
            tabIndex={0}
            role="button"
            aria-label={`Gate C (Southeast): Queue length ${state.gates[2]?.queueLength || 0}, Wait time ${state.gates[2]?.waitTimeMinutes || 0} minutes`}
            aria-pressed={selectedGateId === "gate-c"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectGate(selectedGateId === "gate-c" ? null : "gate-c");
              }
            }}
            className="cursor-pointer focus-visible:outline-none focus-visible:stroke-teal-400" 
            onClick={() => onSelectGate(selectedGateId === "gate-c" ? null : "gate-c")}
          >
            <circle cx="355" cy="315" r="14" className={`${selectedGateId === "gate-c" ? "fill-teal-500 stroke-white" : "fill-slate-900 stroke-emerald-500"} stroke-2`} />
            <text x="355" y="319" className="fill-slate-200 font-mono text-[9px] font-bold text-center" textAnchor="middle">C</text>
          </g>

          {/* Gate D (West VIP) */}
          <g 
            tabIndex={0}
            role="button"
            aria-label={`Gate D (West VIP): Queue length ${state.gates[3]?.queueLength || 0}, Wait time ${state.gates[3]?.waitTimeMinutes || 0} minutes`}
            aria-pressed={selectedGateId === "gate-d"}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectGate(selectedGateId === "gate-d" ? null : "gate-d");
              }
            }}
            className="cursor-pointer focus-visible:outline-none focus-visible:stroke-teal-400" 
            onClick={() => onSelectGate(selectedGateId === "gate-d" ? null : "gate-d")}
          >
            <circle cx="25" cy="200" r="14" className={`${selectedGateId === "gate-d" ? "fill-teal-500 stroke-white" : "fill-slate-900 stroke-sky-400"} stroke-2`} />
            <text x="25" y="204" className="fill-slate-200 font-mono text-[9px] font-bold text-center" textAnchor="middle">D</text>
          </g>

          {/* ACTIVE INCIDENTS VISUAL PULSES */}
          {state.incidents.map((incident) => {
            let cx = 200;
            let cy = 200;
            // Place incidents at approximate visual spots
            if (incident.location.includes("118") || incident.location.includes("North")) {
              cx = 240; cy = 130;
            } else if (incident.location.includes("204") || incident.location.includes("East")) {
              cx = 310; cy = 190;
            } else if (incident.location.includes("South")) {
              cx = 200; cy = 270;
            } else if (incident.location.includes("West")) {
              cx = 90; cy = 200;
            }

            const pulseColor = incident.priority === "High" ? "fill-rose-500" : "fill-amber-500";
            return (
              <g key={incident.id} className="cursor-pointer animate-bounce">
                <circle cx={cx} cy={cy} r="12" className={`${pulseColor} opacity-20 animate-ping`} />
                <circle cx={cx} cy={cy} r="6" className={`${pulseColor} stroke-slate-950 stroke-1`} />
                <circle cx={cx} cy={cy} r="3" className="fill-white" />
              </g>
            );
          })}
        </svg>

        {/* Dynamic mini inspection float card */}
        {(selectedSectorId || selectedGateId) && (
          <div className="absolute bottom-3 left-3 right-3 bg-slate-900/95 border border-slate-700 rounded-lg p-3 shadow-xl backdrop-blur-sm z-20 transition-all text-xs">
            {selectedSectorId && (() => {
              const sec = state.sectors.find(s => s.id === selectedSectorId);
              if (!sec) return null;
              return (
                <div className="flex flex-col gap-1 text-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold font-sans text-teal-400">{sec.name}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${getCrowdbadge(sec.crowdLevel)}`}>
                      {sec.crowdLevel} Crowd
                    </span>
                  </div>
                  <div className="flex gap-4 font-mono text-slate-300 mt-1">
                    <span>Occupancy: <b>{sec.currentCount.toLocaleString()}</b> / {sec.capacity.toLocaleString()}</span>
                    <span>Elevators: {sec.hasElevator ? "✅ Yes" : "❌ No"}</span>
                  </div>
                  {sec.specialAlerts.length > 0 && (
                    <div className="text-[10px] text-amber-400 flex items-start gap-1 mt-1 border-t border-slate-800 pt-1">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{sec.specialAlerts[0]}</span>
                    </div>
                  )}
                </div>
              );
            })()}

            {selectedGateId && (() => {
              const gate = state.gates.find(g => g.id === selectedGateId);
              if (!gate) return null;
              return (
                <div className="flex flex-col gap-1 text-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold font-sans text-teal-400">{gate.name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      gate.status === "Congested" ? "bg-rose-500/15 text-rose-400 border border-rose-500/30" : "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                    }`}>
                      {gate.status}
                    </span>
                  </div>
                  <div className="flex gap-4 font-mono text-slate-300 mt-1">
                    <span>Queue: <b>{gate.queueLength} people</b></span>
                    <span>Wait: <b>{gate.waitTimeMinutes} mins</b></span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1 border-t border-slate-800 pt-1">
                    {gate.status === "Congested" 
                      ? "⚠️ Dynamic Signage recommending redirection. Tap Copilot below to redirect fans." 
                      : "🟢 Optimal loading. Accepting dispatches."}
                  </p>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* Quick overview metrics at bottom of visualizer */}
      <div className="grid grid-cols-3 gap-2 mt-4 text-center z-10">
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Total Inside</div>
          <div className="text-sm font-sans font-semibold text-slate-100 mt-0.5">
            {state.sectors.reduce((acc, s) => acc + s.currentCount, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Active Alerts</div>
          <div className="text-sm font-sans font-semibold text-rose-400 mt-0.5 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" />
            {state.incidents.filter(i => i.status !== "Resolved").length} Critical
          </div>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/60 rounded-lg p-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Gate Rush</div>
          <div className="text-sm font-sans font-semibold text-amber-400 mt-0.5">
            {state.gates.filter(g => g.status === "Congested").length > 0 ? "Congested" : "Normal"}
          </div>
        </div>
      </div>
    </div>
  );
})

export default StadiumVisualizer;
