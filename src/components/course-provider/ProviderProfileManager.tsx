
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { courseProviderService, type CourseProviderProfile } from "@/services/courseProviderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const profileSchema = z.object({
  company_name: z.string().optional(),
  website: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  bio: z.string().optional(),
  years_experience: z.number().min(0, "Years of experience must be 0 or greater").optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface ProviderProfileManagerProps {
  profile: CourseProviderProfile | null;
  onProfileUpdate: (profile: CourseProviderProfile) => void;
}

const ProviderProfileManager = ({ profile, onProfileUpdate }: ProviderProfileManagerProps) => {
  const { toast } = useToast();
  const [specialties, setSpecialties] = useState<string[]>(profile?.specialties || []);
  const [newSpecialty, setNewSpecialty] = useState("");
  const [loading, setLoading] = useState(false);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      company_name: profile?.company_name || "",
      website: profile?.website || "",
      bio: profile?.bio || "",
      years_experience: profile?.years_experience || undefined,
    }
  });

  const handleSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      const updatedProfile = await courseProviderService.createOrUpdateProviderProfile({
        ...data,
        specialties: specialties,
      });
      
      toast({
        title: "Success",
        description: "Profile updated successfully."
      });
      
      onProfileUpdate(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !specialties.includes(newSpecialty.trim())) {
      setSpecialties([...specialties, newSpecialty.trim()]);
      setNewSpecialty("");
    }
  };

  const removeSpecialty = (index: number) => {
    setSpecialties(specialties.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Provider Profile</h2>
        <p className="text-gray-300">Manage your course provider information and credentials</p>
      </div>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Course Provider Information
            {profile?.verified && (
              <Badge variant="default">Verified</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Company/Organization Name</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="Your company or organization"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Website</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white/10 border-white/20 text-white"
                          placeholder="https://yourwebsite.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Tell students about your background and expertise..."
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="10"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Specialties */}
              <div>
                <label className="text-white font-medium block mb-2">Specialties</label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialty}
                      onChange={(e) => setNewSpecialty(e.target.value)}
                      placeholder="Add specialty (e.g., Method Acting, Voice Training)..."
                      className="bg-white/10 border-white/20 text-white"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                    />
                    <Button type="button" onClick={addSpecialty}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {specialties.map((specialty, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {specialty}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeSpecialty(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {!profile?.verified && (
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <span className="text-yellow-400 font-bold">!</span>
              </div>
              <div>
                <h3 className="text-yellow-400 font-medium">Profile Verification</h3>
                <p className="text-yellow-300/80 text-sm">
                  Complete your profile to apply for verification. Verified providers get enhanced visibility and trust badges.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProviderProfileManager;
