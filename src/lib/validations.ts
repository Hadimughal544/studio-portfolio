import { z } from "zod";
import { MAX_EVENT_DAYS } from "@/lib/constants";

export const packageSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  features: z.array(z.string()).min(1),
  isPopular: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
});

export const portfolioSchema = z.object({
  title: z.string().optional().default(""),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
  mediaUrl: z.string().url(),
  thumbnailUrl: z.string().url().optional().or(z.literal("")),
  category: z.string().default("wedding"),
  sortOrder: z.coerce.number().default(0),
  featured: z.boolean().default(false),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  sortOrder: z.coerce.number().default(0),
});

export const clientAlbumSchema = z.object({
  title: z.string().optional().default(""),
  slug: z.string().min(2),
  coverUrl: z.string().url("Cover image is required"),
  albumUrl: z.string().url("Album link must be a valid URL"),
});

export const heroContentSchema = z.object({
  heading: z.string().min(2, "Heading is required"),
  description: z.string().min(10, "Description is required"),
  locationLabel: z.string().optional().default(""),
  mediaUrl: z.string().url("A background image or video is required"),
  mediaType: z.enum(["IMAGE", "VIDEO"]),
});

export const addonPricingSchema = z.object({
  basePrice: z.coerce.number().min(0),
  photographer: z.coerce.number().min(0),
  videographer: z.coerce.number().min(0),
  drone: z.coerce.number().min(0),
  album: z.coerce.number().min(0),
});

export const contractDaySchema = z
  .object({
    dayNumber: z.number().min(1).max(MAX_EVENT_DAYS),
    coverageLabel: z.string().min(1, "Coverage type is required"),
    location: z.string().min(2, "Location is required"),
    dateTime: z.string().min(1, "Date & time is required"),
    selectionType: z.enum(["PACKAGE", "CUSTOM"]),
    packageId: z.string().optional(),
    photographers: z.number().min(0).optional(),
    videographers: z.number().min(0).optional(),
    drone: z.number().min(0).optional(),
    albums: z.number().min(0).optional(),
  })
  .refine(
    (day) => day.selectionType !== "PACKAGE" || !!day.packageId,
    { message: "Select a package", path: ["packageId"] },
  );

export const contractSchema = z.object({
  brideName: z.string().min(2, "Bride's name is required"),
  groomName: z.string().min(2, "Groom's name is required"),
  bookedFrom: z.enum(["BRIDE", "GROOM", "BOTH"]),
  clientPhone: z.string().min(10, "Phone number is required"),
  clientEmail: z.string().email("Invalid email address"),
  coverageTypes: z.array(z.string()).min(1, "Select at least one coverage type"),
  socialMediaConsent: z.boolean(),
  days: z
    .array(contractDaySchema)
    .min(1, "Add at least one event day")
    .max(MAX_EVENT_DAYS),
  signatureName: z.string().min(2, "Signature (full name) is required"),
  agreedToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export const CONTRACT_STATUS = z.enum([
  "SUBMITTED",
  "CONFIRMED",
  "CANCELLED",
]);

export const adminContractDaySchema = z.object({
  dayNumber: z.coerce.number().min(1).max(MAX_EVENT_DAYS),
  coverageLabel: z.string().min(1, "Event type is required"),
  location: z.string().min(1, "Location is required"),
  dateTime: z.string().min(1, "Date & time is required"),
  amount: z.coerce.number().min(0),
});

export const adminContractSchema = z
  .object({
    brideName: z.string().min(2, "Bride's name is required"),
    groomName: z.string().min(2, "Groom's name is required"),
    bookedFrom: z.enum(["BRIDE", "GROOM", "BOTH"]),
    clientPhone: z.string().min(6, "Phone number is required"),
    clientEmail: z.string().email("Invalid email address"),
    coverageTypes: z
      .array(z.string())
      .min(1, "Select at least one coverage type"),
    socialMediaConsent: z.boolean().default(false),
    days: z
      .array(adminContractDaySchema)
      .min(1, "Add at least one event day")
      .max(MAX_EVENT_DAYS),
    signatureName: z.string().min(2, "Signature (full name) is required"),
    agreedToTerms: z.boolean().default(false),
    status: CONTRACT_STATUS.default("SUBMITTED"),
    totalFee: z.coerce.number().min(0),
    bookingFeeAmount: z.coerce.number().min(0),
    eventDayAmount: z.coerce.number().min(0),
    albumDeliveryAmount: z.coerce.number().min(0),
    bookingFeePaid: z.boolean().default(false),
    eventDayPaid: z.boolean().default(false),
    albumDeliveryPaid: z.boolean().default(false),
  })
  .refine(
    (d) =>
      Math.round(d.bookingFeeAmount + d.eventDayAmount + d.albumDeliveryAmount) ===
      Math.round(d.totalFee),
    {
      message: "Installments must add up to the total fee",
      path: ["albumDeliveryAmount"],
    },
  );

/** Partial update for a single contract's status / payment-received flags. */
export const contractPatchSchema = z
  .object({
    id: z.string().min(1),
    status: CONTRACT_STATUS.optional(),
    bookingFeePaid: z.boolean().optional(),
    eventDayPaid: z.boolean().optional(),
    albumDeliveryPaid: z.boolean().optional(),
  })
  .refine(
    (d) =>
      d.status !== undefined ||
      d.bookingFeePaid !== undefined ||
      d.eventDayPaid !== undefined ||
      d.albumDeliveryPaid !== undefined,
    { message: "Nothing to update" },
  );

export type ContractPatchInput = z.infer<typeof contractPatchSchema>;

export type PackageInput = z.infer<typeof packageSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type ClientAlbumInput = z.infer<typeof clientAlbumSchema>;
export type HeroContentInput = z.infer<typeof heroContentSchema>;
export type AddonPricingInput = z.infer<typeof addonPricingSchema>;
export type ContractDayInput = z.infer<typeof contractDaySchema>;
export type ContractInput = z.infer<typeof contractSchema>;
export type AdminContractDayInput = z.infer<typeof adminContractDaySchema>;
export type AdminContractInput = z.infer<typeof adminContractSchema>;

/** Shape of a contract day as persisted to the DB, with server-computed snapshot fields. */
export type StoredContractDay = ContractDayInput & {
  packageName?: string;
  packagePrice?: number;
  customTotal?: number;
  /** true for days entered manually via the admin form (no package/add-on breakdown). */
  manual?: boolean;
};
