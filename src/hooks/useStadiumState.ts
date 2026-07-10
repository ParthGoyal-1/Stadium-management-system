import { useState, useCallback } from "react";
import { StadiumState, Incident, Volunteer } from "../types";
import { INITIAL_STADIUM_STATE, SIMULATION_PRESETS } from "../data/mockStadium";

export function useStadiumState(
  addSystemNotification: (message: string, type?: 'info' | 'success' | 'alert') => void
) {
  const [stadiumState, setStadiumState] = useState<StadiumState>(INITIAL_STADIUM_STATE);
  const [activePresetIndex, setActivePresetIndex] = useState(0);

  // Dynamic simulation preset loading
  const handleSelectPreset = useCallback((index: number) => {
    if (index < 0 || index >= SIMULATION_PRESETS.length) return;
    setActivePresetIndex(index);
    setStadiumState(SIMULATION_PRESETS[index].state);
    addSystemNotification(`Loaded: ${SIMULATION_PRESETS[index].name}`, "info");
  }, [addSystemNotification]);

  // Update volunteer status
  const handleUpdateVolunteerStatus = useCallback((volunteerId: string, status: 'Available' | 'Busy' | 'On Break') => {
    setStadiumState(prev => {
      const updatedVols = prev.volunteers.map(v => 
         v.id === volunteerId ? { ...v, status } : v
      );
      return { ...prev, volunteers: updatedVols };
    });
  }, []);

  // Register a new incident
  const handleAddIncident = useCallback((newInc: Incident) => {
    setStadiumState(prev => {
      if (prev.incidents.find(i => i.id === newInc.id)) return prev;
      return {
        ...prev,
        incidents: [newInc, ...prev.incidents]
      };
    });
  }, []);

  // Mark an incident as resolved and safely reactivate any busy volunteer linked to it
  const handleResolveIncident = useCallback((incidentId: string, actionTaken: string) => {
    setStadiumState(prev => {
      const targetInc = prev.incidents.find(i => i.id === incidentId);
      if (!targetInc) return prev;

      const updatedIncidents = prev.incidents.map(inc => 
        inc.id === incidentId 
          ? { 
              ...inc, 
              status: 'Resolved' as const, 
              actionTaken,
              reportSummary: `Incident resolved successfully by dispatched volunteer at ${new Date().toLocaleTimeString()}`
            } 
          : inc
      );

      const updatedVols = prev.volunteers.map(v => 
        v.assignedTaskId === incidentId 
          ? { ...v, status: 'Available' as const, assignedTaskId: null } 
          : v
      );

      return {
        ...prev,
        incidents: updatedIncidents,
        volunteers: updatedVols
      };
    });
    addSystemNotification(`Incident cleared successfully.`, "success");
  }, [addSystemNotification]);

  return {
    stadiumState,
    setStadiumState,
    activePresetIndex,
    setActivePresetIndex,
    handleSelectPreset,
    handleUpdateVolunteerStatus,
    handleAddIncident,
    handleResolveIncident,
  };
}
