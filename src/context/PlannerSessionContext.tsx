import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from "react";
import {
  JourneyDraft,
  createDefaultDraft,
  getDestinationLabel,
} from "../components/hero/plannerData";

export interface PlannerSessionContextType {
  draft: JourneyDraft;
  setDraft: React.Dispatch<React.SetStateAction<JourneyDraft>>;
  updateDraftField: <K extends keyof JourneyDraft>(field: K, value: JourneyDraft[K]) => void;
  step: 1 | 2 | 3 | 4 | 5 | 6;
  setStep: (step: 1 | 2 | 3 | 4 | 5 | 6) => void;
  destinationTouchedByUser: boolean;
  setDestinationTouchedByUser: (touched: boolean) => void;
  isPlannerSheetOpen: boolean;
  openPlannerSheet: (options?: {
    source?: string;
    destination?: string;
    step?: 1 | 2 | 3 | 4 | 5 | 6;
    focusField?: string;
  }) => void;
  closePlannerSheet: () => void;
  focusField: string | null;
  clearFocusField: () => void;
  activeHeroDestination: string;
  setActiveHeroDestination: (dest: string) => void;
}

const PlannerSessionContext = createContext<PlannerSessionContextType | null>(null);

interface PlannerSessionProviderProps {
  children: React.ReactNode;
  initialDestination?: string;
  onCreateJourney?: (draft: JourneyDraft) => void;
}

export const PlannerSessionProvider: React.FC<PlannerSessionProviderProps> = ({
  children,
  initialDestination = "puri",
}) => {
  const [draft, setDraft] = useState<JourneyDraft>(() => createDefaultDraft(initialDestination));
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);
  const [destinationTouchedByUser, setDestinationTouchedByUserState] = useState(false);
  const [isPlannerSheetOpen, setIsPlannerSheetOpen] = useState(false);
  const [focusField, setFocusField] = useState<string | null>(null);
  const [activeHeroDestination, setActiveHeroDestinationState] = useState(initialDestination);

  const destinationTouchedByUserRef = useRef(false);
  destinationTouchedByUserRef.current = destinationTouchedByUser;

  const setDestinationTouchedByUser = useCallback((touched: boolean) => {
    destinationTouchedByUserRef.current = touched;
    setDestinationTouchedByUserState(touched);
  }, []);

  const updateDraftField = useCallback(<K extends keyof JourneyDraft>(field: K, value: JourneyDraft[K]) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Update Hero active destination & sync prefill if user hasn't chosen one
  const setActiveHeroDestination = useCallback((dest: string) => {
    setActiveHeroDestinationState(dest);
    if (!destinationTouchedByUserRef.current) {
      const label = getDestinationLabel(dest);
      if (label) {
        setDraft((prev) => ({
          ...prev,
          destination: label,
        }));
      }
    }
  }, []);

  const openPlannerSheet = useCallback((options?: {
    source?: string;
    destination?: string;
    step?: 1 | 2 | 3 | 4 | 5 | 6;
    focusField?: string;
  }) => {
    if (options?.source) {
      setDraft((prev) => ({ ...prev, source: options.source }));
    }

    if (options?.destination && !destinationTouchedByUserRef.current) {
      const label = getDestinationLabel(options.destination) || options.destination;
      setDraft((prev) => ({ ...prev, destination: label }));
    }

    if (options?.step !== undefined) {
      setStep(options.step);
    }

    if (options?.focusField) {
      setFocusField(options.focusField);
    } else {
      setFocusField(null);
    }

    setIsPlannerSheetOpen(true);
  }, []);

  const closePlannerSheet = useCallback(() => {
    setIsPlannerSheetOpen(false);
    setFocusField(null);
  }, []);

  const clearFocusField = useCallback(() => {
    setFocusField(null);
  }, []);

  // Sync draft to window.__SJH_PLANNER_DRAFT__ for test visibility
  useEffect(() => {
    const win = window as any;
    win.__SJH_PLANNER_DRAFT__ = draft;
  }, [draft]);

  const value = {
    draft,
    setDraft,
    updateDraftField,
    step,
    setStep,
    destinationTouchedByUser,
    setDestinationTouchedByUser,
    isPlannerSheetOpen,
    openPlannerSheet,
    closePlannerSheet,
    focusField,
    clearFocusField,
    activeHeroDestination,
    setActiveHeroDestination,
  };

  return (
    <PlannerSessionContext.Provider value={value}>
      {children}
    </PlannerSessionContext.Provider>
  );
};

export function usePlannerSession(): PlannerSessionContextType {
  const context = useContext(PlannerSessionContext);
  if (!context) {
    throw new Error("usePlannerSession must be used within a PlannerSessionProvider");
  }
  return context;
}
