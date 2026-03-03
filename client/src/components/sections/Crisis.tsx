import { motion } from "framer-motion";
import { MapPinOff, Clock, Activity } from "lucide-react";

const stats = [
  {
    icon: MapPinOff,
    value: "60 Million",
    label: "Americans live in cardiology deserts",
    color: "text-amber-600",
    bg: "bg-amber-100"
  },
  {
    icon: Clock,
    value: "4+ Hours",
    label: "Average drive to see a cardiologist",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    icon: Activity,
    value: "2.3x Higher",
    label: "Cardiac mortality in rural counties",
    color: "text-red-600",
    bg: "bg-red-100"
  }
];

export default function Crisis() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-secondary mb-6">
            Rural America's Silent Heart Crisis
          </h2>
          <p className="text-lg text-secondary/70 leading-relaxed">
            While urban hospitals have cardiologists on every floor, 136 million rural Americans 
            struggle to access the heart care they need, leading to preventable outcomes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`w-14 h-14 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
                <stat.icon className="w-7 h-7" />
              </div>
              <div className={`text-4xl font-bold font-heading ${stat.color} mb-3`}>
                {stat.value}
              </div>
              <p className="text-secondary/70 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
