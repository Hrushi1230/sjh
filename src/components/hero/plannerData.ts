export type DestinationId = "puri" | "kashmir" | "rajasthan" | "kerala";

export interface JourneyDraft {
  from: string;
  destination: DestinationId;
  dateMode: "flexible" | "specific";
  date?: string;
  adults: number;
  children: number;
}

export type PlannerState = "closed" | "opening" | "open" | "field-selecting" | "closing";

export type ActiveFieldSelector = "none" | "destination" | "when" | "travellers";

export interface FormErrors {
  from?: string;
  destination?: string;
  date?: string;
  adults?: string;
}

export const DESTINATION_DISPLAY_NAMES: Record<DestinationId, string> = {
  puri: "Puri",
  kashmir: "Kashmir",
  rajasthan: "Rajasthan",
  kerala: "Kerala",
};

export const DEFAULT_FROM_CITY = "Bhubaneswar";

export function createDefaultDraft(activeDestination: DestinationId = "puri"): JourneyDraft {
  return {
    from: DEFAULT_FROM_CITY,
    destination: activeDestination,
    dateMode: "flexible",
    date: "",
    adults: 2,
    children: 0,
  };
}

export function validateJourneyDraft(draft: JourneyDraft): FormErrors {
  const errors: FormErrors = {};

  if (!draft.from || !draft.from.trim()) {
    errors.from = "Departure city is required";
  }

  if (!draft.destination) {
    errors.destination = "Destination is required";
  }

  if (draft.dateMode === "specific") {
    if (!draft.date || !draft.date.trim()) {
      errors.date = "Please select a journey date";
    }
  }

  if (draft.adults < 1) {
    errors.adults = "At least 1 adult is required";
  } else if (draft.adults > 8) {
    errors.adults = "Maximum 8 adults permitted";
  }

  return errors;
}

export function formatTravellersSummary(adults: number, children: number): string {
  const adultText = adults === 1 ? "1 Adult" : `${adults} Adults`;
  if (children <= 0) {
    return adultText;
  }
  const childText = children === 1 ? "1 Child" : `${children} Children`;
  return `${adultText} · ${childText}`;
}

export function formatWhenSummary(dateMode: "flexible" | "specific", date?: string): string {
  if (dateMode === "flexible" || !date) {
    return "Flexible dates";
  }
  // Try to parse YYYY-MM-DD cleanly
  try {
    const parts = date.split("-");
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
  } catch {
    // fallback to raw date
  }
  return date;
}
