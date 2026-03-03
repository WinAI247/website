import missionBg from "@assets/generated_images/peaceful_rural_american_landscape_for_healthcare_mission.png";

export default function Mission() {
  return (
    <section id="mission" className="relative py-32 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={missionBg} 
          alt="Rural American landscape" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-secondary/80 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-heading font-medium text-white leading-tight italic mb-12">
            "Our mission is to eliminate cardiovascular care disparities so that every American, regardless of ZIP code, has timely access to the heart care they deserve."
          </h2>
          
          <div className="flex flex-col items-center">
            <div className="w-16 h-1 bg-accent mb-6 rounded-full" />
            <div className="text-white font-bold text-lg">Dr. Sanjay Kumar, MD, FACC</div>
            <div className="text-white/60">Co-Founder & CEO</div>
          </div>
        </div>
      </div>
    </section>
  );
}
