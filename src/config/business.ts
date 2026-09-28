/**
 * SHREE JAGANNATH HOLIDAYS — VERIFIED BUSINESS CONFIGURATION
 * Single Source of Truth for verified business info, contacts, services & social links.
 * 
 * Strict rules:
 * - No fake or unverified contact data.
 * - No YouTube links or placeholders.
 * - All components across the application must consume this configuration.
 */

export const BUSINESS_INFO = {
  name: "SHREE JAGANNATH HOLIDAYS",
  owner: "NANI GOPAL SHAW",

  email: "shreejagannathholidays2004@gmail.com",

  phone: {
    display: "+91 92883 67190",
    raw: "919288367190",
    tel: "+919288367190",
  },

  booking: {
    display: "+91 92883 67190",
    raw: "919288367190",
  },

  whatsapp: {
    display: "+91 92883 67190",
    raw: "919288367190",
  },

  address: "Baripada, Odisha, India",
  location: "Baripada, Mayurbhanj, Odisha",

  socials: {
    instagram: "https://www.instagram.com/tikun.official?stkn=ZzdiazI5Z2FodHVk",
    facebook: "https://www.facebook.com/share/1DTW4LuWEQ/",
  },
} as const;

export const SJH_SERVICES = [
  "Domestic pilgrimage & spiritual tours",
  "South India pilgrimage tours",
  "Pan-India group tours",
  "Customized tour packages",
  "Tourist bus / premium coach tours",
  "Sleeper & seating coach travel",
  "Temple and pilgrimage sightseeing",
  "Group transportation",
  "Tour itinerary planning and assistance",
] as const;

export const JOURNEY_TYPE_OPTIONS = [
  "Pilgrimage & Spiritual Tour",
  "South India Pilgrimage",
  "Pan-India Group Tour",
  "Customized Tour",
  "Premium Coach / Tourist Bus",
  "Temple Sightseeing",
  "Group Transportation",
  "Not Sure Yet",
] as const;

export const SUGGESTED_DESTINATIONS = [
  "Puri / Odisha",
  "Kashmir",
  "Rajasthan",
  "Kerala",
  "Char Dham",
  "South India",
  "North India",
  "Customized Journey",
] as const;

export const ODISHA_DISTRICTS = [
  "Bhubaneswar",
  "Cuttack",
  "Puri",
  "Mayurbhanj (Baripada)",
  "Angul",
  "Balangir",
  "Balasore",
  "Bargarh",
  "Bhadrak",
  "Boudh",
  "Deogarh",
  "Dhenkanal",
  "Gajapati",
  "Ganjam (Berhampur)",
  "Jagatsinghpur",
  "Jajpur",
  "Jharsuguda",
  "Kalahandi",
  "Kandhamal",
  "Kendrapara",
  "Keonjhar",
  "Khordha",
  "Koraput",
  "Malkangiri",
  "Nabarangpur",
  "Nayagarh",
  "Nuapada",
  "Rayagada",
  "Sambalpur",
  "Subarnapur (Sonepur)",
  "Sundargarh (Rourkela)",
  "Other City / State",
] as const;

