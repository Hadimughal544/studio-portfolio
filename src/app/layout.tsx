import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://almirweddingfilms.com";

const siteTitle = "Almir Wedding Films | Wedding Photography Pakistan";
const siteDescription =
  "Premium wedding photography and videography in Lahore and Lahore, Pakistan. Capturing love stories with elegance and artistry since 2008.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Almir Wedding Films",
  },
  description: siteDescription,
  keywords: [
    "Almir Wedding Films",
    "wedding photography Pakistan",
    "wedding videography Lahore",
    "wedding films Lahore",
    "Pakistani wedding photographer",
    "wedding cinematography",
  ],
  authors: [{ name: "Almir Wedding Films" }],
  creator: "Almir Wedding Films",
  publisher: "Almir Wedding Films",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: siteUrl,
    siteName: "Almir Wedding Films",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/icon.png",
        width: 192,
        height: 192,
        alt: "Almir Wedding Films",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/icon.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png", sizes: "180x180" }],
    shortcut: "/favicon-32.png",
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full`}
      suppressHydrationWarning
    >
      <body className="min-h-full overflow-x-hidden antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
