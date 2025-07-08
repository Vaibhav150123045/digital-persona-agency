
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Database, Wand2 } from "lucide-react";

interface SampleDataSeederProps {
  onDataSeeded?: () => void;
}

const SampleDataSeeder = ({ onDataSeeded }: SampleDataSeederProps) => {
  const [isSeeding, setIsSeeding] = useState(false);
  const { toast } = useToast();

  const sampleOpportunities = [
    {
      title: "Lead Actor - Independent Drama Film",
      project_name: "Midnight Reflections",
      role_type: "lead" as const,
      description: "Seeking a talented lead actor for an independent drama about family relationships and personal growth.",
      requirements: "Age 25-35, dramatic acting experience, comfortable with emotional scenes",
      compensation_range: "$5,000 - $10,000",
      location: "Los Angeles, CA",
      shoot_dates: "March 2024",
      casting_director: "Sarah Johnson",
      production_company: "Indie Films LLC",
      genres: ["Drama", "Independent"],
      age_range: "25-35",
      gender_requirements: "Any",
      special_skills: ["Dramatic Acting", "Emotional Range"]
    },
    {
      title: "Supporting Character - Netflix Series",
      project_name: "City Lights",
      role_type: "supporting" as const,
      description: "Recurring supporting character for a Netflix drama series set in modern-day New York.",
      requirements: "Age 28-40, TV experience preferred, New York accent a plus",
      compensation_range: "$15,000 - $25,000",
      location: "New York, NY",
      shoot_dates: "April - June 2024",
      casting_director: "Michael Chen",
      production_company: "Netflix Productions",
      genres: ["Drama", "TV Series"],
      age_range: "28-40",
      gender_requirements: "Any",
      special_skills: ["TV Acting", "New York Accent"]
    },
    {
      title: "Featured Role - Commercial Campaign",
      project_name: "Tech Brand Commercial",
      role_type: "featured" as const,
      description: "Featured role in a national commercial campaign for a major tech company.",
      requirements: "Age 25-45, commercial experience, comfortable with technology",
      compensation_range: "$2,000 - $5,000",
      location: "Los Angeles, CA",
      shoot_dates: "February 2024",
      casting_director: "Lisa Rodriguez",
      production_company: "Creative Ad Agency",
      genres: ["Commercial"],
      age_range: "25-45",
      gender_requirements: "Any",
      special_skills: ["Commercial Acting", "Tech Savvy"]
    },
    {
      title: "Background Extra - Hollywood Blockbuster",
      project_name: "Action Hero 3",
      role_type: "background" as const,
      description: "Background extras needed for crowd scenes in major action film.",
      requirements: "All ages welcome, no experience necessary",
      compensation_range: "$150 - $200 per day",
      location: "Los Angeles, CA",
      shoot_dates: "January - March 2024",
      casting_director: "Tom Wilson",
      production_company: "Major Studio",
      genres: ["Action", "Blockbuster"],
      age_range: "18-65",
      gender_requirements: "Any",
      special_skills: []
    },
    {
      title: "Voice Actor - Animated Feature",
      project_name: "Adventure Tales",
      role_type: "voiceover" as const,
      description: "Lead voice actor for animated family feature film.",
      requirements: "Voice acting experience, character voices, family-friendly content",
      compensation_range: "$20,000 - $40,000",
      location: "Remote/Los Angeles, CA",
      shoot_dates: "Recording sessions throughout 2024",
      casting_director: "Amy Foster",
      production_company: "Animation Studio",
      genres: ["Animation", "Family"],
      age_range: "Any",
      gender_requirements: "Any",
      special_skills: ["Voice Acting", "Character Voices", "Animation"]
    }
  ];

  const seedSampleData = async () => {
    setIsSeeding(true);
    try {
      console.log('Starting to seed sample casting opportunities...');
      
      const { data, error } = await supabase
        .from('casting_opportunities')
        .insert(sampleOpportunities)
        .select();

      if (error) {
        console.error('Error seeding data:', error);
        throw error;
      }

      console.log('Successfully seeded opportunities:', data);
      
      toast({
        title: "Sample Data Added!",
        description: `Added ${sampleOpportunities.length} sample casting opportunities to test the AI agent.`,
      });

      // Call the callback to refresh the opportunities list
      if (onDataSeeded) {
        onDataSeeded();
      }

    } catch (error) {
      console.error('Failed to seed sample data:', error);
      toast({
        title: "Error",
        description: "Failed to add sample opportunities. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Database className="h-5 w-5" />
          Sample Data Seeder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-white/70 mb-4">
          No casting opportunities found. Add some sample opportunities to test the AI agent functionality.
        </p>
        <Button
          onClick={seedSampleData}
          disabled={isSeeding}
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isSeeding ? (
            <>
              <Wand2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Sample Data...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Add Sample Opportunities
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SampleDataSeeder;
