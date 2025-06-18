
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import type { UserSubmissionPreferences, RoleType } from "@/types/casting";

interface PreferencesFormProps {
  preferences: UserSubmissionPreferences | null;
  onSave: (preferences: Partial<UserSubmissionPreferences>) => Promise<void>;
  saving: boolean;
}

const roleTypes: { value: RoleType; label: string }[] = [
  { value: "lead", label: "Lead" },
  { value: "supporting", label: "Supporting" },
  { value: "background", label: "Background" },
  { value: "featured", label: "Featured" },
  { value: "commercial", label: "Commercial" },
  { value: "voiceover", label: "Voiceover" },
  { value: "theater", label: "Theater" },
  { value: "film", label: "Film" },
  { value: "tv", label: "TV" },
  { value: "web", label: "Web" }
];

const genres = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mystery", 
  "Romance", "Sci-Fi", "Thriller", "Documentary", "Musical", "Animation"
];

const PreferencesForm = ({ preferences, onSave, saving }: PreferencesFormProps) => {
  const form = useForm({
    defaultValues: {
      auto_submit_enabled: preferences?.auto_submit_enabled || false,
      min_match_score: preferences?.min_match_score || 70,
      preferred_role_types: preferences?.preferred_role_types || [],
      preferred_genres: preferences?.preferred_genres || [],
      max_travel_distance: preferences?.max_travel_distance || 50,
      compensation_minimum: preferences?.compensation_minimum || 0,
      exclude_adult_content: preferences?.exclude_adult_content ?? true,
      notification_preferences: {
        email: preferences?.notification_preferences?.email ?? true,
        in_app: preferences?.notification_preferences?.in_app ?? true,
        callback_reminders: preferences?.notification_preferences?.callback_reminders ?? true,
        ...preferences?.notification_preferences
      }
    }
  });

  useEffect(() => {
    if (preferences) {
      form.reset({
        auto_submit_enabled: preferences.auto_submit_enabled || false,
        min_match_score: preferences.min_match_score || 70,
        preferred_role_types: preferences.preferred_role_types || [],
        preferred_genres: preferences.preferred_genres || [],
        max_travel_distance: preferences.max_travel_distance || 50,
        compensation_minimum: preferences.compensation_minimum || 0,
        exclude_adult_content: preferences.exclude_adult_content ?? true,
        notification_preferences: {
          email: preferences.notification_preferences?.email ?? true,
          in_app: preferences.notification_preferences?.in_app ?? true,
          callback_reminders: preferences.notification_preferences?.callback_reminders ?? true,
          ...preferences.notification_preferences
        }
      });
    }
  }, [preferences, form]);

  const onSubmit = async (data: any) => {
    await onSave(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Auto-Submission Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Auto-Submission Settings</h3>
          
          <FormField
            control={form.control}
            name="auto_submit_enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Enable Auto-Submission</FormLabel>
                  <FormDescription>
                    Automatically submit to opportunities that match your criteria
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="min_match_score"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Match Score: {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    min={50}
                    max={100}
                    step={5}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0])}
                    className="w-full"
                  />
                </FormControl>
                <FormDescription>
                  Only auto-submit to opportunities with this match score or higher
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Role Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Role Preferences</h3>
          
          <FormField
            control={form.control}
            name="preferred_role_types"
            render={() => (
              <FormItem>
                <FormLabel>Preferred Role Types</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {roleTypes.map((roleType) => (
                    <FormField
                      key={roleType.value}
                      control={form.control}
                      name="preferred_role_types"
                      render={({ field }) => (
                        <FormItem key={roleType.value} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(roleType.value)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), roleType.value]
                                  : field.value?.filter((value) => value !== roleType.value);
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {roleType.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="preferred_genres"
            render={() => (
              <FormItem>
                <FormLabel>Preferred Genres</FormLabel>
                <div className="grid grid-cols-3 gap-2">
                  {genres.map((genre) => (
                    <FormField
                      key={genre}
                      control={form.control}
                      name="preferred_genres"
                      render={({ field }) => (
                        <FormItem key={genre} className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(genre)}
                              onCheckedChange={(checked) => {
                                const updatedValue = checked
                                  ? [...(field.value || []), genre]
                                  : field.value?.filter((value) => value !== genre);
                                field.onChange(updatedValue);
                              }}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            {genre}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Location & Compensation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Location & Compensation</h3>
          
          <FormField
            control={form.control}
            name="max_travel_distance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Travel Distance</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Miles" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Maximum distance you're willing to travel for opportunities (miles)
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compensation_minimum"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Compensation</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="$0" 
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Minimum daily rate you'll accept (leave 0 for unpaid/TBD roles)
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="exclude_adult_content"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Exclude Adult Content</FormLabel>
                  <FormDescription>
                    Filter out adult/mature content opportunities
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Separator />

        {/* Notification Preferences */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Notification Preferences</h3>
          
          <FormField
            control={form.control}
            name="notification_preferences.email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Email Notifications</FormLabel>
                  <FormDescription>
                    Receive email notifications for new opportunities and updates
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notification_preferences.in_app"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">In-App Notifications</FormLabel>
                  <FormDescription>
                    Show notifications within the application
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notification_preferences.callback_reminders"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Callback Reminders</FormLabel>
                  <FormDescription>
                    Remind you about upcoming callbacks and auditions
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="submit" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Preferences
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PreferencesForm;
