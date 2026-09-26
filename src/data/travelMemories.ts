/**
 * SHREE JAGANNATH HOLIDAYS — TRAVEL MEMORIES DATA SOURCE
 * Authentic, verified travel photographs from real tour journeys.
 * No fabricated metadata, customer quotes, or placeholder reviews.
 */

export type MemoryCategory = 'group' | 'pilgrimage' | 'road' | 'temple' | 'night' | 'destination';

export interface TravelMemory {
  id: string;
  num: number;
  src: string;
  alt: string;
  width: number;
  height: number;
  aspectRatio: string;
  location: string | null;
  date: string | null;
  category: MemoryCategory;
}

export const travelMemoriesData: TravelMemory[] = [
  {
    id: "memory-01",
    num: 1,
    src: "/assets/travel-memories/memory-01.jpg",
    alt: "A group of senior travellers and women sitting and standing together in an outdoor courtyard under tree shade",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "group"
  },
  {
    id: "memory-02",
    num: 2,
    src: "/assets/travel-memories/memory-02.jpg",
    alt: "A large group of pilgrims in traditional attire gathered together in front of a red temple hall",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "pilgrimage"
  },
  {
    id: "memory-03",
    num: 3,
    src: "/assets/travel-memories/memory-03.jpg",
    alt: "Tour passengers wearing safety life jackets seated inside an open tourist boat on water",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "destination"
  },
  {
    id: "memory-04",
    num: 4,
    src: "/assets/travel-memories/memory-04.jpg",
    alt: "A small group of travellers posing together under a blue canopy on a bright travel day",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "group"
  },
  {
    id: "memory-05",
    num: 5,
    src: "/assets/travel-memories/memory-05.jpg",
    alt: "A tour group standing in an open temple courtyard in front of a tall red deity statue",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "temple"
  },
  {
    id: "memory-06",
    num: 6,
    src: "/assets/travel-memories/memory-06.jpg",
    alt: "A line of travellers standing together under shaded trees in a landscaped garden stop",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "group"
  },
  {
    id: "memory-07",
    num: 7,
    src: "/assets/travel-memories/memory-07.jpg",
    alt: "Pilgrims and tourists posing in front of a grand decorated temple entrance with red deity facade",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "temple"
  },
  {
    id: "memory-08",
    num: 8,
    src: "/assets/travel-memories/memory-08.jpg",
    alt: "A vibrant group of travellers in traditional orange and red attire smiling together outdoors near a temple complex",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "group"
  },
  {
    id: "memory-09",
    num: 9,
    src: "/assets/travel-memories/memory-09.jpg",
    alt: "Tourists standing together outside an open stone temple boundary wall",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "pilgrimage"
  },
  {
    id: "memory-10",
    num: 10,
    src: "/assets/travel-memories/memory-10.jpg",
    alt: "Pilgrims gathered along a pilgrimage street with vendors and shrine stalls",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "pilgrimage"
  },
  {
    id: "memory-11",
    num: 11,
    src: "/assets/travel-memories/memory-11.jpg",
    alt: "A large tour group gathered indoors for a formal photograph in a banquet hall",
    width: 1280,
    height: 956,
    aspectRatio: "4/3",
    location: null,
    date: null,
    category: "group"
  },
  {
    id: "memory-12",
    num: 12,
    src: "/assets/travel-memories/memory-12.jpg",
    alt: "Tour group members assembled beside a tour bus parked in an open green area",
    width: 1280,
    height: 960,
    aspectRatio: "4/3",
    location: null,
    date: null,
    category: "road"
  },
  {
    id: "memory-13",
    num: 13,
    src: "/assets/travel-memories/memory-13.jpg",
    alt: "A group of travellers smiling together at night against warm illuminated festive lighting",
    width: 1040,
    height: 694,
    aspectRatio: "3/2",
    location: null,
    date: null,
    category: "night"
  },
  {
    id: "memory-14",
    num: 14,
    src: "/assets/travel-memories/memory-14.jpg",
    alt: "A large tour group gathered in front of a Shree Jagannath Holidays luxury coach bus on the road",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "road"
  },
  {
    id: "memory-15",
    num: 15,
    src: "/assets/travel-memories/memory-15.jpg",
    alt: "Tour group members standing in front of an ornamental monumental archway landmark",
    width: 1280,
    height: 573,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "destination"
  },
  {
    id: "memory-16",
    num: 16,
    src: "/assets/travel-memories/memory-16.jpg",
    alt: "A row of travellers posing under a sheltered courtyard structure outside a shrine",
    width: 1280,
    height: 571,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "pilgrimage"
  },
  {
    id: "memory-17",
    num: 17,
    src: "/assets/travel-memories/memory-17.jpg",
    alt: "Tour group standing together on a paved road lined with trees during a scenic excursion",
    width: 1280,
    height: 960,
    aspectRatio: "4/3",
    location: null,
    date: null,
    category: "road"
  },
  {
    id: "memory-18",
    num: 18,
    src: "/assets/travel-memories/memory-18.jpg",
    alt: "A portrait orientation photo of a tour leader with a smiling crowd of pilgrims waving",
    width: 960,
    height: 1280,
    aspectRatio: "3/4",
    location: null,
    date: null,
    category: "group"
  },
  {
    id: "memory-19",
    num: 19,
    src: "/assets/travel-memories/memory-19.jpg",
    alt: "A group sitting and standing together outside an ornate traditional temple with colorful carved spires",
    width: 1280,
    height: 658,
    aspectRatio: "16/8",
    location: null,
    date: null,
    category: "temple"
  },
  {
    id: "memory-20",
    num: 20,
    src: "/assets/travel-memories/memory-20.jpg",
    alt: "A gathering of pilgrims seated together during a spiritual ceremony under a decorative canopy",
    width: 1280,
    height: 572,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "pilgrimage"
  },
  {
    id: "memory-21",
    num: 21,
    src: "/assets/travel-memories/memory-21.jpg",
    alt: "Travellers gathered in a wide line along a rural countryside road lined with trees",
    width: 1280,
    height: 960,
    aspectRatio: "4/3",
    location: null,
    date: null,
    category: "road"
  },
  {
    id: "memory-22",
    num: 22,
    src: "/assets/travel-memories/memory-22.jpg",
    alt: "Pilgrims posing together in an open paved courtyard in front of a white temple structure",
    width: 1280,
    height: 569,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "temple"
  },
  {
    id: "memory-23",
    num: 23,
    src: "/assets/travel-memories/memory-23.jpg",
    alt: "A tour group posing in front of a large carved stone chariot wheel monument",
    width: 1280,
    height: 571,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "destination"
  },
  {
    id: "memory-24",
    num: 24,
    src: "/assets/travel-memories/memory-24.jpg",
    alt: "Pilgrims posing at night in front of an illuminated grand temple tower",
    width: 1280,
    height: 720,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "night"
  },
  {
    id: "memory-25",
    num: 25,
    src: "/assets/travel-memories/memory-25.jpg",
    alt: "Travellers taking a break beside their tour coach on a mountain highway with green hills",
    width: 1280,
    height: 960,
    aspectRatio: "4/3",
    location: null,
    date: null,
    category: "road"
  },
  {
    id: "memory-26",
    num: 26,
    src: "/assets/travel-memories/memory-26.jpg",
    alt: "A group of pilgrims posing at night outside an illuminated temple complex under festival lights",
    width: 1280,
    height: 576,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "night"
  },
  {
    id: "memory-27",
    num: 27,
    src: "/assets/travel-memories/memory-27.jpg",
    alt: "Women travellers in vibrant sarees standing along a paved riverfront promenade",
    width: 1280,
    height: 576,
    aspectRatio: "16/7",
    location: null,
    date: null,
    category: "destination"
  },
  {
    id: "memory-28",
    num: 28,
    src: "/assets/travel-memories/memory-28.jpg",
    alt: "Pilgrims gathered on the stone steps of a holy river ghat during a morning sacred stop",
    width: 1280,
    height: 721,
    aspectRatio: "16/9",
    location: null,
    date: null,
    category: "pilgrimage"
  }
];

/**
 * FOUR SELECTED HOMEPAGE MEMORIES:
 * PHOTO A: Dominant group photograph (Memory 08)
 * PHOTO B: Pilgrimage / temple / landmark (Memory 07)
 * PHOTO C: Coach / road / journey (Memory 14)
 * PHOTO D: Evening / festive night (Memory 13)
 */
export const HOMEPAGE_MEMORIES = {
  photoA: travelMemoriesData.find(m => m.id === "memory-08")!,
  photoB: travelMemoriesData.find(m => m.id === "memory-07")!,
  photoC: travelMemoriesData.find(m => m.id === "memory-14")!,
  photoD: travelMemoriesData.find(m => m.id === "memory-13")!,
};
