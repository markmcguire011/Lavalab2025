import { LandingNavbar } from "@/components/landing/landing-navbar";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHero } from "@/components/landing/landing-hero";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <LandingNavbar />
      <LandingHero />
      <LandingFooter />
    </main>
  );
}
