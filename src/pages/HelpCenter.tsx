
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, MessageCircle, Book, Phone, Mail } from "lucide-react";

const HelpCenter = () => {
  const faqs = [
    {
      question: "How does SPAIS AI matching work?",
      answer: "Our AI analyzes your profile, skills, and career goals to match you with relevant opportunities in real-time."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes basic AI-powered casting matching, monthly career consultations, and access to industry networking events."
    },
    {
      question: "How do I update my profile?",
      answer: "You can update your profile anytime through your dashboard. Click on 'Profile' and edit any section you'd like to update."
    },
    {
      question: "When will music and sports representation be available?",
      answer: "We're actively developing these services and expect to launch music representation in Q2 2024 and sports in Q3 2024."
    },
    {
      question: "How do contract negotiations work?",
      answer: "Our team reviews contracts, provides recommendations, and can negotiate on your behalf depending on your plan level."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
    }
  ];

  const categories = [
    {
      icon: HelpCircle,
      title: "Getting Started",
      description: "Learn the basics of using SPAIS",
      articles: "12 articles"
    },
    {
      icon: Book,
      title: "Account & Billing",
      description: "Manage your account and subscription",
      articles: "8 articles"
    },
    {
      icon: MessageCircle,
      title: "AI Features",
      description: "Understanding our AI capabilities",
      articles: "15 articles"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[rgb(163,92,215)] to-slate-900">
      <Navigation />
      
      <div className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Help Center
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              Get answers to your questions and learn how to make the most of Spais.
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search for help articles, guides, and FAQs..."
                className="pl-12 h-14 bg-white/10 border-white/30 text-white placeholder:text-gray-400"
              />
              <Button className="absolute right-2 top-2 bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)]">
                Search
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {categories.map((category, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-white/20 transition-colors cursor-pointer">
                <category.icon className="h-12 w-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                <p className="text-gray-300 mb-4">{category.description}</p>
                <p className="text-sm text-blue-300">{category.articles}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">{faq.question}</h3>
                    <p className="text-gray-300">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Need More Help?</h2>
              
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <MessageCircle className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
                  <p className="text-gray-300 mb-4">Chat with our support team in real-time.</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-[rgb(163,92,215)]">
                    Start Chat
                  </Button>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Mail className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Email Support</h3>
                  <p className="text-gray-300 mb-4">Send us a detailed message and we'll get back to you.</p>
                  <Button variant="outline" className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Send Email
                  </Button>
                </div>

                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <Phone className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Phone Support</h3>
                  <p className="text-gray-300 mb-4">Speak directly with our support team.</p>
                  <p className="text-blue-300 font-medium">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-400 mt-1">Mon-Fri, 9AM-6PM EST</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default HelpCenter;
