import React, { useState, useCallback } from "react";
import { UserRole, StadiumState } from "../types";
import { DEMO_STEPS } from "../components/DemoNarrative";
import { SIMULATION_PRESETS } from "../data/mockStadium";

interface UseWalkthroughProps {
  setStadiumState: React.Dispatch<React.SetStateAction<StadiumState>>;
  setActivePresetIndex: React.Dispatch<React.SetStateAction<number>>;
  setActiveRole: (role: UserRole) => void;
  addSystemNotification: (message: string, type?: "info" | "success" | "alert") => void;
}

export function useWalkthrough({
  setStadiumState,
  setActivePresetIndex,
  setActiveRole,
  addSystemNotification,
}: UseWalkthroughProps) {
  const [activeStepId, setActiveStepId] = useState(1);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);

  const handleStepChange = useCallback((stepId: number) => {
    setActiveStepId(stepId);
    const step = DEMO_STEPS[stepId - 1];
    if (step) {
      setActiveRole(step.role);

      // Auto-set the correct stadium simulation preset state
      setActivePresetIndex(prevIndex => {
        if (step.presetIndex !== prevIndex) {
          setStadiumState(SIMULATION_PRESETS[step.presetIndex].state);
          return step.presetIndex;
        }
        return prevIndex;
      });

      // Highlight map elements
      setSelectedGateId(step.highlightGate);

      addSystemNotification(`Walkthrough sync: Guided to ${step.title}`, "success");
    }
  }, [addSystemNotification, setActiveRole, setActivePresetIndex, setStadiumState]);

  const handleResetDemo = useCallback(() => {
    handleStepChange(1);
    addSystemNotification("Story walkthrough restarted.", "info");
  }, [handleStepChange, addSystemNotification]);

  return {
    activeStepId,
    setActiveStepId,
    selectedSectorId,
    setSelectedSectorId,
    selectedGateId,
    setSelectedGateId,
    handleStepChange,
    handleResetDemo,
  };
}
