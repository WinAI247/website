import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import heroBg from "@assets/generated_images/abstract_medical_technology_background_with_heart_and_network_connections.png";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroBg} 
          alt="Medical technology background" 
          className="w-full h-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Now accepting new partners
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-secondary leading-[1.1] mb-6">
              Every Heartbeat Matters. <br />
              <span className="text-primary">Every Mile Shouldn't.</span>
            </h1>
            
            <p className="text-xl text-secondary/70 leading-relaxed mb-8 max-w-2xl">
              Virtual cardiology bringing world-class heart care to rural America. 
              Eliminating distance as a barrier to life-saving treatment.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white text-lg h-14 px-8 rounded-xl shadow-xl shadow-primary/20">
                Partner With Us
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="text-secondary border-secondary/20 hover:bg-secondary/5 text-lg h-14 px-8 rounded-xl">
                Learn More
              </Button>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-secondary/60">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                Board-Certified Cardiologists
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                HIPAA Compliant
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                50-State Coverage
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
