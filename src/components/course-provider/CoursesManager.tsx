
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { courseProviderService, type Course } from "@/services/courseProviderService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Eye, Archive, CheckCircle } from "lucide-react";
import CourseForm from "./CourseForm";

const CoursesManager = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const coursesData = await courseProviderService.getCourses();
      setCourses(coursesData);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData: Partial<Course>) => {
    try {
      await courseProviderService.createCourse(courseData);
      toast({
        title: "Success",
        description: "Course created successfully."
      });
      setShowCreateForm(false);
      loadCourses();
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateCourse = async (courseData: Partial<Course>) => {
    if (!editingCourse) return;

    try {
      await courseProviderService.updateCourse(editingCourse.id, courseData);
      toast({
        title: "Success",
        description: "Course updated successfully."
      });
      setEditingCourse(null);
      loadCourses();
    } catch (error) {
      console.error('Error updating course:', error);
      toast({
        title: "Error",
        description: "Failed to update course.",
        variant: "destructive"
      });
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await courseProviderService.publishCourse(courseId);
      toast({
        title: "Success",
        description: "Course published successfully."
      });
      loadCourses();
    } catch (error) {
      console.error('Error publishing course:', error);
      toast({
        title: "Error",
        description: "Failed to publish course.",
        variant: "destructive"
      });
    }
  };

  const handleArchiveCourse = async (courseId: string) => {
    try {
      await courseProviderService.archiveCourse(courseId);
      toast({
        title: "Success",
        description: "Course archived successfully."
      });
      loadCourses();
    } catch (error) {
      console.error('Error archiving course:', error);
      toast({
        title: "Error",
        description: "Failed to archive course.",
        variant: "destructive"
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'published': return 'default';
      case 'draft': return 'secondary';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Create New Course</h2>
          <Button 
            variant="outline" 
            onClick={() => setShowCreateForm(false)}
          >
            Cancel
          </Button>
        </div>
        <CourseForm onSubmit={handleCreateCourse} />
      </div>
    );
  }

  if (editingCourse) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Edit Course</h2>
          <Button 
            variant="outline" 
            onClick={() => setEditingCourse(null)}
          >
            Cancel
          </Button>
        </div>
        <CourseForm course={editingCourse} onSubmit={handleUpdateCourse} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Courses</h2>
          <p className="text-gray-300">Manage your course content and publications</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Course
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="text-white">Loading courses...</div>
        </div>
      ) : courses.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="text-center py-12">
            <p className="text-gray-300 mb-4">You haven't created any courses yet.</p>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {courses.map((course) => (
            <Card key={course.id} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{course.title}</h3>
                      <Badge variant={getStatusBadgeVariant(course.status)}>
                        {course.status}
                      </Badge>
                    </div>
                    
                    {course.description && (
                      <p className="text-gray-300 mb-3 line-clamp-2">{course.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      {course.category && (
                        <span>Category: {course.category}</span>
                      )}
                      {course.difficulty_level && (
                        <span>Level: {course.difficulty_level}</span>
                      )}
                      {course.duration_minutes && (
                        <span>Duration: {course.duration_minutes} min</span>
                      )}
                      <span>Price: {course.price_tier}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingCourse(course)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    {course.status === 'draft' && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handlePublishCourse(course.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                    
                    {course.status === 'published' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleArchiveCourse(course.id)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(course.created_at).toLocaleDateString()}
                  {course.published_at && (
                    <span className="ml-4">
                      Published: {new Date(course.published_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CoursesManager;
