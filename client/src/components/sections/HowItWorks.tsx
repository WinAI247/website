import { motion } from "framer-motion";
import { FileInput, Video, FileCheck } from "lucide-react";

const steps = [
  {
    id: "01",
    icon: FileInput,
    title: "Refer",
    description: "PCP sends referral through our secure portal in minutes."
  },
  {
    id: "02",
    icon: Video,
    title: "Connect",
    description: "Patient meets cardiologist via high-res video in 24-72 hours."
  },
  {
    id: "03",
    icon: FileCheck,
    title: "Coordinate",
    description: "Full notes and treatment recommendations sent back to local care team."
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Process</span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary">
            From Referral to Results in Days, Not Months
          </h2>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200" />

          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-white border-4 border-slate-100 flex items-center justify-center mb-8 relative z-10 shadow-lg">
                  <step.icon className="w-10 h-10 text-primary" />
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-sm">
                    {step.id}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold font-heading text-secondary mb-4">
                  {step.title}
                </h3>
                <p className="text-secondary/70 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
