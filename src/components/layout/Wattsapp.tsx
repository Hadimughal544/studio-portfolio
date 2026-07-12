import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export function Wattsapp() {
  return (
    <Link
      href="https://wa.me/923214107323"
      aria-label="Chat on WhatsApp"
      target="_blank"
      rel="noopener noreferrer"
      className="group fixed bottom-5 right-5 z-50 sm:bottom-6 sm:right-6"
    >
      <span
        aria-hidden
        className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/40"
      />
      <span
        aria-hidden
        className="absolute -inset-1 rounded-full bg-gradient-to-br from-gold-400/50 to-transparent opacity-70 blur-[2px] transition group-hover:opacity-100"
      />
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)] ring-2 ring-white/25 transition duration-300 group-hover:-translate-y-1 group-hover:bg-[#1ebe57] group-hover:shadow-[0_12px_28px_rgba(37,211,102,0.55)]">
        <FaWhatsapp size={28} aria-hidden />
      </span>
    </Link>
  );
}
