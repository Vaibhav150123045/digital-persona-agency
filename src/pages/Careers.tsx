
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Star, ArrowRight } from "lucide-react";

const Careers = () => {
  const positions = [
    {
      title: "AI Engineer",
      department: "Engineering",
      location: "London, UK",
      type: "Full-time",
      description: "Help build the next generation of AI-powered talent representation tools."
    },
    {
      title: "Talent Agent",
      department: "Representation",
      location: "Los Angeles, CA",
      type: "Full-time",
      description: "Work with emerging and established talent to advance their careers in entertainment."
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Design intuitive experiences that empower talent and streamline representation."
    },
    {
      title: "Data Scientist",
      department: "Analytics",
      location: "New York, NY",
      type: "Full-time",
      description: "Analyze industry trends and build predictive models for talent success."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Help us revolutionize talent representation with AI. We're building the future 
              where every artist has access to world-class representation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <Users className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Diverse Team</h3>
              <p className="text-gray-300">
                Join a team of industry veterans, AI experts, and creative innovators from around the world.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <Star className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Cutting Edge</h3>
              <p className="text-gray-300">
                Work with the latest AI technologies and shape the future of entertainment representation.
              </p>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <MapPin className="h-12 w-12 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Global Impact</h3>
              <p className="text-gray-300">
                Make a difference in artists' lives worldwide with offices in major entertainment hubs.
              </p>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Open Positions</h2>
            <div className="space-y-6">
              {positions.map((position, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-xl font-semibold text-white">{position.title}</h3>
                        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {position.department}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-2">{position.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>{position.location}</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <Button className="mt-4 md:mt-0 bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)] hover:from-blue-700 hover:to-[rgb(143,72,195)]">
                      Apply Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Don't See Your Role?</h2>
            <p className="text-gray-300 mb-6">
              We're always looking for exceptional talent. Send us your resume and let's talk.
            </p>
            <Button className="bg-white/10 border border-white/30 text-white hover:bg-white/20">
              Send Resume
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Careers;
