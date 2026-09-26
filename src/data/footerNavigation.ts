/**
 * SHREE JAGANNATH HOLIDAYS — FOOTER NAVIGATION DATA
 * Strict adherence to verified links and real business context.
 * No placeholders, no fake contact info, no dead "#" anchors.
 */

export interface FooterLink {
  label: string;
  href?: string;
  action?: 'open-planner';
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
      { label: "Char Dham Yatra", action: "open-planner" },
      { label: "South India Tours", action: "open-planner" },
      { label: "North India Tours", action: "open-planner" },
      { label: "East India Tours", action: "open-planner" },
      { label: "West India Tours", action: "open-planner" },
      { label: "Central India Tours", action: "open-planner" },
      { label: "Customised Planning", action: "open-planner" },
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
  location: "Odisha, India",
  // Strict rule: only verified business details are shown. Unverified items remain null and are omitted.
  phone: null,
  whatsapp: null,
  email: null,
  instagram: null,
};

export const FOOTER_COPYRIGHT = {
  text: "© 2026 Shree Jagannath Holidays",
  subtext: "All rights reserved.",
};
