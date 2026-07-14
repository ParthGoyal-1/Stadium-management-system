import React from "react";
import { 
  Users, Activity, Shield, Sparkles, ShieldAlert, ArrowRight, Zap, PlayCircle, Layers
} from "lucide-react";

interface CoAgentCollaborationFlowProps {
  activeStepId: number;
  activeMatchEvent: string | null;
}

interface ChainNode {
  agentName: string;
  role: string;
  icon: any;
  color: string;
  bgHighlight: string;
  text: string;
}

// Dynamic flow definitions depending on the state
const getCollaborationChain = (activeStepId: number, activeMatchEvent: string | null): { title: string; description: string; nodes: ChainNode[] } => {
  // 1. Argentina scores goal event
  if (activeMatchEvent === "Argentina Scores! (Goal Scored)") {
    return {
      title: "Celebration Spike & Concessions Rush Loop",
      description: "How the network dynamically handles local celebratory crowd waves and sudden concessions peaks",
      nodes: [
        {
          agentName: "Event / Sec Agent",
          role: "Senses Vibration",
          icon: ShieldAlert,
          color: "text-rose-400 stroke-rose-500",
          bgHighlight: "bg-rose-500/10 border-rose-500/30",
          text: "Detected high-frequency vibration spike in Sector South Row 12. Predicts immediate concession demand wave (+25%)."
        },
        {
          agentName: "Operations Agent",
          role: "Adjusts Signage",
          icon: Activity,
          color: "text-sky-400 stroke-sky-500",
          bgHighlight: "bg-sky-500/10 border-sky-500/30",
          text: "Formulates concession load balancing; locks dynamic overhead signage to point to under-utilized North kiosks."
        },
        {
          agentName: "Volunteer Agent",
          role: "Deploys Staff",
          icon: Shield,
          color: "text-amber-400 stroke-amber-500",
          bgHighlight: "bg-amber-500/10 border-amber-500/30",
          text: "Dispatched standby volunteer (Sarah Jenkins) to South Row 12 to secure site and monitor flares."
        },
        {
          agentName: "Fan Agent",
          role: "Guides Supporters",
          icon: Users,
          color: "text-teal-400 stroke-teal-500",
          bgHighlight: "bg-teal-500/10 border-teal-500/30",
          text: "Pushes in-app celebration card & provides direct indoor navigation to avoid congesed food queues."
        },
        {
          agentName: "Sustainability Agent",
          role: "Emissions Offset",
          icon: LeafIcon,
          color: "text-emerald-400 stroke-emerald-500",
          bgHighlight: "bg-emerald-500/10 border-emerald-500/30",
          text: "Balances concession energy spikes & flags smart waste bins in South Concourse for immediate post-rush collection."
        }
      ]
    };
  }

  // 2. Halftime rush event
  if (activeMatchEvent === "Half Time Food Rush") {
    return {
      title: "Halftime Mass Movement Coordination",
      description: "Coordinating thousands of concurrent fans seeking food & restrooms within a 15-minute window",
      nodes: [
        {
          agentName: "Event Agent",
          role: "Predicts Halftime",
          icon: Sparkles,
          color: "text-rose-400 stroke-rose-500",
          bgHighlight: "bg-rose-500/10 border-rose-500/30",
          text: "Predicts massive pedestrian friction at Sector North. Anticipated restrooms queues hit 15 mins."
        },
        {
          agentName: "Operations Agent",
          role: "Reroutes Flows",
          icon: Activity,
          color: "text-sky-400 stroke-sky-500",
          bgHighlight: "bg-sky-500/10 border-sky-500/30",
          text: "Calculates alternative pathing. Adjusts dynamic prices at West Stand stalls to incentivize flow diversion."
        },
        {
          agentName: "Volunteer Agent",
          role: "Controls Queue",
          icon: Shield,
          color: "text-amber-400 stroke-amber-500",
          bgHighlight: "bg-amber-500/10 border-amber-500/30",
          text: "Reroutes field staff Carlos Ramos & Kenji Takahashi to direct crowd flow physically along West walk-path."
        },
        {
          agentName: "Fan Agent",
          role: "Device Updates",
          icon: Users,
          color: "text-teal-400 stroke-teal-500",
          bgHighlight: "bg-teal-500/10 border-teal-500/30",
          text: "Broadbasts 'Secret Concessions' ad & updates in-app GPS map with shortest walk-time paths."
        },
        {
          agentName: "Sustainability Agent",
          role: "Reduces Waste",
          icon: LeafIcon,
          color: "text-emerald-400 stroke-emerald-500",
          bgHighlight: "bg-emerald-500/10 border-emerald-500/30",
          text: "Prevents food waste by matching stall prep quotas with real-time crowd direction forecasts."
        }
      ]
    };
  }

  // 3. Post-match egress event
  if (activeMatchEvent === "Full Time / Egress Starts" || activeStepId === 8) {
    return {
      title: "Post-Match Egress De-peaking Chain",
      description: "Coordinating stadium clearance, platform safety, and smart transit dispatching",
      nodes: [
        {
          agentName: "Event Agent",
          role: "Halftime Predictor",
          icon: Sparkles,
          color: "text-rose-400 stroke-rose-500",
          bgHighlight: "bg-rose-500/10 border-rose-500/30",
          text: "Predicts Metro station platforms will saturate within 8 mins of final whistle. Demands staggered egress."
        },
        {
          agentName: "Operations Agent",
          role: "Egress Manager",
          icon: Activity,
          color: "text-sky-400 stroke-sky-500",
          bgHighlight: "bg-sky-500/10 border-sky-500/30",
          text: "Locks laser show entertainment post-match; initiates free transit credit campaign to hold 30% of fans inside."
        },
        {
          agentName: "Volunteer Agent",
          role: "Field Marshals",
          icon: Shield,
          color: "text-amber-400 stroke-amber-500",
          bgHighlight: "bg-amber-500/10 border-amber-500/30",
          text: "Deploys exit marshals with glow wands to funnel supporters toward under-utilized Bus Loops."
        },
        {
          agentName: "Fan Agent",
          role: "Bypass GPS Routing",
          icon: Users,
          color: "text-teal-400 stroke-teal-500",
          bgHighlight: "bg-teal-500/10 border-teal-500/30",
          text: "Pushes dynamic transit cards & schedules rideshares dynamically with integrated GPS delay warnings."
        },
        {
          agentName: "Sustainability Agent",
          role: "Carbon Management",
          icon: LeafIcon,
          color: "text-emerald-400 stroke-emerald-500",
          bgHighlight: "bg-emerald-500/10 border-emerald-500/30",
          text: "Mitigates vehicle idling. Organizes smart electric shuttle buses directly matching real-time egress flow rate."
        }
      ]
    };
  }

  // 4. Walkthrough step 5: Rain storm
  if (activeStepId === 5) {
    return {
      title: "Dynamic Rainstorm Mitigation Loop",
      description: "Coordinating structure, safety, and comfort on microclimate alert",
      nodes: [
        {
          agentName: "Event Agent",
          role: "Microclimate Alert",
          icon: Sparkles,
          color: "text-rose-400 stroke-rose-500",
          bgHighlight: "bg-rose-500/10 border-rose-500/30",
          text: "Forecasts storm impact in 3 mins. Flags high risk of concourse slips and seating water damage."
        },
        {
          agentName: "Operations Agent",
          role: "Structural Action",
          icon: Activity,
          color: "text-sky-400 stroke-sky-500",
          bgHighlight: "bg-sky-500/10 border-sky-500/30",
          text: "Initiates automatic closure of the stadium retractable roof. Syncs HVAC concourse ventilation."
        },
        {
          agentName: "Volunteer Agent",
          role: "Safety Dispatch",
          icon: Shield,
          color: "text-amber-400 stroke-amber-500",
          bgHighlight: "bg-amber-500/10 border-amber-500/30",
          text: "Dispatches volunteers to lay entrance mats & distribute dry stadium blankets to families."
        },
        {
          agentName: "Fan Agent",
          role: "In-App Guidance",
          icon: Users,
          color: "text-teal-400 stroke-teal-500",
          bgHighlight: "bg-teal-500/10 border-teal-500/30",
          text: "Routes fans away from open decks; highlights dry indoor family lounges and food zones."
        },
        {
          agentName: "Sustainability Agent",
          role: "Resource Capture",
          icon: LeafIcon,
          color: "text-emerald-400 stroke-emerald-500",
          bgHighlight: "bg-emerald-500/10 border-emerald-500/30",
          text: "Diverts roof rain-gutter runoff straight into greywater recycling storage, saving 42k liters."
        }
      ]
    };
  }

  // 5. Walkthrough steps 6-7: Medical Incident Level 1
  if (activeStepId === 6 || activeStepId === 7) {
    return {
      title: "Medical Emergency Dispatch Integration",
      description: "How a medical report triggers a cascade of safety, logistics, and fan guidance solutions",
      nodes: [
        {
          agentName: "Event / Sec Agent",
          role: "Incident Ingestor",
          icon: ShieldAlert,
          color: "text-rose-400 stroke-rose-500",
          bgHighlight: "bg-rose-500/10 border-rose-500/30",
          text: "Ingests report of a fainted fan in Section 104. Pinpoints coordinates and predicts responder arrival."
        },
        {
          agentName: "Operations Agent",
          role: "Logistical Control",
          icon: Activity,
          color: "text-sky-400 stroke-sky-500",
          bgHighlight: "bg-sky-500/10 border-sky-500/30",
          text: "Slows down Escalator 4 near Section 104 to prevent spectator backpressure from crowding the site."
        },
        {
          agentName: "Volunteer Agent",
          role: "Emergency Route",
          icon: Shield,
          color: "text-amber-400 stroke-amber-500",
          bgHighlight: "bg-amber-500/10 border-amber-500/30",
          text: "Dispatches nearest volunteer Carlos Ramos with AED kit. Clears emergency ambulance access gate."
        },
        {
          agentName: "Fan Agent",
          role: "Reroute Guidance",
          icon: Users,
          color: "text-teal-400 stroke-teal-500",
          bgHighlight: "bg-teal-500/10 border-teal-500/30",
          text: "Alters in-app navigation routes for surrounding fans to use stairs B instead of congested corridor C."
        },
        {
          agentName: "Sustainability Agent",
          role: "EV Pre-Dispatch",
          icon: LeafIcon,
          color: "text-emerald-400 stroke-emerald-500",
          bgHighlight: "bg-emerald-500/10 border-emerald-500/30",
          text: "Diverts smart electric medical buggies along emission-free paths to ensure quiet, safe evacuation."
        }
      ]
    };
  }

  // Default Walkthrough Gate Congestion (Steps 1-3)
  return {
    title: "Gate Congestion & Fan Redirection Cascade",
    description: "Resolving Gate A's 28-minute wait time bottleneck through multi-agent collaboration",
    nodes: [
      {
        agentName: "Event Agent",
        role: "Predicts Backlog",
        icon: Sparkles,
        color: "text-rose-400 stroke-rose-500",
        bgHighlight: "bg-rose-500/10 border-rose-500/30",
        text: "Predicts Gate A queue will grow by 420 people in 12 mins. Identifies severe entry delays."
      },
      {
        agentName: "Operations Agent",
        role: "Dynamic Signage",
        icon: Activity,
        color: "text-sky-400 stroke-sky-500",
        bgHighlight: "bg-sky-500/10 border-sky-500/30",
        text: "Locks Dynamic Overhead signs at North entrance to 'Diverted Gate D' (currently under-utilized)."
      },
      {
        agentName: "Volunteer Agent",
        role: "Staff Redirection",
        icon: Shield,
        color: "text-amber-400 stroke-amber-500",
        bgHighlight: "bg-amber-500/10 border-amber-500/30",
        text: "Instructs Kenji Takahashi at Gate A plaza to physically steer late arrivals around to the East wing."
      },
      {
        agentName: "Fan Agent",
        role: "Bypass App GPS",
        icon: Users,
        color: "text-teal-400 stroke-teal-500",
        bgHighlight: "bg-teal-500/10 border-teal-500/30",
        text: "Pushes interactive bypass routes directly to supporters' mobile devices, saving them 24 mins."
      },
      {
        agentName: "Sustainability Agent",
        role: "Power Conservation",
        icon: LeafIcon,
        color: "text-emerald-400 stroke-emerald-500",
        bgHighlight: "bg-emerald-500/10 border-emerald-500/30",
        text: "Reduces dynamic display energy use based on local ambient light. Minimizes queue heat signatures."
      }
    ]
  };
};

