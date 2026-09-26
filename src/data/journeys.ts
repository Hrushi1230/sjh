/**
 * SHREE JAGANNATH HOLIDAYS — CANONICAL JOURNEYS DATA
 * Single source of truth for:
 * 1. Phase 5 Explore Links
 * 2. Dedicated Internal Journey Detail Pages
 * Preserves exact routes, assets, metadata and layout directives.
 * Content-Audited: No invented mileage, unverified packages, or operational claims.
 */

export type JourneyId =
  | "sacred-odisha"
  | "kashmir-valley"
  | "royal-rajasthan"
  | "kerala-slowly";

export type DestinationId = "puri" | "kashmir" | "rajasthan" | "kerala";

export interface JourneyDetailImage {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
  objectPosition?: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  location: string;
  summary: string;
  activities: string[];
  featuredDetailIndex?: 0 | 1;
}

export interface RouteStop {
  city: string;
  nights: number;
  highlight: string;
}

export interface JourneyDetailContent {
  tagline: string;
  whyThisJourney: {
    lead: string;
    paragraphs: string[];
    highlights: string[];
  };
  routeOverview: {
    pace: string;
    circuitScope: string;
    description: string;
    stops: RouteStop[];
  };
  itinerary: ItineraryDay[];
  essentials: {
    bestTime: string;
    climate: string;
    attire: string;
    culturalGuidelines: string;
  };
  stayAndTransport: {
    stayPhilosophy: string;
    stayDetails: string;
    transportPhilosophy: string;
    transportDetails: string;
  };
  inclusions: string[];
  exclusions: string[];
  importantNotes: string[];
}

export type JourneyLayoutType = "sacred" | "alpine" | "royal" | "slow";

export interface CuratedJourney {
  id: JourneyId;
  destinationId: DestinationId;
  index: string;
  mood: string;
  title: string[];
  route: string[];
  duration: {
    nights: number;
    days: number;
    label: string;
  };
  description: string;
  mainImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
    objectPosition?: string;
  };
  detailImages: [JourneyDetailImage, JourneyDetailImage];
  href: string;
  layout: JourneyLayoutType;
  bgTone: string;
  accessibleCtaLabel: string;
  content: JourneyDetailContent;
}

export interface Phase5JourneyLink {
  destinationId: DestinationId;
  journeyId: JourneyId;
  label: string;
  href: string;
}

