
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { Course } from "@/services/courseProviderService";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty_level: z.string().optional(),
  duration_minutes: z.number().min(1, "Duration must be at least 1 minute").optional(),
  price_tier: z.string().optional(),
  video_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  materials_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface CourseFormProps {
  course?: Course;
  onSubmit: (data: Partial<Course>) => void;
}

const CourseForm = ({ course, onSubmit }: CourseFormProps) => {
  const [learningObjectives, setLearningObjectives] = useState<string[]>(
    course?.learning_objectives || []
  );
  const [prerequisites, setPrerequisites] = useState<string[]>(
    course?.prerequisites || []
  );
  const [newObjective, setNewObjective] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course?.title || "",
      description: course?.description || "",
      category: course?.category || "",
      difficulty_level: course?.difficulty_level || "",
      duration_minutes: course?.duration_minutes || undefined,
      price_tier: course?.price_tier || "free",
      video_url: course?.video_url || "",
      materials_url: course?.materials_url || "",
    }
  });

  const handleSubmit = (data: CourseFormData) => {
    onSubmit({
      ...data,
      learning_objectives: learningObjectives,
      prerequisites: prerequisites,
    });
  };

  const addLearningObjective = () => {
    if (newObjective.trim()) {
      setLearningObjectives([...learningObjectives, newObjective.trim()]);
      setNewObjective("");
    }
  };

  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setPrerequisites([...prerequisites, newPrerequisite.trim()]);
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index: number) => {
    setPrerequisites(prerequisites.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">
          {course ? "Edit Course" : "Create New Course"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Course Title</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Enter course title"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="acting-fundamentals">Acting Fundamentals</SelectItem>
                        <SelectItem value="voice-speech">Voice & Speech</SelectItem>
                        <SelectItem value="movement">Movement & Dance</SelectItem>
                        <SelectItem value="improvisation">Improvisation</SelectItem>
                        <SelectItem value="script-analysis">Script Analysis</SelectItem>
                        <SelectItem value="auditioning">Auditioning</SelectItem>
                        <SelectItem value="business">Business of Acting</SelectItem>
                        <SelectItem value="specialized">Specialized Techniques</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Describe your course..."
                      rows={4}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="difficulty_level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Difficulty Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                        <SelectItem value="all-levels">All Levels</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        type="number"
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="60"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_tier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Price Tier</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select price" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="basic">Basic ($19)</SelectItem>
                        <SelectItem value="standard">Standard ($49)</SelectItem>
                        <SelectItem value="premium">Premium ($99)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="video_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Video URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="materials_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Materials URL</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="https://drive.google.com/..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Learning Objectives */}
            <div>
              <label className="text-white font-medium block mb-2">Learning Objectives</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add learning objective..."
                    className="bg-white/10 border-white/20 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLearningObjective())}
                  />
                  <Button type="button" onClick={addLearningObjective}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {learningObjectives.map((objective, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {objective}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeLearningObjective(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            <div>
              <label className="text-white font-medium block mb-2">Prerequisites</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Add prerequisite..."
                    className="bg-white/10 border-white/20 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPrerequisite())}
                  />
                  <Button type="button" onClick={addPrerequisite}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {prerequisites.map((prerequisite, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {prerequisite}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removePrerequisite(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">
                {course ? "Update Course" : "Create Course"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
