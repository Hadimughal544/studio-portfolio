import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Wattsapp } from "@/components/layout/Wattsapp";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-surface text-foreground">
      <Header />
      <main className="min-w-0 flex-1 pt-20">{children}</main>
      <Footer />
      <Wattsapp />
    </div>
  );
}
