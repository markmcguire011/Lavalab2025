import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import Image from "next/image";

export function LandingNavbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 px-5">
        <div className="flex gap-3 items-center">
          <Image src="/tally_logo_2.svg" alt="Tally Logo" width={40} height={40} />
          <span className="font-bold text-xl text-brand-500 dark:text-brand-800">Tally</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/auth/sign-up">
            <Button>Get Started</Button>
          </Link>
          <ThemeSwitcher />
        </div>
      </div>
    </nav>
  );
}