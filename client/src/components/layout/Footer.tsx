import logo from "@assets/download_1768878765235.png";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white py-16 border-t border-white/10">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white/5">
                <img src={logo} alt="Access Heart Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-lg font-bold font-heading">Access Heart</span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Eliminating cardiovascular care disparities in rural America through premium virtual cardiology.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Press</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Services</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">For Health Systems</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">For Patients</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Specialties</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Telehealth Platform</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">HIPAA Notice</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
          <p>© 2026 Access Heart Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
