
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import GDPRBanner from "@/components/GDPRBanner";
import useGDPRConsent from "@/hooks/useGDPRConsent";

const Index = () => {
  const { showBanner, acceptAll, rejectAll, updatePreferences, closeBanner } = useGDPRConsent();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-spais-purple-500 to-slate-900">
      <Navigation />
      <Hero />
      <Features />
      <Services />
      <About />
      <Contact />
      <Footer />
      
      {showBanner && (
        <GDPRBanner
          onAccept={acceptAll}
          onReject={rejectAll}
          onClose={closeBanner}
          onUpdatePreferences={updatePreferences}
        />
      )}
    </div>
  );
};

export default Index;
