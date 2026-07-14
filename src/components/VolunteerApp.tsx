import React, { useState } from "react";
import { StadiumState, Incident, ChatMessage } from "../types";
import VolunteerProfileShiftControl from "./VolunteerProfileShiftControl";
import VolunteerActiveTaskPanel from "./VolunteerActiveTaskPanel";
import VolunteerIncidentQueue from "./VolunteerIncidentQueue";
import VolunteerIncidentLogger from "./VolunteerIncidentLogger";
import VolunteerCopilotChat from "./VolunteerCopilotChat";

interface VolunteerAppProps {
  state: StadiumState;
  onUpdateVolunteerStatus: (volunteerId: string, status: 'Available' | 'Busy' | 'On Break') => void;
  onResolveIncident: (incidentId: string, actionTaken: string) => void;
  onAddIncident: (incident: Incident) => void;
  addSystemNotification: (message: string, type: 'info' | 'success' | 'alert') => void;
  activeVolunteerTab?: number;
}

const VolunteerApp = React.memo(function VolunteerApp({
  state,
  onUpdateVolunteerStatus,
  onResolveIncident,
  onAddIncident,
  addSystemNotification,
  activeVolunteerTab
}: VolunteerAppProps) {
  // We simulate logged in volunteer: "Carlos Ramos" (id: "vol-1")
  const activeVolId = "vol-1";
  const volunteer = state.volunteers.find(v => v.id === activeVolId) || state.volunteers[0];

  // Report State
  const [reportText, setReportText] = useState("");
  const [reportedLocation, setReportedLocation] = useState("Sector North, Section 112");
  const [isReporting, setIsReporting] = useState(false);
  const [recentReportResult, setRecentReportResult] = useState<any>(null);

  // Resolution Notes State
  const [resolutionNotes, setResolutionNotes] = useState("");

  // Volunteer Chat State
  const [volChatInput, setVolChatInput] = useState("");
  const [volChatHistory, setVolChatHistory] = useState<ChatMessage[]>([
    {
      id: "vch-1",
      sender: "ai",
      text: "Hi Carlos! Ready to protect supporters. I can help with step-by-step resolution checklists, locating first-aid, or guiding stairless transits. What's happening on the ground?",
      timestamp: "19:35"
    }
  ]);
  const [loadingVolChat, setLoadingVolChat] = useState(false);

  // Claim unassigned task helper
  /**
   * Assigns an unassigned incident to the logged-in volunteer Carlos Ramos.
   * Updates the volunteer's availability status to Busy and changes the incident's
   * state to Dispatched.
   *
   * @param {string} incId ID of the incident task to claim.
   */
  const handleClaimTask = (incId: string) => {
    onUpdateVolunteerStatus(activeVolId, "Busy");
    
    const updatedInc = state.incidents.find(i => i.id === incId);
    if (updatedInc) {
      updatedInc.assignedVolunteerId = activeVolId;
      updatedInc.status = "Dispatched";
      addSystemNotification(`You claimed task: "${updatedInc.description}"`, "success");
    }
  };

  // Submit field report (Calls LLM for auto classification)
  /**
   * Dispatches a fresh incident report compiled by the volunteer to the AI backend.
   * The backend dynamically classifies the urgency level, assigns an operational category,
   * compiles initial safety safeguards, and provides simulated fallback datasets if offline.
   *
   * @async
   */
  const handleReportIncident = async () => {
    if (!reportText.trim()) return;
    setIsReporting(true);
    setRecentReportResult(null);

    try {
      const res = await fetch("/api/copilot/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `${reportText} (Reported by Volunteer ${volunteer.name} at ${reportedLocation})`,
          state
        })
      });
      const data = await res.json();

      const newInc: Incident = {
        id: "inc-vol-" + Date.now(),
        description: reportText,
        location: reportedLocation,
        priority: data.priority || "Medium",
        status: "Logged",
        assignedVolunteerId: null,
        timestamp: state.simulatedTime,
        category: data.category || "General",
        actionTaken: ""
      };

      onAddIncident(newInc);
      setRecentReportResult(data);
      setReportText("");
      addSystemNotification(`Incident filed: [${data.priority}] ${data.category}`, "alert");
    } catch (e) {
      console.error(e);
      // Fallback
      const newInc: Incident = {
        id: "inc-vol-fb-" + Date.now(),
        description: reportText,
        location: reportedLocation,
        priority: "Medium",
        status: "Logged",
        assignedVolunteerId: null,
        timestamp: state.simulatedTime,
        category: "Facility"
      };
      onAddIncident(newInc);
      setRecentReportResult({
        priority: "Medium",
        category: "Facility",
        resolutionSteps: [
          "Deploy warning sign to isolate the area.",
          "Notify supervisor for specialized cleanup crew."
        ],
        summaryReport: "Logged to Command center securely via safety fallback."
      });
      setReportText("");
    } finally {
      setIsReporting(false);
    }
  };

  // Resolve assigned task
  const handleResolveTask = (incId: string) => {
    if (!resolutionNotes.trim()) {
      addSystemNotification("Please provide resolution notes before completing.", "info");
      return;
    }
    onResolveIncident(incId, resolutionNotes);
    onUpdateVolunteerStatus(activeVolId, "Available");
    setResolutionNotes("");
    addSystemNotification("Task marked resolved and synced with Command Center.", "success");
  };

  // Send Staff Chat
  const handleSendVolChat = async () => {
    if (!volChatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: "vuser-" + Date.now(),
      sender: "user",
      text: volChatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setVolChatHistory(prev => [...prev, userMsg]);
    setVolChatInput("");
    setLoadingVolChat(true);

    try {
      const res = await fetch("/api/copilot/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...volChatHistory, userMsg],
          role: "volunteer",
          state
        })
      });
      const data = await res.json();

      setVolChatHistory(prev => [...prev, {
        id: "vai-" + Date.now(),
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (e) {
      console.error(e);
      setVolChatHistory(prev => [...prev, {
        id: "vai-err-" + Date.now(),
        sender: "ai",
        text: "Command offline backup mode. Standard first-aid kits are at Sector South Gate B, and fire safety equipment is next to Sector North Elevator 1.",
        timestamp: state.simulatedTime
      }]);
    } finally {
      setLoadingVolChat(false);
    }
  };

  const myAssignedIncidents = state.incidents.filter(i => i.assignedVolunteerId === volunteer.id && i.status !== "Resolved");
  const openAlertPool = state.incidents.filter(i => !i.assignedVolunteerId && i.status !== "Resolved");

  // Tabbed layout conditional returns
  if (activeVolunteerTab === 2) {
    return (
      <div className="flex flex-col gap-6" id="volunteer-portal-tab2">
        <VolunteerProfileShiftControl 
          volunteer={volunteer}
          onUpdateStatus={onUpdateVolunteerStatus}
          addNotification={addSystemNotification}
        />
        <VolunteerActiveTaskPanel 
          myAssignedIncidents={myAssignedIncidents}
          resolutionNotes={resolutionNotes}
          setResolutionNotes={setResolutionNotes}
          onResolveTask={handleResolveTask}
        />
        <VolunteerIncidentQueue 
          openAlertPool={openAlertPool}
          onClaimTask={handleClaimTask}
        />
      </div>
    );
  }

  if (activeVolunteerTab === 3) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans items-start" id="volunteer-portal-tab3">
        <div className="lg:col-span-7 flex flex-col gap-6">
          <VolunteerIncidentLogger 
            reportedLocation={reportedLocation}
            setReportedLocation={setReportedLocation}
            reportText={reportText}
            setReportText={setReportText}
            isReporting={isReporting}
            onReportIncident={handleReportIncident}
            recentReportResult={recentReportResult}
          />
        </div>
        <div className="lg:col-span-5 flex flex-col h-full">
          <VolunteerCopilotChat 
            volChatInput={volChatInput}
            setVolChatInput={setVolChatInput}
            volChatHistory={volChatHistory}
            loadingVolChat={loadingVolChat}
            onSendVolChat={handleSendVolChat}
          />
        </div>
      </div>
    );
  }

  // Fallback layout if activeVolunteerTab isn't provided (Original layout)
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 font-sans" id="volunteer-portal">
      {/* LEFT PANEL: Shift Status & Active Dispatches (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <VolunteerProfileShiftControl 
          volunteer={volunteer}
          onUpdateStatus={onUpdateVolunteerStatus}
          addNotification={addSystemNotification}
        />
        <VolunteerActiveTaskPanel 
          myAssignedIncidents={myAssignedIncidents}
          resolutionNotes={resolutionNotes}
          setResolutionNotes={setResolutionNotes}
          onResolveTask={handleResolveTask}
        />
        <VolunteerIncidentQueue 
          openAlertPool={openAlertPool}
          onClaimTask={handleClaimTask}
        />
        <VolunteerIncidentLogger 
          reportedLocation={reportedLocation}
          setReportedLocation={setReportedLocation}
          reportText={reportText}
          setReportText={setReportText}
          isReporting={isReporting}
          onReportIncident={handleReportIncident}
          recentReportResult={recentReportResult}
        />
      </div>

      {/* RIGHT PANEL: Volunteer Support chat (5 cols) */}
      <div className="lg:col-span-5 flex flex-col h-full min-h-[500px]">
        <VolunteerCopilotChat 
          volChatInput={volChatInput}
          setVolChatInput={setVolChatInput}
          volChatHistory={volChatHistory}
          loadingVolChat={loadingVolChat}
          onSendVolChat={handleSendVolChat}
        />
      </div>
    </div>
  );
});

export default VolunteerApp;
