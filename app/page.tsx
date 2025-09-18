import { LandingNavbar } from "@/components/landing-navbar";
import { LandingFooter } from "@/components/landing-footer";
import { LandingHero } from "@/components/landing-hero";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <LandingNavbar />
      <LandingHero />
      <LandingFooter />
    </main>
  );
}
