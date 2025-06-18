
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface NavigationProps {
  isDemo?: boolean;
}

const Navigation = ({ isDemo = false }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsOpen(false);
  };

  return (
    <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to={isDemo ? "/demo" : "/"} className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">spais</span>
              <span className="text-sm text-blue-300">Agency</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              onClick={(e) => handleSmoothScroll(e, 'features')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </a>
            <a 
              href="#services" 
              onClick={(e) => handleSmoothScroll(e, 'services')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Services
            </a>
            <a 
              href="#about" 
              onClick={(e) => handleSmoothScroll(e, 'about')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              About
            </a>
            <a 
              href="#contact" 
              onClick={(e) => handleSmoothScroll(e, 'contact')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Contact
            </a>
            <Link to={isDemo ? "/demo-onboarding" : "/onboarding"}>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
            <Link to={isDemo ? "/demo-onboarding" : "/auth"} className="text-white hover:text-blue-400 transition-colors">
              Sign In
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/50 backdrop-blur-lg rounded-lg mt-2">
              <a
                href="#features"
                onClick={(e) => handleSmoothScroll(e, 'features')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Features
              </a>
              <a
                href="#services"
                onClick={(e) => handleSmoothScroll(e, 'services')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Services
              </a>
              <a
                href="#about"
                onClick={(e) => handleSmoothScroll(e, 'about')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                About
              </a>
              <a
                href="#contact"
                onClick={(e) => handleSmoothScroll(e, 'contact')}
                className="block px-3 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Contact
              </a>
              <Link to={isDemo ? "/demo-onboarding" : "/onboarding"} onClick={() => setIsOpen(false)}>
                <Button className="w-full mt-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Get Started
                </Button>
              </Link>
              <Link
                to={isDemo ? "/demo-onboarding" : "/auth"}
                className="block px-3 py-2 text-white hover:text-blue-400 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
