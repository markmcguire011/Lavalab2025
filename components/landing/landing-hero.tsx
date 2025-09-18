import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Package, BarChart3, Users } from "lucide-react";

export function LandingHero() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8">
          <Image src="/tally_logo_2.svg" alt="Tally Logo" width={120} height={120} className="mx-auto mb-6" />
        </div>
        
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
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Package className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Track Materials</h3>
            <p className="text-muted-foreground">Monitor your inventory levels and never run out of essential materials.</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Manage Orders</h3>
            <p className="text-muted-foreground">Keep track of all your made-to-order merchandise from start to finish.</p>
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">One Dashboard</h3>
            <p className="text-muted-foreground">Consolidate all your business information in a single, easy-to-use interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
}