export type LayoutVariant = "faith" | "escape" | "discover" | "slow";

export type IconKey =
  | "temples"
  | "rituals"
  | "coastalCalm"
  | "mountains"
  | "valleys"
  | "tranquility"
  | "palaces"
  | "heritage"
  | "livingCulture"
  | "backwaters"
  | "nature"
  | "unhurriedDays";

export interface ExperienceMarker {
  label: string;
  iconKey: IconKey;
}

export interface FeelingChapter {
  id: "puri" | "kashmir" | "rajasthan" | "kerala";
  feeling: string;
  location: string;
  intro?: string;
  title: string[];
  body: string;
  experiences: ExperienceMarker[];
  layoutVariant: LayoutVariant;
  chapterBackground: string;
  imageAsset: string;
  parallaxAmount: number;
}

export const CANONICAL_FEELING_CHAPTERS: Record<string, FeelingChapter> = {
  puri: {
    id: "puri",
    feeling: "FAITH",
    location: "PURI · ODISHA",
    intro: "More than a place.",
    title: ["A DEEPER", "CONNECTION."],
    body: "Witness centuries-old traditions, stand before the Lord, and feel a journey that touches something deeper within.",
    experiences: [
      { label: "Temples", iconKey: "temples" },
      { label: "Rituals", iconKey: "rituals" },
      { label: "Coastal Calm", iconKey: "coastalCalm" },
    ],
    layoutVariant: "faith",
    chapterBackground: "#F4EFE6",
    imageAsset: "hero-puri.webp",
    parallaxAmount: 24,
  },
  kashmir: {
    id: "kashmir",
    feeling: "ESCAPE",
    location: "KASHMIR · INDIA",
    title: ["GO WHERE", "THE NOISE", "ENDS."],
    body: "Mountains, valleys and open skies. A place to breathe again and rediscover what truly matters.",
    experiences: [
      { label: "Mountains", iconKey: "mountains" },
      { label: "Valleys", iconKey: "valleys" },
      { label: "Tranquility", iconKey: "tranquility" },
    ],
    layoutVariant: "escape",
    chapterBackground: "#F1F2EE",
    imageAsset: "hero-kashmir.webp",
    parallaxAmount: 36,
  },
  rajasthan: {
    id: "rajasthan",
    feeling: "DISCOVER",
    location: "RAJASTHAN · INDIA",
    title: ["STEP INTO", "ANOTHER", "CENTURY."],
    body: "Palaces, carved stone, vibrant markets and stories that still live in every wall.",
    experiences: [
      { label: "Palaces", iconKey: "palaces" },
      { label: "Heritage", iconKey: "heritage" },
      { label: "Living Culture", iconKey: "livingCulture" },
    ],
    layoutVariant: "discover",
    chapterBackground: "#F3E9DC",
    imageAsset: "hero-rajasthan.webp",
    parallaxAmount: 28,
  },
  kerala: {
    id: "kerala",
    feeling: "SLOW DOWN",
    location: "KERALA · INDIA",
    title: ["LET TIME", "MOVE", "DIFFERENTLY."],
    body: "Backwaters, green horizons and unhurried days. A journey to slow down and be present again.",
    experiences: [
      { label: "Backwaters", iconKey: "backwaters" },
      { label: "Nature", iconKey: "nature" },
      { label: "Unhurried Days", iconKey: "unhurriedDays" },
    ],
    layoutVariant: "slow",
    chapterBackground: "#EEF1E8",
    imageAsset: "hero-kerala.webp",
    parallaxAmount: 20,
  },
};

export const CANONICAL_ORDER: Array<"puri" | "kashmir" | "rajasthan" | "kerala"> = [
  "puri",
  "kashmir",
  "rajasthan",
  "kerala",
];

/**
 * Returns the four editorial travel chapters cyclically rotated such that
 * the active destination from the hero appears as Chapter 01.
 */
export function getChapterOrder(activeDestinationId: string): FeelingChapter[] {
  const index = CANONICAL_ORDER.indexOf(activeDestinationId as any);
  const startIndex = index >= 0 ? index : 0;

  const rotatedIds = [
    ...CANONICAL_ORDER.slice(startIndex),
    ...CANONICAL_ORDER.slice(0, startIndex),
  ];

  return rotatedIds.map((id) => CANONICAL_FEELING_CHAPTERS[id]);
}
