
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Star, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    talentType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.talentType || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Submitting contact form:", formData);
      
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        console.error("Error sending email:", error);
        throw new Error(error.message || "Failed to send email");
      }

      console.log("Email sent successfully:", data);
      
      toast({
        title: "Journey Started! 🚀",
        description: "Thank you for your interest! We'll be in touch soon to help accelerate your artistic journey."
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        talentType: "",
        message: ""
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your form. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join the future of talent representation. Get in touch with our team 
            to learn how SPAIS Agency can accelerate your artistic journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Get Started Today</h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Star className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">AI-Powered Matching</h4>
                  <p className="text-gray-300">Our algorithms analyze thousands of opportunities daily to find the perfect matches for your unique talents and career goals.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Industry Expertise</h4>
                  <p className="text-gray-300">Our AI is trained on decades of industry data and continues learning from every successful negotiation and placement.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="h-6 w-6 text-blue-400 mt-1" />
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">Always Available</h4>
                  <p className="text-gray-300">Unlike traditional agents, your SPAIS representative is available 24/7 to handle urgent opportunities and answer questions.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <Input 
                  id="name"
                  placeholder="Enter your full name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Email Address
                </label>
                <Input 
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="talentType" className="block text-sm font-medium text-white mb-2">
                  Talent Type
                </label>
                <Input 
                  id="talentType"
                  placeholder="e.g., Actor, Musician, Athlete"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={formData.talentType}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                  Tell us about your goals
                </label>
                <Textarea 
                  id="message"
                  placeholder="Describe your current career stage and what you hope to achieve..."
                  rows={4}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Starting Your Journey..." : "Start My Journey"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
