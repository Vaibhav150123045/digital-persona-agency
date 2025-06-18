
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const plans = [
    {
      name: "Essential",
      price: "£0",
      period: "/month",
      description: "Perfect for new actors building their careers",
      features: [
        "AI-powered casting matching",
        "Basic contract review",
        "Monthly career consultation",
        "Social media strategy",
        "Industry networking events"
      ]
    },
    {
      name: "Plus",
      price: "£22.99",
      period: "/month",
      description: "Comprehensive representation for working actors",
      features: [
        "Everything in Emerging Talent",
        "Advanced contract negotiation",
        "Weekly strategy sessions",
        "Priority casting submissions",
        "Personal brand development",
        "24/7 AI assistant support"
      ],
      popular: true
    },
    {
      name: "Pro",
      price: "£42.99",
      period: "/month",
      description: "Premium service for established professionals",
      features: [
        "Everything in Professional",
        "Dedicated AI agent team",
        "Daily market analysis",
        "Exclusive opportunity access",
        "Crisis management support",
        "Multi-platform career expansion"
      ]
    }
  ];

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Choose Your Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Flexible representation packages designed to grow with your career. 
            Start where you are, scale as you succeed.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-8 border transition-all duration-300 hover:scale-105 cursor-pointer ${
                selectedPlan === index
                  ? 'border-blue-400 bg-blue-500/10' 
                  : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => setSelectedPlan(selectedPlan === index ? null : index)}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)] text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-300">{plan.period}</span>
                </div>
                <p className="text-gray-300">{plan.description}</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full text-white ${
                  selectedPlan === index
                    ? 'bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)] hover:from-blue-700 hover:to-[rgb(143,72,195)]' 
                    : 'bg-white/10 hover:bg-white/20 border border-white/20'
                }`}
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
