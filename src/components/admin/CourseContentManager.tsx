
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { adminService, type AdminCourseContent } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, CheckCircle, Clock } from "lucide-react";

interface CourseContentManagerProps {
  onStatsUpdate: () => void;
}

const CourseContentManager = ({ onStatsUpdate }: CourseContentManagerProps) => {
  const { toast } = useToast();
  const [draftContent, setDraftContent] = useState<AdminCourseContent[]>([]);
  const [publishedContent, setPublishedContent] = useState<AdminCourseContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'draft' | 'published'>('draft');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [draft, published] = await Promise.all([
        adminService.getDraftCourseContent(),
        adminService.getPublishedCourseContent()
      ]);
      setDraftContent(draft);
      setPublishedContent(published);
      onStatsUpdate();
    } catch (error) {
      console.error('Error loading course content:', error);
      toast({
        title: "Error",
        description: "Failed to load course content.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await adminService.publishCourseContent(id);
      toast({
        title: "Course Published",
        description: "Course is now available to users.",
      });
      loadContent();
    } catch (error) {
      console.error('Error publishing course:', error);
      toast({
        title: "Error",
        description: "Failed to publish course.",
        variant: "destructive"
      });
    }
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return 'Not specified';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const renderCourseCard = (course: AdminCourseContent, isDraft: boolean) => (
    <Card key={course.id} className="bg-gray-800/50 border-gray-700/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white">{course.title}</CardTitle>
            {course.instructor && (
              <p className="text-gray-300 mt-1">by {course.instructor}</p>
            )}
          </div>
          <div className="flex gap-2">
            {course.difficulty_level && (
              <Badge variant="outline">
                {course.difficulty_level}
              </Badge>
            )}
            {course.price_tier && (
              <Badge variant={course.price_tier === 'free' ? 'secondary' : 'default'}>
                {course.price_tier}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Duration:</span>
              <p className="text-white flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(course.duration_minutes)}
              </p>
            </div>
            {course.category && (
              <div>
                <span className="text-gray-400">Category:</span>
                <p className="text-white">{course.category}</p>
              </div>
            )}
            <div>
              <span className="text-gray-400">Status:</span>
              <p className="text-white">{isDraft ? 'Draft' : 'Published'}</p>
            </div>
          </div>

          {course.description && (
            <div>
              <span className="text-gray-400 text-sm">Description:</span>
              <p className="text-gray-300 mt-1">{course.description}</p>
            </div>
          )}

          {course.learning_objectives && course.learning_objectives.length > 0 && (
            <div>
              <span className="text-gray-400 text-sm">Learning Objectives:</span>
              <ul className="text-gray-300 mt-1 list-disc list-inside">
                {course.learning_objectives.slice(0, 3).map((objective, index) => (
                  <li key={index} className="text-sm">{objective}</li>
                ))}
                {course.learning_objectives.length > 3 && (
                  <li className="text-sm text-gray-400">
                    +{course.learning_objectives.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {isDraft && (
              <Button
                variant="outline"
                size="sm"
                className="border-green-500/50 text-green-400 hover:bg-green-500/10"
                onClick={() => handlePublish(course.id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Publish
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">Course Content Management</h2>
          <p className="text-gray-300">Create and manage educational courses</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
          <Plus className="h-4 w-4 mr-2" />
          Add Course
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4">
        <Button
          variant={activeTab === 'draft' ? 'default' : 'outline'}
          onClick={() => setActiveTab('draft')}
        >
          Draft Courses ({draftContent.length})
        </Button>
        <Button
          variant={activeTab === 'published' ? 'default' : 'outline'}
          onClick={() => setActiveTab('published')}
        >
          Published Courses ({publishedContent.length})
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-white">Loading courses...</div>
        </div>
      ) : (
        <div className="grid gap-6">
          {activeTab === 'draft' ? (
            draftContent.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="text-center py-8">
                  <p className="text-gray-300">No draft courses found.</p>
                </CardContent>
              </Card>
            ) : (
              draftContent.map(course => renderCourseCard(course, true))
            )
          ) : (
            publishedContent.length === 0 ? (
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardContent className="text-center py-8">
                  <p className="text-gray-300">No published courses found.</p>
                </CardContent>
              </Card>
            ) : (
              publishedContent.map(course => renderCourseCard(course, false))
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CourseContentManager;
