
import { Award, Clock, Users, Zap } from "lucide-react";

const About = () => {
  const stats = [
    { icon: Users, value: "1000+", label: "Artists Represented" },
    { icon: Award, value: "95%", label: "Contract Success Rate" },
    { icon: Clock, value: "24/7", label: "AI Availability" },
    { icon: Zap, value: "10x", label: "Faster Processing" }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Redefining Artist Representation
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              SPAIS Agency combines decades of entertainment industry expertise with 
              cutting-edge artificial intelligence to provide unparalleled talent representation. 
              Our AI agents work tirelessly to advance your career, negotiate the best deals, 
              and identify opportunities you might never have found on your own.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Starting with actors and expanding into music, sports, and content creation, 
              we're building the future of talent management – one that's more efficient, 
              more insightful, and available whenever you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gradient-to-r from-spais-purple-500 to-spais-purple-600 hover:from-spais-purple-600 hover:to-spais-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200">
                Learn More
              </button>
              <button className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-all duration-200">
                Contact Us
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center hover:bg-white/10 transition-all duration-300"
              >
                <stat.icon className="h-12 w-12 text-spais-purple-400 mb-4 mx-auto" />
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
