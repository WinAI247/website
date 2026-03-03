import { motion } from "framer-motion";
import sanjayImg from "@assets/sanjay_1768880357183.jpg";
import pramodImg from "@assets/Pramod_1768880034694.jpg";
import shishiImg from "@assets/shi_1768880275108.jpg";

const team = [
  {
    name: "Dr. Sanjay Kumar, MD, FACC",
    role: "Co-Founder & CEO",
    bio: "Visionary leader with extensive experience in cardiology and healthcare administration. Committed to bridging the gap in rural healthcare access.",
    image: sanjayImg
  },
  {
    name: "Dr. Pramod Kariyanna, MD, FACC",
    role: "Co-Founder & COO",
    bio: "Board-certified Interventional Cardiologist ensuring clinical excellence and operational efficiency. Former Chief of Cardiology at Rural Community Hospital.",
    image: pramodImg
  },
  {
    name: "Shi Shi",
    role: "CTO",
    bio: "Technology strategist overseeing the secure, scalable telehealth platform. Expert in building HIPAA-compliant healthcare systems.",
    image: shishiImg
  }
];

export default function Team() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-heading font-bold text-secondary mb-4">Leadership</h2>
          <p className="text-secondary/60">Led by experienced clinicians and healthcare innovators</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto max-w-5xl">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6 bg-slate-100">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold font-heading text-secondary mb-1">
                {member.name}
              </h3>
              <p className="text-primary font-medium mb-3 text-sm">{member.role}</p>
              <p className="text-secondary/70 leading-relaxed text-sm">
                {member.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
