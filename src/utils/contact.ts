/**
 * SHREE JAGANNATH HOLIDAYS — CONTACT & WHATSAPP HELPERS
 * Centralized formatting for telephone, email, and contextual WhatsApp enquiries.
 * 
 * Rules:
 * - Never duplicate URL formatting throughout the UI.
 * - Single source of truth is BUSINESS_INFO in src/config/business.ts.
 * - Clean human-readable WhatsApp messages without tracking parameters.
 */

import { BUSINESS_INFO } from "../config/business";
import { JourneyDraft, formatReadableDate } from "../components/hero/plannerData";

/** Creates wa.me URL with optional encoded text */
export function createWhatsAppUrl(message?: string): string {
  const number = BUSINESS_INFO.whatsapp.raw;
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Creates standard tel: link */
export function createPhoneUrl(): string {
  return `tel:+${BUSINESS_INFO.phone.raw}`;
}

/** Creates mailto: link with optional subject & body */
export function createEmailUrl(subject?: string, body?: string): string {
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);
  const query = params.length > 0 ? `?${params.join("&")}` : "";
  return `mailto:${BUSINESS_INFO.email}${query}`;
}

/**
 * Builds the official human-readable WhatsApp enquiry message from the planner state.
 * Implements strict handling for exact vs flexible dates and optional fields.
 */
export function buildJourneyWhatsAppMessage(draft: JourneyDraft): string {
  const lines: string[] = [
    "Hello Shree Jagannath Holidays,",
    "",
    "I would like help planning a journey.",
    "",
    "JOURNEY DETAILS",
    "",
    `From: ${draft.from.trim()}`,
    `Destination: ${draft.destination.trim()}`,
  ];

  // Dates block
  if (draft.dateMode === "specific" && draft.date) {
    lines.push(`Departure: ${formatReadableDate(draft.date)}`);
    if (draft.returnDate) {
      lines.push(`Return: ${formatReadableDate(draft.returnDate)}`);
    }
  } else {
    lines.push("Dates: Flexible");
    if (draft.preferredMonth && draft.preferredMonth.trim()) {
      lines.push(`Preferred Month: ${draft.preferredMonth.trim()}`);
    }
    if (draft.approximateDuration && draft.approximateDuration.trim()) {
      lines.push(`Preferred Duration: ${draft.approximateDuration.trim()}`);
    }
  }

  lines.push("");
  lines.push("TRAVELLERS");
  lines.push("");
  lines.push(`Adults: ${draft.adults}`);
  if (draft.children > 0) {
    lines.push(`Children: ${draft.children}`);
  }
  if (draft.infants && draft.infants > 0) {
    lines.push(`Infants: ${draft.infants}`);
  }

  lines.push("");
  lines.push("Journey Type:");
  lines.push(draft.journeyType || "Customized Tour");

  const hasTravellerDetails = Boolean(
    (draft.name && draft.name.trim()) ||
    (draft.phone && draft.phone.trim()) ||
    (draft.email && draft.email.trim())
  );
  if (hasTravellerDetails) {
    lines.push("");
    lines.push("TRAVELLER DETAILS");
    lines.push("");
    if (draft.name && draft.name.trim()) {
      lines.push(`Name: ${draft.name.trim()}`);
    }
    if (draft.phone && draft.phone.trim()) {
      lines.push(`Phone: ${draft.phone.trim()}`);
    }
    if (draft.email && draft.email.trim()) {
      lines.push(`Email: ${draft.email.trim()}`);
    }
  }

  if (draft.notes && draft.notes.trim()) {
    lines.push("");
    lines.push("ADDITIONAL NOTES");
    lines.push("");
    lines.push(draft.notes.trim());
  }

  lines.push("");
  lines.push("Please help me with the itinerary, availability and further details.");
  lines.push("");
  lines.push("Thank you.");

  return lines.join("\n");
}

/**
 * Direct WhatsApp enquiry for users who prefer instant chat without completing the full planner.
 * Context-aware prefill based on journey page or general inquiry.
 */
export function getDirectWhatsAppEnquiryUrl(context?: string): string {
  let message: string;

  const ctx = (context || "").toLowerCase();
  if (ctx.includes("odisha") || ctx.includes("puri")) {
    message =
      "Hello Shree Jagannath Holidays,\n\nI'm interested in your Odisha & Jagannath journey.\n\nPlease help me with the itinerary and details.";
  } else if (ctx.includes("kashmir")) {
    message =
      "Hello Shree Jagannath Holidays,\n\nI'm interested in the Kashmir journey.\n\nPlease help me with the itinerary and details.";
  } else if (ctx.includes("rajasthan")) {
    message =
      "Hello Shree Jagannath Holidays,\n\nI'm interested in the Rajasthan journey.\n\nPlease help me with the itinerary and details.";
  } else if (ctx.includes("kerala")) {
    message =
      "Hello Shree Jagannath Holidays,\n\nI'm interested in the Kerala journey.\n\nPlease help me with the itinerary and details.";
  } else if (ctx.includes("chardham") || ctx.includes("char-dham")) {
    message =
      "Hello Shree Jagannath Holidays,\n\nI'm interested in the Char Dham Yatra.\n\nPlease help me with the itinerary and details.";
  } else if (ctx.includes("south-india")) {
    message =
      "Hello Shree Jagannath Holidays,\n\nI'm interested in the South India Pilgrimage journey.\n\nPlease help me with the itinerary and details.";
  } else {
    message =
      "Hello Shree Jagannath Holidays,\n\nI would like to enquire about a journey.\n\nPlease help me with the details.";
  }

  return createWhatsAppUrl(message);
}
