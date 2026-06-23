import { BookingForm } from "@/components/booking/BookingForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking",
  description: "Book your wedding photography and videography session.",
};

export default function BookingPage() {
  return (
    <div>
      <section className="border-b border-white/10 bg-gradient-to-b from-white/5 to-transparent py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs uppercase tracking-[0.35em] text-gold-300">
            Reserve Your Date
          </p>
          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
            Book With Us
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/65">
            Fill out the form below and our team will get back to you within 24
            hours to discuss your dream wedding coverage.
          </p>
        </div>
      </section>
      <BookingForm />
    </div>
  );
}
