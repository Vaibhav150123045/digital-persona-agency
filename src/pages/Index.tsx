
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-spais-purple-500 to-slate-900">
      <Navigation />
      <Hero />
      <Features />
      <Services />
      <About />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
