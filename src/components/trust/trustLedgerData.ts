/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 8: THE TRUST LEDGER
 * Canonical Brand Statements and Typed Data Models
 * Strictly compliant with Phase 8 directive: no invented metrics, guarantees, or SaaS claims.
 */

export type TrustEntryId = "01" | "02" | "03" | "04";

export type TrustLayoutType = "crafted" | "rooted" | "human" | "handled";

export interface TrustEntryData {
  id: TrustEntryId;
  title: string[];
  body: string;
  layout: TrustLayoutType;
  bgTone: string;
  accessibleLabel: string;
}

export const TRUST_SECTION_INTRO = {
  eyebrowFull: "WHY SHREE JAGANNATH HOLIDAYS",
  eyebrowCompact: "WHY SJH",
  statementLines: [
    "TRAVEL SHOULD",
    "FEEL PERSONAL",
    "BEFORE IT",
    "FEELS PERFECT.",
  ],
  accessibleTitle: "Travel should feel personal before it feels perfect.",
};

export const TRUST_ENTRIES: TrustEntryData[] = [
  {
    id: "01",
    title: ["PERSONALLY", "CRAFTED"],
    body: "Your journey begins with a conversation, not a template.",
    layout: "crafted",
    bgTone: "#F4EFE6",
    accessibleLabel: "01: Personally Crafted — Your journey begins with a conversation, not a template.",
  },
  {
    id: "02",
    title: ["ROOTED", "IN ODISHA"],
    body: "Local understanding where our story began.",
    layout: "rooted",
    bgTone: "#F2ECE2",
    accessibleLabel: "02: Rooted in Odisha — Local understanding where our story began.",
  },
  {
    id: "03",
    title: ["ONE HUMAN", "CONTACT"],
    body: "One person who knows your journey, from planning to return.",
    layout: "human",
    bgTone: "#F2ECE2",
    accessibleLabel: "03: One Human Contact — One person who knows your journey, from planning to return.",
  },
  {
    id: "04",
    title: ["DETAILS,", "HANDLED."],
    body: "Stays, transport and timing brought together with care.",
    layout: "handled",
    bgTone: "#F5F0E8",
    accessibleLabel: "04: Details, Handled — Stays, transport and timing brought together with care.",
  },
];

export const TRUST_OUTRO_DATA = {
  eyebrow: "NEXT",
  headlineLines: [
    "THE BEST",
    "JOURNEYS",
    "LEAVE STORIES",
    "BEHIND.",
  ],
  accessibleHeadline: "The best journeys leave stories behind.",
};
