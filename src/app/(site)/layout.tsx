import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TransitionProvider } from "@/components/layout/TransitionProvider";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header />
      <main className="flex-1 pt-20">
        <TransitionProvider>{children}</TransitionProvider>
      </main>
      <Footer />
    </div>
  );
}
