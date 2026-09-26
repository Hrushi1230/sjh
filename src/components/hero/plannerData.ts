export type DestinationId = "puri" | "kashmir" | "rajasthan" | "kerala";

export interface JourneyDraft {
  from: string;
  destination: string;
  dateMode: "flexible" | "specific";
  date?: string; // Departure date (YYYY-MM-DD)
  returnDate?: string; // Return date (YYYY-MM-DD)
  preferredMonth?: string; // e.g. "December 2026"
  approximateDuration?: string; // e.g. "7–10 days"
  adults: number;
  children: number;
  infants?: number;
  journeyType: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  source?: string;
}

export type PlannerState = "closed" | "opening" | "open" | "field-selecting" | "closing";

export type ActiveFieldSelector = "none" | "destination" | "when" | "travellers";

export interface FormErrors {
  from?: string;
  destination?: string;
  date?: string;
  returnDate?: string;
  preferredMonth?: string;
  adults?: string;
  journeyType?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export const DESTINATION_DISPLAY_NAMES: Record<string, string> = {
  puri: "Puri / Odisha",
  "sacred-odisha": "Puri / Odisha",
  odisha: "Puri / Odisha",
  kashmir: "Kashmir",
  "kashmir-valley": "Kashmir",
  rajasthan: "Rajasthan",
  "royal-rajasthan": "Rajasthan",
  kerala: "Kerala",
  "kerala-slowly": "Kerala",
  "char-dham": "Char Dham",
  chardham: "Char Dham",
  "south-india": "South India",
  "north-india": "North India",
  custom: "Customized Journey",
  "customised planning": "Customized Journey",
  "final-home-cta": "",
};

export function getDestinationLabel(idOrName: string): string {
  if (!idOrName) return "";
  if (idOrName in DESTINATION_DISPLAY_NAMES) {
    return DESTINATION_DISPLAY_NAMES[idOrName];
  }
  return idOrName;
}

export const DEFAULT_FROM_CITY = "Bhubaneswar";

export function createDefaultDraft(activeDestination: string = "puri"): JourneyDraft {
  const resolvedDest = activeDestination in DESTINATION_DISPLAY_NAMES
    ? DESTINATION_DISPLAY_NAMES[activeDestination]
    : activeDestination;
  return {
    from: DEFAULT_FROM_CITY,
    destination: resolvedDest,
    dateMode: "flexible",
    date: "",
    returnDate: "",
    preferredMonth: "",
    approximateDuration: "",
    adults: 2,
    children: 0,
    infants: 0,
    journeyType: "Pilgrimage & Spiritual Tour",
    name: "",
    phone: "",
    email: "",
    notes: "",
    source: "hero",
  };
}

/** Step 1 Validation: From & Destination */
export function validateStep1(draft: JourneyDraft): FormErrors {
  const errors: FormErrors = {};

  if (!draft.from || !draft.from.trim()) {
    errors.from = "Please enter where you're travelling from.";
  }

  if (!draft.destination || !draft.destination.trim()) {
    errors.destination = "Choose a destination or tell us where you'd like to go.";
  }

  return errors;
}

/** Step 2 Validation: Travel Dates */
export function validateStep2(draft: JourneyDraft): FormErrors {
  const errors: FormErrors = {};

  if (draft.dateMode === "specific") {
    if (!draft.date || !draft.date.trim()) {
      errors.date = "Please choose a departure date.";
    }
    if (draft.returnDate && draft.date && draft.returnDate < draft.date) {
      errors.returnDate = "Return date cannot be before departure date.";
    }
  } else {
    // Flexible mode
    if (!draft.preferredMonth || !draft.preferredMonth.trim()) {
      errors.preferredMonth = "Please select or enter your preferred month.";
    }
  }

  return errors;
}

/** Step 3 Validation: Travellers */
export function validateStep3(draft: JourneyDraft): FormErrors {
  const errors: FormErrors = {};

  if (draft.adults < 1) {
    errors.adults = "At least 1 adult traveller is required.";
  } else if (draft.adults > 20) {
    errors.adults = "For groups over 20 travellers, please specify in notes.";
  }

  return errors;
}

/** Step 4 Validation: Journey Type */
export function validateStep4(draft: JourneyDraft): FormErrors {
  const errors: FormErrors = {};

  if (!draft.journeyType || !draft.journeyType.trim()) {
    errors.journeyType = "Please select your journey interest.";
  }

  return errors;
}

/** Step 5 Validation: Customer Details */
export function validateStep5(draft: JourneyDraft): FormErrors {
  const errors: FormErrors = {};

  if (!draft.name || !draft.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!draft.phone || !draft.phone.trim()) {
    errors.phone = "Please enter a contact number.";
  } else {
    const cleanPhone = draft.phone.replace(/[\s\-+()]/g, "");
    if (cleanPhone.length < 8) {
      errors.phone = "Please enter a valid phone number.";
    }
  }

  if (draft.email && draft.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(draft.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  return errors;
}

/** Full Journey Draft Validation */
export function validateJourneyDraft(draft: JourneyDraft): FormErrors {
  return {
    ...validateStep1(draft),
    ...validateStep2(draft),
    ...validateStep3(draft),
    ...validateStep4(draft),
    ...validateStep5(draft),
  };
}

export function formatTravellersSummary(adults: number, children: number, infants: number = 0): string {
  const parts: string[] = [];
  parts.push(adults === 1 ? "1 Adult" : `${adults} Adults`);
  if (children > 0) {
    parts.push(children === 1 ? "1 Child" : `${children} Children`);
  }
  if (infants > 0) {
    parts.push(infants === 1 ? "1 Infant" : `${infants} Infants`);
  }
  return parts.join(" · ");
}

export function formatReadableDate(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const d = new Date(year, month, day);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    }
  } catch {
    // fallback
  }
  return isoDate;
}

export function formatShortDate(isoDate?: string): string {
  if (!isoDate) return "";
  try {
    const parts = isoDate.split("-");
    if (parts.length === 3) {
      const year = Number(parts[0]);
      const month = Number(parts[1]) - 1;
      const day = Number(parts[2]);
      const d = new Date(year, month, day);
      return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" }).toUpperCase();
    }
  } catch {
    // fallback
  }
  return isoDate;
}

export function formatWhenSummary(draft: Partial<JourneyDraft>): string {
  if (draft.dateMode === "flexible") {
    const month = draft.preferredMonth || "Flexible";
    const duration = draft.approximateDuration ? ` (${draft.approximateDuration})` : "";
    return `${month}${duration}`;
  }
  if (draft.date && draft.returnDate) {
    return `${formatShortDate(draft.date)} — ${formatShortDate(draft.returnDate)}`;
  }
  if (draft.date) {
    return formatShortDate(draft.date);
  }
  return "Dates to be confirmed";
}
