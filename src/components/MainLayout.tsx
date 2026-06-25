"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NpcGuide from "@/components/NpcGuide";
import UserSync from "@/components/UserSync";
import CookieConsent from "@/components/CookieConsent";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import AnimatedBackgroundWrapper from "@/components/AnimatedBackgroundWrapper";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProfileProvider } from "@/context/ProfileContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Pages that should be full-screen "App" style without global footer
  const isAppPage = pathname?.startsWith("/studio") || pathname?.startsWith("/agent");
  
  return (
    <ThemeProvider>
      <ProfileProvider>
        <AnimatedBackgroundWrapper />
        <div className="relative z-10 flex flex-col min-h-screen w-full max-w-full overflow-hidden">
          <UserSync />
          
          <div className="shrink-0 w-full">
            <Navbar />
          </div>

          <main className={`flex-1 w-full max-w-full overflow-x-hidden flex flex-col ${isAppPage ? "h-[calc(100vh-3.5rem)] overflow-hidden" : ""}`}>
            {children}
          </main>

          {!isAppPage && <Footer />}
          
          <CookieConsent />
          <ServiceWorkerRegistration />
          {!isAppPage && <NpcGuide />}
        </div>
      </ProfileProvider>
    </ThemeProvider>
  );
}
