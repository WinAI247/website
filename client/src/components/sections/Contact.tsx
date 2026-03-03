import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <span className="text-primary font-bold tracking-wider text-sm uppercase mb-2 block">Get In Touch</span>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary mb-6">
              Ready to Bring Cardiology to Your Community?
            </h2>
            <p className="text-xl text-secondary/70 mb-8">
              Let's discuss how Access Heart can support your patients and providers.
            </p>
            
            <div className="flex items-center gap-4 text-secondary/80 font-medium">
              <div className="w-12 h-12 rounded-full bg-white border border-slate-200 flex items-center justify-center text-primary">
                <Mail className="w-5 h-5" />
              </div>
              contact@accessheart.com
            </div>
          </div>

          <Card className="border-0 shadow-xl shadow-slate-200/50 bg-white">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary">Name</label>
                    <Input placeholder="John Doe" className="bg-slate-50 border-slate-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary">Organization</label>
                    <Input placeholder="Hospital / Clinic Name" className="bg-slate-50 border-slate-200" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Email</label>
                  <Input type="email" placeholder="john@example.com" className="bg-slate-50 border-slate-200" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-secondary">Message</label>
                  <Textarea 
                    placeholder="Tell us about your needs..." 
                    className="bg-slate-50 border-slate-200 min-h-[120px]" 
                  />
                </div>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-lg">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
