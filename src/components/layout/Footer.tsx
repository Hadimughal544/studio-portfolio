import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { FaInstagram, FaTiktok } from "react-icons/fa";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="border-t border-border-theme bg-surface text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:gap-10 sm:px-6 sm:py-16 lg:grid-cols-3 lg:px-8">
        <div>
          <BrandLogo size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
            Almir Wedding Films where dreams come to life and love stories
            beautifully unfold. Based in Lahore, Pakistan.
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
                  className="text-sm text-muted transition hover:text-foreground"
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

          <ul className="space-y-3 text-sm text-muted">
            <li>
              <a
                href="mailto:almirweddingfilms@gmail.com"
                className="flex items-start gap-3 break-all transition hover:text-foreground sm:items-center sm:break-normal"
              >
                <Mail size={16} className="mt-0.5 shrink-0 text-gold-400 sm:mt-0" />
                <span>almirweddingfilms@gmail.com</span>
              </a>
            </li>

            <li>
              <a
                href="tel:+923214107323"
                className="flex items-center gap-3 transition hover:text-foreground"
              >
                <Phone size={16} className="shrink-0 text-gold-400" />
                <span>+92 321 4107323</span>
              </a>
            </li>

            <li>
              <a
                href="https://maps.google.com/?q=Office+%23+41+2nd+Floor+AL-LATIF+CENTRE+GULBERG+Ill,+LAHORE"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 transition hover:text-foreground"
              >
                <MapPin size={16} className="mt-0.5 shrink-0 text-gold-400" />
                <span className="text-left leading-relaxed">
                  Office # 41 2nd Floor AL-LATIF CENTRE GULBERG III, LAHORE
                </span>
              </a>
            </li>

            <li className="flex items-center gap-5 pt-2">
              <a
                href="https://instagram.com/almirweddingfilms"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-gold-400 transition hover:text-gold-300"
              >
                <FaInstagram className="h-6 w-6" />
              </a>

              <a
                href="https://www.tiktok.com/@almirweddingfilms?_t=8mxCdMR2OGX&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-gold-400 transition hover:text-gold-300"
              >
                <FaTiktok className="h-6 w-6" />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border-theme px-4 py-6 text-center text-xs text-muted-subtle">
        <span className="mb-5 block sm:mb-0 sm:inline">
          Design and Developed by{" "}
          <a
            href="https://enid.pk/innovations"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold-400 transition hover:text-gold-300"
          >
            Enid Innovations
          </a>
        </span>
        <br className="hidden sm:block" />
        © {new Date().getFullYear()} Almir Wedding Films. All rights reserved.
      </div>
    </footer>
  );
}
