import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import logo from "@assets/download_1768878765235.png";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group cursor-pointer" data-testid="link-home-logo">
          <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center group-hover:shadow-lg transition-all duration-300">
            <img src={logo} alt="Access Heart Logo" className="w-full h-full object-cover" />
          </div>
          <span className={`text-xl font-bold font-heading tracking-tight ${isScrolled ? "text-secondary" : "text-secondary"}`}>
            Access Heart
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#solution" className="text-sm font-medium text-secondary/80 hover:text-primary transition-colors">
            Our Solution
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-secondary/80 hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#health-systems" className="text-sm font-medium text-secondary/80 hover:text-primary transition-colors">
            For Health Systems
          </a>
          <a href="#mission" className="text-sm font-medium text-secondary/80 hover:text-primary transition-colors">
            Mission
          </a>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-secondary hover:text-primary">
            Log In
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20">
            Partner With Us
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-secondary">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-6 mt-10">
                <a href="#solution" className="text-lg font-medium text-secondary hover:text-primary">
                  Our Solution
                </a>
                <a href="#how-it-works" className="text-lg font-medium text-secondary hover:text-primary">
                  How It Works
                </a>
                <a href="#health-systems" className="text-lg font-medium text-secondary hover:text-primary">
                  For Health Systems
                </a>
                <a href="#mission" className="text-lg font-medium text-secondary hover:text-primary">
                  Mission
                </a>
                <div className="h-px bg-border my-2" />
                <Button variant="outline" className="w-full justify-start">
                  Log In
                </Button>
                <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                  Partner With Us
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