export const CURATED_JOURNEYS: CuratedJourney[] = [
  {
    id: "sacred-odisha",
    destinationId: "puri",
    index: "01 / 04",
    mood: "FAITH · CULTURE · COASTLINE",
    title: ["SACRED", "ODISHA"],
    route: ["Puri", "Konark", "Bhubaneswar"],
    duration: {
      nights: 4,
      days: 5,
      label: "4 Nights · 5 Days",
    },
    description:
      "Walk the sacred path through temple towns, ancient architecture and coastal mornings — a journey shaped by ritual, history and devotion.",
    mainImage: {
      src: "/assets/sjh-phase7/journey-sacred-odisha.webp",
      alt: "Temple architecture near the Odisha coast at sunset.",
      width: 1200,
      height: 1500,
      objectPosition: "center 35%",
    },
    detailImages: [
      {
        src: "/assets/sjh-phase7/odisha-konark-detail.webp",
        alt: "Stone wheel and carved architecture at Konark.",
        caption: "Sun Temple · Konark",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
      {
        src: "/assets/sjh-phase7/odisha-bhubaneswar-detail.webp",
        alt: "Historic temple complex in Bhubaneswar.",
        caption: "Temple Architecture · Bhubaneswar",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
    ],
    href: "/journeys/sacred-odisha",
    layout: "sacred",
    bgTone: "#F4EFE6",
    accessibleCtaLabel: "Explore Sacred Odisha journey",
    content: {
      tagline: "A pilgrimage that touches something deeper within.",
      whyThisJourney: {
        lead: "Odisha is not merely a destination; it is an ancient continuum of living devotion, stone poetry, and timeless coastal rhythms.",
        paragraphs: [
          "From the sacred bells of Shree Jagannath Temple in Puri to the architectural genius of the Konark Sun Temple, this itinerary is shaped for travellers seeking genuine spiritual and cultural communion.",
          "We move away from crowded tour schedules, prioritizing quiet morning moments, sacred architectural walks, and evenings accompanied by the sound of the Bay of Bengal.",
        ],
        highlights: [
          "Temple darshan and sacred traditions in Puri",
          "Architectural exploration of the Konark Sun Temple",
          "Heritage craft traditions and ancient stone carving heritage",
          "Historic Kalinga temple trail through ancient Bhubaneswar sanctuaries",
        ],
      },
      routeOverview: {
        pace: "Unhurried & Reverent",
        circuitScope: "Coastal & Heritage Circuit",
        description: "A cohesive regional circuit connecting the sacred coast with historic temple capitals.",
        stops: [
          { city: "Puri", nights: 2, highlight: "Shree Jagannath Temple heritage & sacred coast" },
          { city: "Konark", nights: 0, highlight: "Sun Temple architecture & coastal Marine Drive" },
          { city: "Bhubaneswar", nights: 2, highlight: "Ekamra Kshetra & historic Kalinga temples" },
        ],
      },
      itinerary: [
        {
          day: 1,
          title: "Arrival & Transition to Sacred Puri",
          location: "Puri",
          summary: "Arrival in Odisha, scenic transit to the coastal sanctuary of Puri, and evening reflection.",
          activities: [
            "[Framework Concept] Arrival reception and ground transit toward Puri",
            "[Framework Concept] Orientation to coastal Puri and twilight beach walk",
            "[Framework Concept] Concierge briefing to align personal travel pace and sacred preferences",
          ],
        },
        {
          day: 2,
          title: "The Heart of Faith: Shree Jagannath Temple",
          location: "Puri",
          summary: "An immersive day dedicated to ritual traditions, temple architecture, and old town spirituality.",
          activities: [
            "[Framework Concept] Sacred Darshan and architectural appreciation at Shree Jagannath Temple",
            "[Framework Concept] Cultural insights into Jagannath traditions, iconography, and sacred lore",
            "[Framework Concept] Exploration of historic mutts and old town artisan quarters",
          ],
          featuredDetailIndex: 1,
        },
        {
          day: 3,
          title: "The Chariot of the Sun: Konark & Marine Drive",
          location: "Konark & Bhubaneswar",
          summary: "Travel along the marine corridor to the 13th-century UNESCO World Heritage Sun Temple.",
          activities: [
            "[Framework Concept] Coastal Marine Drive corridor and Chandrabhaga shoreline perspective",
            "[Framework Concept] Architectural exploration of the monumental stone wheels at Konark Sun Temple",
            "[Framework Concept] Heritage craft village stop (Pattachitra arts) en route to Bhubaneswar",
          ],
          featuredDetailIndex: 0,
        },
        {
          day: 4,
          title: "The Temple City: Bhubaneswar's Ancient Sanctuaries",
          location: "Bhubaneswar",
          summary: "Discover over a thousand years of Kalinga temple architecture and rock-cut history.",
          activities: [
            "[Framework Concept] Heritage walking trail through ancient sanctuaries (Mukteswar & Parasurameswar)",
            "[Framework Concept] Exterior appreciation and reverence around Lingaraj Temple precinct",
            "[Framework Concept] Ancient rock-cut caves of Udayagiri and Khandagiri",
          ],
        },
        {
          day: 5,
          title: "Sacred Farewells & Departure",
          location: "Bhubaneswar",
          summary: "Quiet morning reflection before scheduled departure transit.",
          activities: [
            "[Framework Concept] Peaceful morning reflection and optional local textile exploration",
            "[Framework Concept] Dedicated departure transit coordinated by SJH concierge",
          ],
        },
      ],
      essentials: {
        bestTime: "October through March typically offers pleasant coastal breezes and moderate daytime temperatures.",
        climate: "Tropical coastal climate with warm sunshine and sea breezes; humidity moderates during winter months.",
        attire: "Modest attire respectful of religious sanctuaries is required. Active sanctums observe footwear removal and non-leather guidelines.",
        culturalGuidelines: "Photography and phone use are strictly restricted inside core temple sanctums. Please follow local priest and temple decorum.",
      },
      stayAndTransport: {
        stayPhilosophy: "Curated Heritage & Coastal Stays",
        stayDetails: "[Framework Placeholder] Accommodations (heritage hotels, seaside resorts, boutique properties) are selected during bespoke consultation to match guest preferences and seasonal standards.",
        transportPhilosophy: "Dedicated Private Transit",
        transportDetails: "[Framework Placeholder] Dedicated private ground transportation tailored to party size and route requirements. Vehicle category and transfer arrangements confirmed upon consultation.",
      },
      inclusions: [
        "[Framework Concept] Customized route pacing and dedicated SJH concierge consultation",
        "[Framework Concept] Private ground transit coordination for specified route stops",
        "[Framework Concept] Accommodation curation aligned with client preferences (subject to final selection)",
        "[Framework Concept] On-ground local coordination and assistance throughout the journey",
      ],
      exclusions: [
        "Airfare or interstate rail transit to/from journey start/end points",
        "Personal expenses, laundry, telephone charges, and discretionary gratuities",
        "Individual temple ritual donations (offered directly at sanctums if desired)",
        "Unspecified meals, optional excursions, and specialized entry/camera permits",
      ],
      importantNotes: [
        "[Development Framework] All journey itineraries represent illustrative frameworks. Operational details, hotel partners, and pricing are customized directly by Shree Jagannath Holidays concierge.",
        "Temple admission, darshan schedules, and ritual access are governed by religious authorities and daily temple calendars.",
      ],
    },
  },
  {
    id: "kashmir-valley",
    destinationId: "kashmir",
    index: "02 / 04",
    mood: "MOUNTAINS · LAKES · STILLNESS",
    title: ["KASHMIR", "VALLEY"],
    route: ["Srinagar", "Gulmarg", "Pahalgam"],
    duration: {
      nights: 5,
      days: 6,
      label: "5 Nights · 6 Days",
    },
    description:
      "Snow peaks, still lakes and open valleys. A slower journey through Kashmir's most memorable landscapes.",
    mainImage: {
      src: "/assets/sjh-phase7/journey-kashmir-valley.webp",
      alt: "Mountain valley and lake landscape in Kashmir.",
      width: 1200,
      height: 1500,
      objectPosition: "center 40%",
    },
    detailImages: [
      {
        src: "/assets/sjh-phase7/kashmir-srinagar-detail.webp",
        alt: "Lake and wooden houseboats in Srinagar.",
        caption: "Dal Lake · Srinagar",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
      {
        src: "/assets/sjh-phase7/kashmir-pahalgam-detail.webp",
        alt: "Mountain river valley near Pahalgam.",
        caption: "River Valley · Pahalgam",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
    ],
    href: "/journeys/kashmir-valley",
    layout: "alpine",
    bgTone: "#F1F2EE",
    accessibleCtaLabel: "Explore Kashmir Valley journey",
    content: {
      tagline: "Go where the noise ends and stillness begins.",
      whyThisJourney: {
        lead: "Kashmir invites you to slow your breath, listen to the silent ripple of lake waters, and stand beneath towering Himalayan pines.",
        paragraphs: [
          "This journey avoids rushed schedules. Instead, experience the gentle mist rising over Dal Lake, walk along the tranquil pine forest paths of Pahalgam, and take in the magnificent alpine panoramas of Gulmarg.",
          "Every detail is curated for stillness and wonder, accompanied by warm Kashmiri hospitality and authentic local traditions.",
        ],
        highlights: [
          "Lake experience on Dal Lake with private shikara transit",
          "Observation of morning floating waterways and lake life",
          "Highland alpine meadow vistas in Gulmarg",
          "Unhurried riverside and pine forest walks in the Lidder Valley, Pahalgam",
        ],
      },
      routeOverview: {
        pace: "Spacious & Contemplative",
        circuitScope: "Alpine Valley Circuit",
        description: "An unhurried mountain circuit connecting Dal Lake, pine river valleys, and alpine heights.",
        stops: [
          { city: "Srinagar", nights: 2, highlight: "Dal Lake, historic wooden architecture & terraced gardens" },
          { city: "Gulmarg", nights: 1, highlight: "High altitude alpine meadows and mountain vistas" },
          { city: "Pahalgam", nights: 2, highlight: "Lidder River valley and pine forest paths" },
        ],
      },
      itinerary: [
        {
          day: 1,
          title: "Arrival in Srinagar & Dal Lake Welcome",
          location: "Srinagar",
          summary: "Arrival in the Kashmir Valley, transfer toward Dal Lake, and evening lake atmosphere.",
          activities: [
            "[Framework Concept] Arrival reception at Srinagar Airport and ground transfer to lake area",
            "[Framework Concept] Check-in to curated lake accommodation",
            "[Framework Concept] Sunset shikara ride through quiet channels and lotus waterways",
          ],
          featuredDetailIndex: 0,
        },
        {
          day: 2,
          title: "Old Srinagar Heritage & Historic Terraces",
          location: "Srinagar",
          summary: "Explore timber architecture, historic crafts, and terraced Mughal water gardens.",
          activities: [
            "[Framework Concept] Morning observation of floating waterways and traditional vegetable market",
            "[Framework Concept] Old town heritage walk: historic timber architecture and shrines",
            "[Framework Concept] Architectural visits to Nishat and Shalimar terraced gardens",
          ],
        },
        {
          day: 3,
          title: "Ascent to the Alpine Meadows: Gulmarg",
          location: "Gulmarg",
          summary: "Scenic mountain route into the Pir Panjal range to experience Kashmir's highland meadows.",
          activities: [
            "[Framework Concept] Mountain transit to Gulmarg past pine ridges",
            "[Framework Concept] Highland meadow exploration and panoramic mountain views",
            "[Framework Concept] Optional alpine cable car excursion (subject to weather and ticketing)",
          ],
        },
        {
          day: 4,
          title: "Lidder River Valley: Pahalgam",
          location: "Pahalgam",
          summary: "Descend toward the pine forests and glacial waters of the Lidder Valley.",
          activities: [
            "[Framework Concept] Scenic drive through saffron-growing fields toward Pahalgam",
            "[Framework Concept] Check-in to selected valley accommodation",
            "[Framework Concept] Afternoon walk along pine-scented river trails",
          ],
          featuredDetailIndex: 1,
        },
        {
          day: 5,
          title: "Betaab Valley & Unhurried Meadow Trails",
          location: "Pahalgam",
          summary: "Experience the open mountain horizons and tranquil vistas of Betaab and Aru Valleys.",
          activities: [
            "[Framework Concept] Morning excursion to scenic valley perspectives (Betaab and Aru areas)",
            "[Framework Concept] Gentle nature walks through pine glades and riverside paths",
            "[Framework Concept] Quiet evening in peaceful alpine surroundings",
          ],
        },
        {
          day: 6,
          title: "Mountain Farewells & Departure",
          location: "Srinagar",
          summary: "Scenic return transit to Srinagar for scheduled homeward flight.",
          activities: [
            "[Framework Concept] Morning alpine departure and return transit to Srinagar Airport",
            "[Framework Concept] Assistance with airport departure procedures",
          ],
        },
      ],
      essentials: {
        bestTime: "Spring through Autumn (April–October) for lush green valleys; Winter (December–March) for snow landscapes. Subject to mountain weather conditions.",
        climate: "Mountain climate; cool to cold throughout the year. Temperatures drop significantly at night and in higher alpine zones.",
        attire: "Layered clothing recommended year-round. Warm woollens and thermal wear essential for winter or high-altitude passes.",
        culturalGuidelines: "Modest dress is appreciated across local towns, shrines, and communities. Be respectful when photographing local residents.",
      },
      stayAndTransport: {
        stayPhilosophy: "Traditional Lake & Mountain Hospitality",
        stayDetails: "[Framework Placeholder] Houseboats, mountain chalets, and boutique hotels are selected during consultation to match guest preferences and seasonal standards.",
        transportPhilosophy: "Executive Mountain Ground Transit",
        transportDetails: "[Framework Placeholder] Private chauffeured ground transportation with experienced mountain-route drivers. Vehicle category confirmed per booking consultation.",
      },
      inclusions: [
        "[Framework Concept] Comprehensive journey itinerary design and concierge planning",
        "[Framework Concept] Dedicated chauffeured transport for all listed inter-city routes",
        "[Framework Concept] Curated accommodation coordination per agreed standards",
        "[Framework Concept] 24/7 dedicated travel support throughout Kashmir",
      ],
      exclusions: [
        "Commercial airfare to and from Srinagar",
        "Gondola cable tickets, pony hire, and snow equipment rentals",
        "Personal expenses, laundry, and discretionary gratuities",
        "Unspecified meals, optional activities, or weather-contingent detours",
      ],
      importantNotes: [
        "[Development Framework] All journeys represent illustrative itinerary frameworks. Package specifics, operational partners, and commercial rates are customized directly by SJH concierge.",
        "Mountain itineraries and high-altitude activities are subject to weather, road status, and local authority advisories.",
      ],
    },
  },
  {
    id: "royal-rajasthan",
    destinationId: "rajasthan",
    index: "03 / 04",
    mood: "HERITAGE · ROYALTY · LIVING CULTURE",
    title: ["ROYAL", "RAJASTHAN"],
    route: ["Jaipur", "Jodhpur", "Udaipur"],
    duration: {
      nights: 6,
      days: 7,
      label: "6 Nights · 7 Days",
    },
    description:
      "Palaces, forts and living traditions — a journey through cities where history still shapes everyday life.",
    mainImage: {
      src: "/assets/sjh-phase7/journey-royal-rajasthan.webp",
      alt: "Historic Rajasthan fort and palace landscape.",
      width: 1200,
      height: 1500,
      objectPosition: "center 30%",
    },
    detailImages: [
      {
        src: "/assets/sjh-phase7/rajasthan-jodhpur-detail.webp",
        alt: "Fort overlooking Jodhpur city.",
        caption: "Mehrangarh Fort · Jodhpur",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
      {
        src: "/assets/sjh-phase7/rajasthan-udaipur-detail.webp",
        alt: "Palace architecture beside a Rajasthan lake.",
        caption: "Lake Palace · Udaipur",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
    ],
    href: "/journeys/royal-rajasthan",
    layout: "royal",
    bgTone: "#F3E9DC",
    accessibleCtaLabel: "Explore Royal Rajasthan journey",
    content: {
      tagline: "Step into another century where living traditions endure.",
      whyThisJourney: {
        lead: "Rajasthan is a majestic tapestry of regal courage, intricate sandstone filigree, vibrant artisan bazaars, and peaceful desert twilight.",
        paragraphs: [
          "This journey spans the historic centers of the Pink City (Jaipur), the Blue City (Jodhpur), and the City of Lakes (Udaipur).",
          "Experience grand hilltop fortresses, explore historic courtyards, enjoy lake perspectives at sunset, and witness centuries of living artisan traditions.",
        ],
        highlights: [
          "Historic forts and palace architecture in Jaipur",
          "Sunset views over the Blue City from the ramparts of Mehrangarh Fort",
          "Scenic transfer past the historic Ranakpur Jain temple marble carvings",
          "Lake perspectives and palace architecture in Udaipur",
        ],
      },
      routeOverview: {
        pace: "Regal, Structured & Inspiring",
        circuitScope: "Royal Heritage Circuit",
        description: "Connecting the historic citadels and palace heritage of Jaipur, Jodhpur, and Udaipur.",
        stops: [
          { city: "Jaipur", nights: 2, highlight: "Amber Fort, City Palace, and historic bazaars" },
          { city: "Jodhpur", nights: 2, highlight: "Mehrangarh Fort and blue city heritage lanes" },
          { city: "Udaipur", nights: 2, highlight: "City Palace and Lake Pichola heritage" },
        ],
      },
      itinerary: [
        {
          day: 1,
          title: "Arrival in the Pink City: Jaipur",
          location: "Jaipur",
          summary: "Arrival in Jaipur and introduction to Rajput architecture and vibrant bazaars.",
          activities: [
            "[Framework Concept] Arrival reception at Jaipur Airport and private transfer to accommodation",
            "[Framework Concept] Introductory drive past historic landmarks including Hawa Mahal façade",
            "[Framework Concept] Evening walk through traditional artisan bazaars",
          ],
        },
        {
          day: 2,
          title: "Amber Ramparts & Palatial Heritage",
          location: "Jaipur",
          summary: "Explore the legendary forts and astronomy monuments of the Kachwaha dynasty.",
          activities: [
            "[Framework Concept] Guided exploration of Amber Fort and historic courtyards",
            "[Framework Concept] Visit to City Palace complex and UNESCO-listed Jantar Mantar observatory",
            "[Framework Concept] Cultural overview of traditional hand-block printing and textiles",
          ],
        },
        {
          day: 3,
          title: "Westward to the Sun City: Jodhpur",
          location: "Jodhpur",
          summary: "Countryside transit toward the gateway of the Thar desert.",
          activities: [
            "[Framework Concept] Overland private transit from Jaipur to Jodhpur",
            "[Framework Concept] Check-in to selected heritage accommodation in Jodhpur",
            "[Framework Concept] Twilight walk through historic indigo-washed old quarters",
          ],
        },
        {
          day: 4,
          title: "The Citadel of the Sun: Mehrangarh Fort",
          location: "Jodhpur",
          summary: "Ascend to one of India's most imposing and impeccably preserved fortresses.",
          activities: [
            "[Framework Concept] Morning tour of Mehrangarh Fort ramparts and museum collections",
            "[Framework Concept] Visit to Jaswant Thada marble cenotaph",
            "[Framework Concept] Local market walk near the historic Clock Tower",
          ],
          featuredDetailIndex: 0,
        },
        {
          day: 5,
          title: "Marble Sanctuaries & The City of Lakes: Udaipur",
          location: "Udaipur",
          summary: "Travel south toward Udaipur with a stop at the carved marble pillars of Ranakpur.",
          activities: [
            "[Framework Concept] Scenic drive through the Aravalli hills toward Ranakpur",
            "[Framework Concept] Architectural exploration of the carved marble pillars at Ranakpur Jain Temple",
            "[Framework Concept] Arrival in lakeside Udaipur and check-in to curated stay",
          ],
          featuredDetailIndex: 1,
        },
        {
          day: 6,
          title: "Palatial Splendour & Lake Living",
          location: "Udaipur",
          summary: "Immerse in the Mewar dynasty's greatest architectural and artistic legacy.",
          activities: [
            "[Framework Concept] Morning tour of Udaipur City Palace museum complex",
            "[Framework Concept] Walk through Saheliyon ki Bari courtyard gardens and fountains",
            "[Framework Concept] Sunset lake perspective along Lake Pichola",
          ],
        },
        {
          day: 7,
          title: "Royal Departures",
          location: "Udaipur",
          summary: "Bid farewell to Rajasthan before scheduled homeward departure.",
          activities: [
            "[Framework Concept] Morning leisure and final lake view reflection",
            "[Framework Concept] Private transfer to Udaipur Airport for connecting flight",
          ],
        },
      ],
      essentials: {
        bestTime: "October through March is the primary travel window with warm daytime temperatures and cool, starry evenings.",
        climate: "Semi-arid desert climate with warm daylight and crisp nights; seasonal temperature drops occur after sunset.",
        attire: "Light breathable cottons for daytime exploration; a light jacket or shawl is recommended for winter evenings.",
        culturalGuidelines: "Respect local customs, particularly around religious shrines and traditional rural communities.",
      },
      stayAndTransport: {
        stayPhilosophy: "Heritage Havelis & Palatial Stays",
        stayDetails: "[Framework Placeholder] Restored historic residences, havelis, and boutique palace properties curated per guest preferences during consultation.",
        transportPhilosophy: "Executive Highway Transit",
        transportDetails: "[Framework Placeholder] Air-conditioned executive vehicles with experienced highway drivers throughout the multi-city circuit.",
      },
      inclusions: [
        "[Framework Concept] Custom route pacing and bespoke itinerary curation",
        "[Framework Concept] Dedicated private ground transportation between all listed cities",
        "[Framework Concept] Accommodation booking coordination per agreed tier",
        "[Framework Concept] 24/7 concierge contact throughout your Rajasthan journey",
      ],
      exclusions: [
        "Domestic and international airfare",
        "Monument entrance fees, audio guides, camera permit fees",
        "Discretionary tipping, laundry, and personal expenditure",
        "Meals not specified in final customized proposal",
      ],
      importantNotes: [
        "[Development Framework] All journey itineraries represent illustrative frameworks. Confirmed hotels, guides, and commercial rates are finalized directly by Shree Jagannath Holidays concierge.",
      ],
    },
  },
  {
    id: "kerala-slowly",
    destinationId: "kerala",
    index: "04 / 04",
    mood: "NATURE · BACKWATERS · UNHURRIED DAYS",
    title: ["KERALA", "SLOWLY"],
    route: ["Kochi", "Munnar", "Alleppey"],
    duration: {
      nights: 5,
      days: 6,
      label: "5 Nights · 6 Days",
    },
    description:
      "Tea hills, heritage streets and quiet backwaters. Travel Kerala at a pace that leaves room to actually experience it.",
    mainImage: {
      src: "/assets/sjh-phase7/journey-kerala-slowly.webp",
      alt: "Houseboat on Kerala backwaters.",
      width: 1200,
      height: 1500,
      objectPosition: "center 45%",
    },
    detailImages: [
      {
        src: "/assets/sjh-phase7/kerala-munnar-detail.webp",
        alt: "Tea plantations across Munnar hills.",
        caption: "Tea Country · Munnar",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
      {
        src: "/assets/sjh-phase7/kerala-kochi-detail.webp",
        alt: "Chinese fishing nets along Kochi waterfront.",
        caption: "Coastline · Fort Kochi",
        width: 1200,
        height: 900,
        objectPosition: "center center",
      },
    ],
    href: "/journeys/kerala-slowly",
    layout: "slow",
    bgTone: "#EEF1E8",
    accessibleCtaLabel: "Explore Kerala Slowly journey",
    content: {
      tagline: "Let time move differently across tea hills and backwaters.",
      whyThisJourney: {
        lead: "Kerala is an invitation to exhale. Here, travel is not measured in milestones checked off, but in the slow passage of water beneath a wooden hull.",
        paragraphs: [
          "This journey starts along the spice trade shores of Fort Kochi, ascends into the rolling green carpets of Munnar's tea hills, and concludes drifting along the tranquil backwaters of Alleppey.",
          "We prioritize quiet nature retreats, authentic regional cuisine, and unhurried village encounters where silence is honoured.",
        ],
        highlights: [
          "Heritage walking exploration of Fort Kochi and the Chinese fishing nets",
          "Tea estate walking trails in the cloud mist of Munnar",
          "Tranquil backwater cruise on traditional wooden watercraft in Alleppey",
          "Introduction to traditional Kerala wellness and calm living",
        ],
      },
      routeOverview: {
        pace: "Unhurried, Mindful & Restorative",
        circuitScope: "Backwater & Highland Circuit",
        description: "From historic maritime spice port to cool tea highlands and backwater waterways.",
        stops: [
          { city: "Kochi", nights: 1, highlight: "Fort Kochi colonial heritage & Chinese nets" },
          { city: "Munnar", nights: 2, highlight: "Tea plantations, mountain mist & spice gardens" },
          { city: "Alleppey", nights: 2, highlight: "Traditional backwater waterways & lake living" },
        ],
      },
      itinerary: [
        {
          day: 1,
          title: "The Spice Port: Fort Kochi",
          location: "Kochi",
          summary: "Arrive in historic Kochi and wander through centuries of maritime spice history.",
          activities: [
            "[Framework Concept] Arrival at Cochin International Airport and ground transfer to Fort Kochi",
            "[Framework Concept] Check-in to selected colonial or heritage accommodation",
            "[Framework Concept] Evening walk along the waterfront to observe Chinese fishing nets",
          ],
          featuredDetailIndex: 1,
        },
        {
          day: 2,
          title: "Into the Tea Highlands: Munnar",
          location: "Munnar",
          summary: "Drive into the Western Ghats past cascading waterfalls and cardamom hills.",
          activities: [
            "[Framework Concept] Scenic mountain climb to Munnar with photo stops along hill waterfalls",
            "[Framework Concept] Check-in to curated plantation or hillside retreat",
            "[Framework Concept] Afternoon walk through surrounding cardamom and tea plantations",
          ],
        },
        {
          day: 3,
          title: "Cloud Mist & Emerald Valleys",
          location: "Munnar",
          summary: "A day spent wandering amidst rolling green carpets of tea leaves and mountain streams.",
          activities: [
            "[Framework Concept] Morning nature walk along tea estate boundaries",
            "[Framework Concept] Visit to historic tea manufacturing heritage center",
            "[Framework Concept] Scenic drive through surrounding valleys and mountain viewpoints",
          ],
          featuredDetailIndex: 0,
        },
        {
          day: 4,
          title: "The Waterways of God's Country: Alleppey",
          location: "Alleppey",
          summary: "Descend from the hills to explore the serene backwaters of Alleppey.",
          activities: [
            "[Framework Concept] Scenic descent from Western Ghats to the backwaters of Alleppey",
            "[Framework Concept] Boarding curated watercraft or checking in to waterfront stay",
            "[Framework Concept] Slow cruise through quiet palm-fringed canals and village waterways",
          ],
        },
        {
          day: 5,
          title: "Village Waterways & Unhurried Living",
          location: "Alleppey",
          summary: "Experience the gentle rhythms of life along the canals and lake waters.",
          activities: [
            "[Framework Concept] Morning country boat or canoe excursion through village waterways",
            "[Framework Concept] Observation of traditional coir craft and coastal livelihood",
            "[Framework Concept] Unhurried afternoon for rest, reflection, and waterside calm",
          ],
        },
        {
          day: 6,
          title: "Gentle Departures",
          location: "Kochi",
          summary: "Carry the restorative calm of Kerala back to your everyday life.",
          activities: [
            "[Framework Concept] Morning waterside reflection and relaxed preparation",
            "[Framework Concept] Private transfer to Cochin International Airport for departure",
          ],
        },
      ],
      essentials: {
        bestTime: "September to March provides pleasant coastal and highland weather. Monsoon (June–August) offers lush greenery and traditional Ayurvedic seasons.",
        climate: "Tropical coastal and mountain climate. Munnar is cool, while coastal lowlands are warm and humid.",
        attire: "Light cottons, comfortable walking sandals, and rain protection; a light cardigan for Munnar evenings.",
        culturalGuidelines: "Backwater communities live closely along the canals. Please respect residential privacy when cruising or walking.",
      },
      stayAndTransport: {
        stayPhilosophy: "Nature & Heritage Immersion",
        stayDetails: "[Framework Placeholder] Plantation retreats, heritage mansions, and traditional houseboats curated per individual guest preferences during consultation.",
        transportPhilosophy: "Integrated Road & Water Transit",
        transportDetails: "[Framework Placeholder] Dedicated air-conditioned private vehicle on land and certified private watercraft on canals.",
      },
      inclusions: [
        "[Framework Concept] Custom journey itinerary design and dedicated concierge planning",
        "[Framework Concept] Private ground transportation throughout the itinerary",
        "[Framework Concept] Accommodation coordination for hotels, retreats, or houseboats",
        "[Framework Concept] 24/7 dedicated SJH on-trip support",
      ],
      exclusions: [
        "Airfare or train travel to and from Kochi",
        "Ayurvedic medical treatments and specialized therapies",
        "Personal expenses, laundry, and discretionary tipping",
        "Any service not confirmed in your personalized proposal",
      ],
      importantNotes: [
        "[Development Framework] All journey itineraries represent illustrative frameworks. Final service providers, boat configurations, and commercial rates are confirmed upon consultation.",
      ],
    },
  },
];

export const PHASE5_JOURNEY_LINKS: Record<DestinationId, Phase5JourneyLink> = {
  puri: {
    destinationId: "puri",
    journeyId: "sacred-odisha",
    label: "Explore Puri Journey →",
    href: "/journeys/sacred-odisha",
  },
  kashmir: {
    destinationId: "kashmir",
    journeyId: "kashmir-valley",
    label: "Explore Kashmir Journey →",
    href: "/journeys/kashmir-valley",
  },
  rajasthan: {
    destinationId: "rajasthan",
    journeyId: "royal-rajasthan",
    label: "Explore Rajasthan Journey →",
    href: "/journeys/royal-rajasthan",
  },
  kerala: {
    destinationId: "kerala",
    journeyId: "kerala-slowly",
    label: "Explore Kerala Journey →",
    href: "/journeys/kerala-slowly",
  },
};

export function getJourneyById(id: JourneyId): CuratedJourney | undefined {
  return CURATED_JOURNEYS.find((j) => j.id === id);
}

export function getJourneyByDestination(destinationId: DestinationId): CuratedJourney | undefined {
  return CURATED_JOURNEYS.find((j) => j.destinationId === destinationId);
}
