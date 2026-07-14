import React, { useState, useEffect, useRef } from "react";
import { 
  Activity, Play, Pause, RefreshCw, Ticket, Cloud, Users, 
  Shield, MessageSquare, AlertCircle, Sparkles, Send, Bell
} from "lucide-react";
import { StadiumState } from "../types";

export interface TelemetryLog {
  id: string;
  timestamp: string;
  category: "ticket" | "sensor" | "weather" | "volunteer" | "ai" | "event";
  message: string;
  value?: string;
  source: string;
}

interface LiveTelemetryStreamProps {
  state: StadiumState;
  activeStepId: number;
  addSystemNotification: (message: string, type: "info" | "success" | "alert") => void;
}

const SAMPLE_TICKET_ZONES = ["North Section 102", "East Concourse Level 2", "South Row 15", "West VIP Suite 4"];
const SAMPLE_VOLUNTEER_NAMES = ["Carlos Ramos", "Kenji Takahashi", "Sarah Jenkins", "Emily Wong"];
const SAMPLE_MESSAGES = [
  "Main concourse corridor clear and fully accessible",
  "Sector North concession lines moving at 4.2 mins average",
  "Wheelchair guest escorted safely to Elevator 2",
  "Ramp area de-congested. Signage updated successfully",
  "First aid kit replenished at Section South checkpoint"
];