/**
 * CoAgentCollaborationFlow Component.
 * Illustrates the multi-agent orchestration pipeline. Renders the live collaboration
 * chain between sensory agents, operational agents, and dispatch coordinators as they
 * dynamically handle stadium telemetry events, gate closures, or peak crowd surges.
 *
 * @component
 * @param {CoAgentCollaborationFlowProps} props Component props.
 * @returns {React.ReactElement} The multi-agent collaboration visualization panel.
 */
const CoAgentCollaborationFlow = React.memo(function CoAgentCollaborationFlow({
  activeStepId,
  activeMatchEvent
}: CoAgentCollaborationFlowProps) {

  const chain = getCollaborationChain(activeStepId, activeMatchEvent);

  return (
    <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4.5 mb-4 font-sans relative overflow-hidden" id="coagent-collab-flow">
      <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-xl pointer-events-none" />
      
      {/* Loop header */}
      <div className="flex items-center justify-between border-b border-slate-900 pb-2.5 mb-3.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-teal-400" />
          <div>
            <h5 className="font-bold text-xs text-slate-100 flex items-center gap-1.5 uppercase tracking-wide">
              {chain.title}
              <span className="text-[9px] bg-teal-500/10 text-teal-400 border border-teal-500/25 px-1.5 py-0.5 rounded font-mono font-normal">Co-Agent Loop</span>
            </h5>
            <p className="text-[10px] text-slate-400 mt-0.5">{chain.description}</p>
          </div>
        </div>
      </div>

      {/* Chain Timeline nodes */}
      <div className="space-y-3 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[1px] before:bg-slate-800">
        {chain.nodes.map((node, index) => {
          const NodeIcon = node.icon;
          return (
            <div key={node.agentName} className="flex gap-3 items-start relative z-10 group animate-fadeIn">
              {/* Bubble Icon */}
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 shrink-0 transition-all duration-300 ${
                node.bgHighlight
              }`}>
                <NodeIcon className={`w-4 h-4 ${node.color}`} />
              </div>

              {/* Text block */}
              <div className="flex-1 bg-slate-900/60 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 p-2.5 rounded-xl transition duration-300">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-slate-200">{node.agentName}</span>
                  <span className={`text-[8px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border ${node.color} bg-slate-950`}>
                    Step {index + 1}: {node.role}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{node.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
})

export default CoAgentCollaborationFlow;

// Simple Helper Leaf Icon inline
function LeafIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 10a7 7 0 0 1-9 8z" />
      <path d="M19 2v10" />
    </svg>
  );
}
