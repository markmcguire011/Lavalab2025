import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LandingHero() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl m-auto">
        
        <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Inventory Management
          <br />
          Made Simple
        </h1>
        
        <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          Your one-stop hub for made-to-order merchandise. Easily track materials, products, and orders—all in one dashboard.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link href="/auth/sign-up">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Managing Inventory
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Login to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}