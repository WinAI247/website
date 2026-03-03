import { motion } from "framer-motion";

const partners = [
  "Rural Health Association",
  "American Heart Association",
  "Telehealth Alliance",
  "Midwest Hospital System",
  "Community Care Network"
];

export default function Credibility() {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <p className="text-sm font-bold text-secondary/40 uppercase tracking-widest mb-10">
          Trusted Partners & Affiliations
        </p>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
          {partners.map((partner, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-bold font-heading text-secondary"
            >
              {partner}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
