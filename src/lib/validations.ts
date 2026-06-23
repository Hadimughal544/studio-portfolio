import { z } from "zod";

export const bookingSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is required"),
  eventDate: z.string().min(1, "Event date is required"),
  eventType: z.string().min(1, "Event type is required"),
  venue: z.string().optional(),
  message: z.string().optional(),
});

export const packageSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.coerce.number().min(0),
  features: z.array(z.string()).min(1),
  isPopular: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
});

export const portfolioSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
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
  title: z.string().min(2),
  slug: z.string().min(2),
  password: z.string().optional(),
  coverUrl: z.string().optional(),
  description: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
export type PackageInput = z.infer<typeof packageSchema>;
export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type ClientAlbumInput = z.infer<typeof clientAlbumSchema>;
