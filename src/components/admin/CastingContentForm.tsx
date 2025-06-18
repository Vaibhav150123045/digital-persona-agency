
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminService, type AdminCastingContent } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";

interface CastingContentFormProps {
  editingContent?: AdminCastingContent | null;
  onClose: () => void;
}

const roleTypes = [
  "lead", "supporting", "background", "featured", "commercial", 
  "voiceover", "theater", "film", "tv", "web"
];

const CastingContentForm = ({ editingContent, onClose }: CastingContentFormProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    project_name: "",
    role_type: "lead" as any,
    description: "",
    requirements: "",
    compensation_range: "",
    location: "",
    shoot_dates: "",
    application_deadline: "",
    casting_director: "",
    production_company: "",
    age_range: "",
    gender_requirements: "",
    ethnicity_requirements: "",
    genres: [] as string[],
    special_skills: [] as string[]
  });

  useEffect(() => {
    if (editingContent) {
      setFormData({
        title: editingContent.title || "",
        project_name: editingContent.project_name || "",
        role_type: editingContent.role_type,
        description: editingContent.description || "",
        requirements: editingContent.requirements || "",
        compensation_range: editingContent.compensation_range || "",
        location: editingContent.location || "",
        shoot_dates: editingContent.shoot_dates || "",
        application_deadline: editingContent.application_deadline ? 
          new Date(editingContent.application_deadline).toISOString().slice(0, 16) : "",
        casting_director: editingContent.casting_director || "",
        production_company: editingContent.production_company || "",
        age_range: editingContent.age_range || "",
        gender_requirements: editingContent.gender_requirements || "",
        ethnicity_requirements: editingContent.ethnicity_requirements || "",
        genres: editingContent.genres || [],
        special_skills: editingContent.special_skills || []
      });
    }
  }, [editingContent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        application_deadline: formData.application_deadline ? 
          new Date(formData.application_deadline).toISOString() : undefined,
        status: "draft"
      };

      if (editingContent) {
        await adminService.updateCastingContent(editingContent.id, submitData);
        toast({
          title: "Content Updated",
          description: "Casting content has been updated successfully."
        });
      } else {
        await adminService.createCastingContent(submitData);
        toast({
          title: "Content Created",
          description: "New casting content has been created as draft."
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving content:', error);
      toast({
        title: "Error",
        description: "Failed to save casting content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleArrayFieldChange = (field: 'genres' | 'special_skills', value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to List
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-white">
            {editingContent ? 'Edit' : 'Create'} Casting Opportunity
          </h2>
          <p className="text-gray-300">
            {editingContent ? 'Update existing' : 'Add new'} casting content
          </p>
        </div>
      </div>

      <Card className="bg-gray-800/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Content Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Project Name</Label>
                <Input
                  value={formData.project_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, project_name: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Role Type *</Label>
                <Select
                  value={formData.role_type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role_type: value as any }))}
                >
                  <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roleTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Location</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Compensation Range</Label>
                <Input
                  value={formData.compensation_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, compensation_range: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="e.g., $500-$1000/day"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Application Deadline</Label>
                <Input
                  type="datetime-local"
                  value={formData.application_deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, application_deadline: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Casting Director</Label>
                <Input
                  value={formData.casting_director}
                  onChange={(e) => setFormData(prev => ({ ...prev, casting_director: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Production Company</Label>
                <Input
                  value={formData.production_company}
                  onChange={(e) => setFormData(prev => ({ ...prev, production_company: e.target.value }))}
                  className="bg-gray-700/50 border-gray-600 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Requirements</Label>
              <Textarea
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                className="bg-gray-700/50 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-300">Genres (comma-separated)</Label>
                <Input
                  value={formData.genres.join(', ')}
                  onChange={(e) => handleArrayFieldChange('genres', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Drama, Comedy, Action"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Special Skills (comma-separated)</Label>
                <Input
                  value={formData.special_skills.join(', ')}
                  onChange={(e) => handleArrayFieldChange('special_skills', e.target.value)}
                  className="bg-gray-700/50 border-gray-600 text-white"
                  placeholder="Martial Arts, Singing, Dancing"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : editingContent ? 'Update' : 'Create'} Draft
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CastingContentForm;
