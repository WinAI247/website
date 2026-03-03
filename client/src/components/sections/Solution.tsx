import { motion } from "framer-motion";
import { Video, Activity, Users, FileText } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Video Consultations",
    description: "Same-day access to board-certified cardiologists for urgent evaluations and follow-ups."
  },
  {
    icon: Activity,
    title: "Remote Monitoring",
    description: "Continuous tracking of blood pressure, heart rhythm, and weight with smart devices."
  },
  {
    icon: Users,
    title: "Care Coordination",
    description: "Seamless integration with local providers to ensure continuity of care on the ground."
  },
  {
    icon: FileText,
    title: "eConsults for PCPs",
    description: "Specialist guidance for primary care providers in hours, not months."
  }
];

export default function Solution() {
  return (
    <section id="solution" className="py-24 bg-secondary text-white relative overflow-hidden">
      {/* Abstract Background Element */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="mb-16">
          <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Our Solution</span>
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">
            Cardiology Without Borders
          </h2>
          <p className="text-white/70 text-lg max-w-2xl">
            We combine cutting-edge telehealth technology with human expertise to bring 
            comprehensive heart care anywhere there's an internet connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/20 text-primary flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-heading mb-3">{feature.title}</h3>
              <p className="text-white/60 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
