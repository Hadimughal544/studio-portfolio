export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/packages", label: "Packages" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/booking", label: "Booking" },
  { href: "/client-album", label: "Client Album" },
  { href: "/faq", label: "FAQ" },
] as const;

export const PORTFOLIO_CATEGORIES = [
  "wedding",
  "nikkah",
  "barat",
  "valima",
  "engagement",
  "teaser",
] as const;

export const COVERAGE_TYPES = [
  "Mayo",
  "Mehndi",
  "Barat",
  "Walima",
  "Nikkah",
  "Birthday",
  "Fashion",
  "Corporate",
  "Other",
] as const;

export const STUDIO_INFO = {
  name: "Almir Wedding Films",
  phone: "+923214107323",
  email: "almirweddingfilms@gmail.com",
  address: "Office # 41 2nd Floor AL-LATIF CENTRE GULBERG III, Lahore, Pakistan",
} as const;

export const DEFAULT_ADDON_PRICING = {
  basePrice: 20000,
  photographer: 15000,
  videographer: 20000,
  drone: 12000,
  album: 10000,
} as const;

export const CUSTOM_BOOKING_DAYS_KEY = "customBookingDays";

export const MAX_EVENT_DAYS = 10;

export const ABOUT_SECTION_IMAGE = "/images/about-wedding2.jpg";

export const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;
export const MAX_VIDEO_UPLOAD_BYTES = 50 * 1024 * 1024;
