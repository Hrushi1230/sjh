export type Direction = "north" | "east" | "south" | "west";

export interface EditorialTheme {
  feeling: string;
  eyebrow: string;
  title: string[];
  description: string;
  objectPosition?: string;
}

export interface Destination {
  id: "puri" | "kashmir" | "rajasthan" | "kerala";
  direction: Direction;
  image: string;
  location: string;
  title: string[];
  title1: string;
  title2Prefix: string;
  title2Accent: string;
  sub1?: string;
  sub2?: string;
  detail: string[];
  support1: string;
  support2: string;
  compassDir: "N" | "E" | "S" | "W";
  compassLabel: string;
  ariaLabel: string;
  editorial: EditorialTheme;
}

export const destinations: Destination[] = [
  {
    id: "puri",
    direction: "east",
    image: "hero-puri.webp",
    location: "PURI | ODISHA",
    title: ["JOURNEYS", "OF FAITH."],
    title1: "JOURNEYS",
    title2Prefix: "OF ",
    title2Accent: "FAITH.",
    sub1: "MEMORIES",
    sub2: "FOR LIFE.",
    detail: ["Pilgrimages · Holidays", "Crafted Personally."],
    support1: "Pilgrimages · Holidays",
    support2: "Crafted Personally.",
    compassDir: "E",
    compassLabel: "PURI",
    ariaLabel: "Go to Puri (East)",
    editorial: {
      feeling: "FAITH",
      eyebrow: "FAITH · PURI · ODISHA",
      title: ["SOMETHING", "GREATER THAN", "A HOLIDAY."],
      description: "Journeys shaped by devotion, ritual and the coast.",
      objectPosition: "50% 50%",
    },
  },
  {
    id: "kashmir",
    direction: "north",
    image: "hero-kashmir.webp",
    location: "KASHMIR | INDIA",
    title: ["LOSE YOURSELF.", "FIND SOMETHING", "MORE."],
    title1: "LOSE YOURSELF.",
    title2Prefix: "FIND SOMETHING ",
    title2Accent: "MORE.",
    detail: ["Mountains · Valleys", "Crafted Personally."],
    support1: "Mountains · Valleys",
    support2: "Crafted Personally.",
    compassDir: "N",
    compassLabel: "KASHMIR",
    ariaLabel: "Go to Kashmir (North)",
    editorial: {
      feeling: "ESCAPE",
      eyebrow: "ESCAPE · KASHMIR · INDIA",
      title: ["GO WHERE", "THE NOISE", "ENDS."],
      description: "Mountains, valleys and room to breathe again.",
      objectPosition: "50% 48%",
    },
  },
  {
    id: "rajasthan",
    direction: "west",
    image: "hero-rajasthan.webp",
    location: "RAJASTHAN | INDIA",
    title: ["HISTORY", "IN EVERY", "DETAIL."],
    title1: "HISTORY",
    title2Prefix: "IN EVERY ",
    title2Accent: "DETAIL.",
    detail: ["Palaces · Heritage", "Crafted Personally."],
    support1: "Palaces · Heritage",
    support2: "Crafted Personally.",
    compassDir: "W",
    compassLabel: "RAJASTHAN",
    ariaLabel: "Go to Rajasthan (West)",
    editorial: {
      feeling: "DISCOVER",
      eyebrow: "DISCOVER · RAJASTHAN · INDIA",
      title: ["STEP INTO", "ANOTHER", "CENTURY."],
      description: "Palaces, craft and stories written into stone.",
      objectPosition: "50% 52%",
    },
  },
  {
    id: "kerala",
    direction: "south",
    image: "hero-kerala.webp",
    location: "KERALA | INDIA",
    title: ["LET THE WORLD", "MOVE", "SLOWER."],
    title1: "LET THE WORLD",
    title2Prefix: "MOVE ",
    title2Accent: "SLOWER.",
    detail: ["Backwaters · Nature", "Crafted Personally."],
    support1: "Backwaters · Nature",
    support2: "Crafted Personally.",
    compassDir: "S",
    compassLabel: "KERALA",
    ariaLabel: "Go to Kerala (South)",
    editorial: {
      feeling: "SLOW DOWN",
      eyebrow: "SLOW DOWN · KERALA · INDIA",
      title: ["LET TIME", "MOVE", "DIFFERENTLY."],
      description: "Backwaters, green horizons and unhurried days.",
      objectPosition: "50% 50%",
    },
  },
];

export const heroCopy = {
  introPrompt: "EXPLORE",
  dock: "Book Now",
} as const;

export function getDestinationByDirection(dir: Direction): Destination {
  const found = destinations.find((d) => d.direction === dir);
  return found || destinations[0];
}

export function getDestinationById(id: string): Destination {
  const found = destinations.find((d) => d.id === id);
  return found || destinations[0];
}
