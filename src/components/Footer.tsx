
import { Star, Mail, Users, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const footerLinks = {
    company: [
      { name: "About", href: "#about" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" }
    ],
    services: [
      { name: "Acting Representation", href: "#" },
      { name: "Music (Coming Soon)", href: "#" },
      { name: "Sports (Coming Soon)", href: "#" },
      { name: "Content Creation", href: "#" }
    ],
    support: [
      { name: "Help Center", href: "/help" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" }
    ]
  };

  return (
    <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-6">
              <Star className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold text-white">SPAIS</span>
              <span className="text-sm text-blue-300">Agency</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Revolutionising talent representation with AI-powered solutions. 
              Your career, amplified by artificial intelligence.
            </p>
            <div className="flex space-x-4">
              <div className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>
              <div className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div className="bg-white/10 p-2 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                <Calendar className="h-5 w-5 text-blue-400" />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('#') ? (
                    <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Services</h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link, index) => (
                <li key={index}>
                  <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  {link.href.startsWith('#') ? (
                    <a href={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </a>
                  ) : (
                    <Link to={link.href} className="text-gray-300 hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-300 text-sm mb-4 md:mb-0">
              © 2025 Spais. All rights reserved.
            </p>
            <p className="text-gray-400 text-sm">
              Powered by Artificial Intelligence. Built for Artists.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
