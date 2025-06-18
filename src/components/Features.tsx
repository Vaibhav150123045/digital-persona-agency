
import { Camera, Music, Users, Briefcase, Calendar, TrendingUp } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Camera,
      title: "Acting Representation",
      description: "AI-powered casting matching, audition scheduling, and contract negotiations for actors at every career stage."
    },
    {
      icon: Music,
      title: "Music Industry (Coming Soon)",
      description: "Comprehensive representation for musicians, including label negotiations, tour booking, and brand partnerships."
    },
    {
      icon: Users,
      title: "Sports Management (Coming Soon)",
      description: "Athletic career management with endorsement deals, contract negotiations, and performance analytics."
    },
    {
      icon: Briefcase,
      title: "Smart Contract Management",
      description: "Automated contract analysis, risk assessment, and optimal terms negotiation using advanced AI algorithms."
    },
    {
      icon: Calendar,
      title: "Intelligent Scheduling",
      description: "AI-optimized calendar management that maximizes opportunities while maintaining work-life balance."
    },
    {
      icon: TrendingUp,
      title: "Career Analytics",
      description: "Data-driven insights into market trends, optimal timing for projects, and strategic career positioning."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionizing Talent Management
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our AI-powered platform combines the expertise of traditional talent agents 
            with the efficiency and insights of cutting-edge technology.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              <feature.icon className="h-12 w-12 text-spais-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
