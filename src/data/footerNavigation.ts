/**
 * SHREE JAGANNATH HOLIDAYS — FOOTER NAVIGATION DATA
 * Strict adherence to verified business context, real contacts & active routes.
 * Consumes single source of truth from BUSINESS_INFO.
 */

import { BUSINESS_INFO } from "../config/business";

export interface FooterLink {
  label: string;
  href?: string;
  action?: 'open-planner';
  destinationHint?: string;
  isRoute?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export const FOOTER_NAVIGATION: FooterSection[] = [
  {
    title: "JOURNEYS",
    links: [
      { label: "Odisha & Jagannath", href: "/journeys/sacred-odisha", isRoute: true },
      { label: "Char Dham Yatra", action: "open-planner", destinationHint: "Char Dham" },
      { label: "South India Tours", action: "open-planner", destinationHint: "South India" },
      { label: "North India Tours", action: "open-planner", destinationHint: "North India" },
      { label: "East India Tours", action: "open-planner", destinationHint: "East India" },
      { label: "West India Tours", action: "open-planner", destinationHint: "West India" },
      { label: "Central India Tours", action: "open-planner", destinationHint: "Central India" },
      { label: "Customized Planning", action: "open-planner", destinationHint: "Customized Journey" },
    ],
  },
  {
    title: "SERVICES",
    links: [
      { label: "Pilgrimage & Spiritual Tours", action: "open-planner" },
      { label: "Pan-India Group Tours", action: "open-planner" },
      { label: "Premium Coach Tours", action: "open-planner" },
      { label: "Group Transportation", action: "open-planner" },
      { label: "Tour Planning", action: "open-planner" },
    ],
  },
  {
    title: "EXPLORE",
    links: [
      { label: "Travel Memories", href: "/travel-memories", isRoute: true },
      { label: "Journey Planner", action: "open-planner" },
    ],
  },
];

export const FOOTER_CONTACT = {
  phone: BUSINESS_INFO.phone,
  email: BUSINESS_INFO.email,
  whatsapp: BUSINESS_INFO.whatsapp,
  location: BUSINESS_INFO.location,
  address: BUSINESS_INFO.address,
  socials: BUSINESS_INFO.socials,
};

export const FOOTER_COPYRIGHT = {
  text: "© 2026 Shree Jagannath Holidays",
  subtext: "Journeys of Faith. Memories for Life.",
};
