import Link from "next/link";
import { AtSign, Mail, Phone } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <p className="font-serif text-2xl tracking-[0.2em] text-gold-300">
            WBA
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
            Wedding by Ayaan Qadeer — where dreams come to life and love stories
            beautifully unfold. Based in Karachi, Pakistan.
          </p>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gold-300">
            Quick Links
          </p>
          <ul className="space-y-2">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/70 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-gold-300">
            Contact
          </p>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <Mail size={16} className="text-gold-400" />
              hello@weddingbyayaanqadeer.com
            </li>
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-gold-400" />
              +92 300 0000000
            </li>
            <li className="flex items-center gap-3">
              <AtSign size={16} className="text-gold-400" />
              @weddingbyayaanqadeer
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-xs text-white/40">
        © {new Date().getFullYear()} Wedding By Ayaan Qadeer. All rights
        reserved.
      </div>
    </footer>
  );
}