const LiveTelemetryStream = React.memo(function LiveTelemetryStream({
  state,
  activeStepId,
  addSystemNotification
}: LiveTelemetryStreamProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [scanRate, setScanRate] = useState(3.4); // Scans per second
  const [totalScansProcessed, setTotalScansProcessed] = useState(38210);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to format current hours/minutes/seconds
  const getFormattedTime = () => {
    const d = new Date();
    return d.toTimeString().split(" ")[0];
  };

  // Generate initial set of logs
  useEffect(() => {
    const initialLogs: TelemetryLog[] = [
      {
        id: "init-1",
        timestamp: getFormattedTime(),
        category: "weather",
        message: "Environmental Station North: Temp 19.5°C, humidity 64%, wind 8km/h NNE",
        source: "Weather-Station-01"
      },
      {
        id: "init-2",
        timestamp: getFormattedTime(),
        category: "sensor",
        message: "Gate A entry lane 4 camera reports average walk-thru pace 1.2m/s",
        source: "Gate-Cam-A4"
      },
      {
        id: "init-3",
        timestamp: getFormattedTime(),
        category: "ticket",
        message: "Ticket Scanned: Sector South Block 105, Row 11, Gate C entrance approved",
        source: "Scanner-C12"
      },
      {
        id: "init-4",
        timestamp: getFormattedTime(),
        category: "volunteer",
        message: "Kenji Takahashi: 'Stationed at Gate A Plaza. Line looks high but orderly.'",
        source: "Vol-Radio-Kenji"
      },
      {
        id: "init-5",
        timestamp: getFormattedTime(),
        category: "ai",
        message: "AI Optimizer synced active load profiles. Gate wait matrices calculated.",
        source: "Copilot-Core"
      }
    ];
    setLogs(initialLogs);
  }, []);

  // Listen to step change to inject major narrative milestones
  useEffect(() => {
    const stepTitles = [
      "Walkthrough Step 1: Supporters Rush Active. High congestion Gate A.",
      "Walkthrough Step 2: Predictive Simulation. Gate A overflow predicted in 12 mins.",
      "Walkthrough Step 3: Proactive Redirect Triggered. Digital signs showing Diverted route.",
      "Walkthrough Step 4: Accessibility dispatch: Stair-free Elevator 2 assigned.",
      "Walkthrough Step 5: Weather alert: Torrential Rain detected. Closing roof.",
      "Walkthrough Step 6: Medical Incident Level 1 in Section 104 logged by carlos.",
      "Walkthrough Step 7: Co-Agent Autonomous network sync in Section 104 completed.",
      "Walkthrough Step 8: Full-Time whistle. De-peaking laser show active."
    ];

    const currentTitle = stepTitles[activeStepId - 1] || "Story Step updated";
    const stepLog: TelemetryLog = {
      id: "step-" + Date.now(),
      timestamp: getFormattedTime(),
      category: "event",
      message: `🔔 STADIUM LIFECYCLE EVENT: ${currentTitle}`,
      source: "Narrative-Engine"
    };

    setLogs(prev => [stepLog, ...prev.slice(0, 24)]);
  }, [activeStepId]);

  // Handle continuous ticker simulation
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      // Pick a random category to simulate
      const r = Math.random();
      let newLog: TelemetryLog;
      const time = getFormattedTime();

      if (r < 0.35) {
        // Ticket scanned
        const zone = SAMPLE_TICKET_ZONES[Math.floor(Math.random() * SAMPLE_TICKET_ZONES.length)];
        const ticketId = Math.floor(100000 + Math.random() * 900000);
        newLog = {
          id: "tick-" + Math.random(),
          timestamp: time,
          category: "ticket",
          message: `Ticket Verified: ID #${ticketId} scanned at ${zone}`,
          source: "Scanner-API"
        };
        setTotalScansProcessed(prev => prev + 1);
        setScanRate(parseFloat((2.8 + Math.random() * 2).toFixed(1)));
      } else if (r < 0.65) {
        // Sensor queue change
        const gate = state.gates[Math.floor(Math.random() * state.gates.length)];
        const change = Math.random() > 0.5 ? 1 : -1;
        const finalQueue = Math.max(10, gate.queueLength + change * Math.floor(Math.random() * 5));
        newLog = {
          id: "sens-" + Math.random(),
          timestamp: time,
          category: "sensor",
          message: `Flow Telemetry: ${gate.name} camera registers active queue at ${finalQueue} people.`,
          source: `Camera-Edge-${gate.id}`
        };
      } else if (r < 0.85) {
        // Volunteer message
        const name = SAMPLE_VOLUNTEER_NAMES[Math.floor(Math.random() * SAMPLE_VOLUNTEER_NAMES.length)];
        const msg = SAMPLE_MESSAGES[Math.floor(Math.random() * SAMPLE_MESSAGES.length)];
        newLog = {
          id: "vol-" + Math.random(),
          timestamp: time,
          category: "volunteer",
          message: `Volunteer Radio - ${name}: "${msg}"`,
          source: "Dispatch-Node"
        };
      } else {
        // Weather
        const tempOffset = (Math.random() - 0.5) * 0.4;
        newLog = {
          id: "weath-" + Math.random(),
          timestamp: time,
          category: "weather",
          message: `Microclimate Update: Air Temp ${(19.5 + tempOffset).toFixed(1)}°C, concourse humidity 66%`,
          source: "Sensors-Core"
        };
      }

      setLogs(prev => [newLog, ...prev.slice(0, 24)]);
    }, 4000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, state]);

  // Log colors
  const getLogColor = (cat: string) => {
    switch (cat) {
      case "ticket": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/25";
      case "sensor": return "text-sky-400 bg-sky-500/10 border-sky-500/25";
      case "weather": return "text-sky-300 bg-sky-500/5 border-sky-500/15";
      case "volunteer": return "text-amber-400 bg-amber-500/10 border-amber-500/25";
      case "event": return "text-fuchsia-400 bg-fuchsia-500/15 border-fuchsia-500/30 font-bold animate-pulse";
      case "ai": return "text-teal-400 bg-teal-500/10 border-teal-500/20";
      default: return "text-slate-400 bg-slate-950 border-slate-800";
    }
  };

  const getLogIcon = (cat: string) => {
    switch (cat) {
      case "ticket": return <Ticket className="w-3.5 h-3.5" />;
      case "sensor": return <Activity className="w-3.5 h-3.5" />;
      case "weather": return <Cloud className="w-3.5 h-3.5" />;
      case "volunteer": return <Shield className="w-3.5 h-3.5" />;
      case "event": return <Bell className="w-3.5 h-3.5" />;
      case "ai": return <Sparkles className="w-3.5 h-3.5" />;
      default: return <Activity className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 relative overflow-hidden font-sans" id="telemetry-feed-card">
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3.5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Activity className="w-5 h-5 text-teal-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-slate-100 uppercase tracking-tight">Live Telemetry &amp; Event Stream</h4>
            <p className="text-[10px] text-slate-400 font-mono">Real-time stadium sensor ingestion pipeline</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1 px-2.5 rounded-lg border text-[10px] font-semibold flex items-center gap-1 transition ${
              isPlaying 
                ? "bg-slate-950 hover:bg-slate-850 border-slate-800 text-slate-300"
                : "bg-teal-500 text-slate-950 font-bold border-teal-500 hover:bg-teal-600"
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                Live Ingesting
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                Resume Stream
              </>
            )}
          </button>
        </div>
      </div>

      {/* Telemetry metadata block */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-center font-mono">
          <span className="text-[9px] text-slate-500 uppercase block">Ticket Scan Velocity</span>
          <span className="text-xs font-semibold text-teal-400 mt-0.5 block">
            ~{scanRate} verifications/sec
          </span>
        </div>
        <div className="bg-slate-950 p-2 rounded-xl border border-slate-850 text-center font-mono">
          <span className="text-[9px] text-slate-500 uppercase block">Cumulative Ingests</span>
          <span className="text-xs font-semibold text-slate-300 mt-0.5 block">
            {totalScansProcessed.toLocaleString()} records
          </span>
        </div>
      </div>

      {/* Terminal logs list */}
      <div className="bg-slate-950 border border-slate-850 rounded-xl p-3 h-[240px] overflow-y-auto font-mono text-[10px] leading-relaxed space-y-2 scrollbar-thin" aria-live="polite" aria-atomic="false" role="log">
        {logs.map((log) => (
          <div key={log.id} className="flex gap-2 items-start border-b border-slate-900/60 pb-1.5 last:border-0 last:pb-0 animate-fadeIn">
            {/* Timestamp */}
            <span className="text-slate-500 font-medium select-none">{log.timestamp}</span>
            
            {/* Category tag icon */}
            <span className={`p-1 rounded border flex-shrink-0 flex items-center justify-center ${getLogColor(log.category)}`}>
              {getLogIcon(log.category)}
            </span>

            {/* Message and Source */}
            <div className="flex-1 min-w-0">
              <span className="text-slate-200 block break-words whitespace-pre-wrap">{log.message}</span>
              <span className="text-[8px] text-slate-500 block mt-0.5">Source: {log.source}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Reasoning Anchor Indicator */}
      <div className="mt-3 bg-teal-500/5 border border-teal-500/20 rounded-xl p-3 flex gap-2 items-start">
        <Sparkles className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="text-[10px] text-slate-300 leading-normal font-sans">
          <b>AI Decision Pipeline Active:</b> Copilot reads this real-time telemetry stream dynamically. Every recommendation is grounded strictly in live scans, camera vectors, and sensor changes.
        </div>
      </div>
    </div>
  );
})

export default LiveTelemetryStream;
