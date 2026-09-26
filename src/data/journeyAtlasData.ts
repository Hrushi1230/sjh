/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: JOURNEYS ACROSS INDIA
 * Single Source of Truth: Journey Atlas Data Configuration
 * Follows Section 18 Implementation Structure
 */

export interface JourneyAtlasItem {
  id: string;
  number: string;
  indexLabel: string;
  title: string[];
  copy: string;
  locations: string[];
  asset: string;
  motionType:
    | "atlas-route"
    | "vertical-ascent"
    | "flowing-ribbon"
    | "stacked-horizons"
    | "layered-editorial"
    | "restrained-heritage"
    | "grounded-composition"
    | "human-planning";
  cta: string;
  href?: string;
  actionType: "route" | "planner" | "custom";
}

export const journeyAtlasData: JourneyAtlasItem[] = [
  {
    id: "odisha",
    number: "01",
    indexLabel: "01 ODISHA & JAGANNATH",
    title: ["ODISHA &", "JAGANNATH", "PILGRIMAGE"],
    copy: "Sacred journeys through Odisha.",
    locations: [
      "PURI",
      "KONARK",
      "BHUBANESWAR",
      "CHILIKA",
      "DHAULI",
      "UDAYAGIRI & KHANDAGIRI",
    ],
    asset: "/assets/phase9/p9-odisha-pilgrimage.png",
    motionType: "atlas-route",
    cta: "Explore Odisha Journey →",
    href: "/journeys/sacred-odisha",
    actionType: "route",
  },
  {
    id: "char-dham",
    number: "02",
    indexLabel: "02 CHAR DHAM YATRA",
    title: ["CHAR DHAM", "YATRA"],
    copy: "A sacred journey through the Himalayas.",
    locations: ["YAMUNOTRI", "GANGOTRI", "KEDARNATH", "BADRINATH"],
    asset: "/assets/phase9/p9-char-dham.png",
    motionType: "vertical-ascent",
    cta: "Plan Char Dham Journey →",
    actionType: "planner",
  },
  {
    id: "south-india",
    number: "03",
    indexLabel: "03 SOUTH INDIA TOURS",
    title: ["SOUTH", "INDIA TOURS"],
    copy: "Regional journeys across southern landscapes.",
    locations: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"],
    asset: "/assets/phase9/p9-south-india.png",
    motionType: "flowing-ribbon",
    cta: "Explore South India →",
    actionType: "planner",
  },
  {
    id: "north-india",
    number: "04",
    indexLabel: "04 NORTH INDIA TOURS",
    title: ["NORTH", "INDIA TOURS"],
    copy: "Regional journeys across northern horizons.",
    locations: [
      "Rajasthan",
      "Uttar Pradesh",
      "Uttarakhand",
      "Himachal Pradesh",
      "Jammu & Kashmir",
    ],
    asset: "/assets/phase9/p9-north-india.png",
    motionType: "stacked-horizons",
    cta: "Explore North India →",
    actionType: "planner",
  },
  {
    id: "east-india",
    number: "05",
    indexLabel: "05 EAST INDIA TOURS",
    title: ["EAST", "INDIA TOURS"],
    copy: "Regional journeys across eastern valleys & heritage.",
    locations: ["Odisha", "West Bengal", "Sikkim", "Northeast"],
    asset: "/assets/phase9/p9-east-india.png",
    motionType: "layered-editorial",
    cta: "Explore East India →",
    actionType: "planner",
  },
  {
    id: "west-india",
    number: "06",
    indexLabel: "06 WEST INDIA TOURS",
    title: ["WEST", "INDIA TOURS"],
    copy: "Regional journeys\nacross western India.",
    locations: [], // Strictly no invented destinations
    asset: "/assets/phase9/p9-west-india.png",
    motionType: "restrained-heritage",
    cta: "Explore West India →",
    actionType: "planner",
  },
  {
    id: "central-india",
    number: "07",
    indexLabel: "07 CENTRAL INDIA TOURS",
    title: ["CENTRAL", "INDIA TOURS"],
    copy: "Regional journeys\nacross central India.",
    locations: [], // Strictly no invented destinations
    asset: "/assets/phase9/p9-central-india.png",
    motionType: "grounded-composition",
    cta: "Explore Central India →",
    actionType: "planner",
  },
  {
    id: "custom-planning",
    number: "08",
    indexLabel: "08 CUSTOMISED PLANNING",
    title: ["YOUR JOURNEY", "DOESN'T HAVE", "TO FIT A", "TEMPLATE."],
    copy: "CUSTOMISED TRAVEL PLANNING",
    locations: [
      "WHERE YOU WANT TO GO",
      "WHEN YOU WANT TO TRAVEL",
      "WHO IS TRAVELLING",
      "WHAT MATTERS TO YOU",
    ],
    asset: "/assets/phase9/p9-custom-planning.png",
    motionType: "human-planning",
    cta: "PLAN MY JOURNEY →",
    actionType: "custom",
  },
];
