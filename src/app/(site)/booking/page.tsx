import { BookingForm } from "@/components/booking/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description:
    "Book your wedding photography and videography session with Almir Wedding Films.",
  openGraph: {
    title: "Booking | Almir Wedding Films",
    description:
      "Reserve your wedding date with Almir Wedding Films for photography and videography.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Booking | Almir Wedding Films",
    description:
      "Reserve your wedding date with Almir Wedding Films for photography and videography.",
  },
};

export default function BookingPage() {
  return (
    <div>
      <section className="page-hero py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Reserve Your Date
          </p>
          <h1 className="mt-4 font-serif text-5xl text-foreground sm:text-6xl">
            Book With Us
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-muted">
            Fill out the form below and our team will get back to you within 24
            hours to discuss your dream wedding coverage.
          </p>
        </div>
      </section>
      <BookingForm />
    </div>
  );
}
