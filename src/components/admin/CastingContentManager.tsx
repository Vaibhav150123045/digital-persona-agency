
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminService, type AdminCastingContent } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, CheckCircle } from "lucide-react";
import CastingContentForm from "./CastingContentForm";

interface CastingContentManagerProps {
  onStatsUpdate: () => void;
}

const CastingContentManager = ({ onStatsUpdate }: CastingContentManagerProps) => {
  const { toast } = useToast();
  const [draftContent, setDraftContent] = useState<AdminCastingContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState<AdminCastingContent | null>(null);

  useEffect(() => {
    loadDraftContent();
  }, []);

  const loadDraftContent = async () => {
    try {
      const content = await adminService.getDraftCastingContent();
      setDraftContent(content);
      onStatsUpdate();
    } catch (error) {
      console.error('Error loading draft content:', error);
      toast({
        title: "Error",
        description: "Failed to load draft casting content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await adminService.publishCastingContent(id);
      toast({
        title: "Content Published",
        description: "Casting opportunity is now live for all users.",
      });
      loadDraftContent();
    } catch (error) {
      console.error('Error publishing content:', error);
      toast({
        title: "Error",
        description: "Failed to publish casting content.",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (content: AdminCastingContent) => {
    setEditingContent(content);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingContent(null);
    loadDraftContent();
  };

  if (showForm) {
    return (
      <CastingContentForm
        editingContent={editingContent}
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Casting Content Management</h2>
          <p className="text-gray-300">Create and manage casting opportunities</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Casting Opportunity
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-white">Loading content...</div>
        </div>
      ) : draftContent.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700/50">
          <CardContent className="text-center py-8">
            <p className="text-gray-300">No draft casting content found.</p>
            <Button 
              onClick={() => setShowForm(true)}
              className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Create Your First Casting Opportunity
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {draftContent.map((content) => (
            <Card key={content.id} className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white">{content.title}</CardTitle>
                    {content.project_name && (
                      <p className="text-gray-300 mt-1">{content.project_name}</p>
                    )}
                  </div>
                  <Badge variant="secondary">{content.role_type}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {content.location && (
                      <div>
                        <span className="text-gray-400">Location:</span>
                        <p className="text-white">{content.location}</p>
                      </div>
                    )}
                    {content.compensation_range && (
                      <div>
                        <span className="text-gray-400">Compensation:</span>
                        <p className="text-white">{content.compensation_range}</p>
                      </div>
                    )}
                    {content.casting_director && (
                      <div>
                        <span className="text-gray-400">Casting Director:</span>
                        <p className="text-white">{content.casting_director}</p>
                      </div>
                    )}
                    {content.application_deadline && (
                      <div>
                        <span className="text-gray-400">Deadline:</span>
                        <p className="text-white">
                          {new Date(content.application_deadline).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {content.description && (
                    <div>
                      <span className="text-gray-400 text-sm">Description:</span>
                      <p className="text-gray-300 mt-1">{content.description}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(content)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                      onClick={() => handlePublish(content.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Publish
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CastingContentManager;
