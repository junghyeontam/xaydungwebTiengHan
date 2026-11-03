import { AppProviders } from "@/components/providers/AppProviders";
import { TopAnnouncementBanner } from "@/components/shared/TopAnnouncementBanner";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { FloatingAssistant } from "@/components/shared/FloatingAssistant";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-200">
        <TopAnnouncementBanner />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <BottomNavigation />
        <FloatingAssistant />
      </div>
    </AppProviders>
  );
}
