
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface HeroProps {
  isDemo?: boolean;
}

const Hero = ({ isDemo = false }: HeroProps) => {
  const statsData = isDemo ? {
    bookings: "25,000+",
    earnings: "$125M+",
    successRate: "87%"
  } : {
    bookings: "10,000+",
    earnings: "$50M+", 
    successRate: "95%"
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-3xl pt-20 pb-32 sm:pt-48 sm:pb-40">
          <div>
            {isDemo && (
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <Badge variant="outline" className="text-orange-400 border-orange-400 bg-orange-400/10 px-4 py-2">
                  🎬 Experience the complete actor's journey - from discovery to stardom
                </Badge>
              </div>
            )}
            
            {!isDemo && (
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-400 ring-1 ring-white/10 hover:ring-white/20">
                  AI-powered talent management is here.{' '}
                  <Link to="/onboarding" className="font-semibold text-blue-400">
                    <span className="absolute inset-0" aria-hidden="true" />
                    Learn more <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            )}
            
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
                {isDemo ? "Watch How AI Transforms" : "Your AI Agent for"}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  {isDemo ? "Acting Careers" : "Acting Success"}
                </span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                {isDemo 
                  ? "From first audition to $485K+ earnings - see how spais Agency's AI transforms actors into industry professionals. This demo shows a real user journey over 3+ years."
                  : "spais Agency uses AI to find you the perfect auditions, negotiate better contracts, and manage your career growth. Join thousands of actors already working with their AI agents."
                }
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link to={isDemo ? "/demo-onboarding" : "/onboarding"}>
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105">
                    {isDemo ? "Start Demo Journey" : "Get Started"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to={isDemo ? "/demo-dashboard" : "/auth"} className="text-sm font-semibold leading-6 text-white hover:text-blue-400 transition-colors">
                  {isDemo ? "Skip to Success Dashboard" : "Already have an account?"} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{statsData.bookings}</div>
              <div className="text-sm text-gray-400">Successful Bookings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{statsData.earnings}</div>
              <div className="text-sm text-gray-400">Total Earnings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{statsData.successRate}</div>
              <div className="text-sm text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
