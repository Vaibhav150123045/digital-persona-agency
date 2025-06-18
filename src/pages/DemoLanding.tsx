
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

const DemoLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-spais-purple-500 to-slate-900">
      {/* Demo Header */}
      <div className="bg-orange-600/90 backdrop-blur-sm border-b border-orange-500/30 px-6 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-white" />
            <span className="text-white font-medium">Demo Mode - Full User Journey</span>
          </div>
          <Badge variant="outline" className="text-white border-white bg-white/10">
            Fundraising Demo
          </Badge>
        </div>
      </div>
      
      <Navigation isDemo={true} />
      <Hero isDemo={true} />
      <Features />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default DemoLanding;
