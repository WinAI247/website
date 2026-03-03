import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Reduce wait times by 50%+",
  "Keep patients and revenue local",
  "Zero capital investment required",
  "Launch in 60-90 days",
  "Your cardiologists focus on complex cases",
  "Reduce readmissions with better follow-up"
];

export default function HealthSystems() {
  return (
    <section id="health-systems" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-secondary mb-6 leading-tight">
              Extend Your Cardiology Reach Without Extending Your Budget
            </h2>
            <p className="text-lg text-secondary/70 mb-8 leading-relaxed">
              For rural health systems and critical access hospitals, recruiting full-time specialists is difficult and expensive. Access Heart acts as your virtual cardiology department, seamlessly integrated into your workflow.
            </p>
            <Button size="lg" className="bg-secondary hover:bg-secondary/80 text-white h-12 px-8 rounded-lg">
              Request Partnership Information
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                  <Check className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="font-medium text-secondary/80">{benefit}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
