import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import Crisis from "@/components/sections/Crisis";
import Solution from "@/components/sections/Solution";
import HowItWorks from "@/components/sections/HowItWorks";
import HealthSystems from "@/components/sections/HealthSystems";
import Mission from "@/components/sections/Mission";
import Credibility from "@/components/sections/Credibility";
import Team from "@/components/sections/Team";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <Navbar />
      <main>
        <Hero />
        <Credibility />
        <Crisis />
        <Solution />
        <HowItWorks />
        <Mission />
        <HealthSystems />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
