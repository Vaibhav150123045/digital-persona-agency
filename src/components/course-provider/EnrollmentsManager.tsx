
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { courseProviderService, type CourseEnrollment } from "@/services/courseProviderService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, TrendingUp } from "lucide-react";

const EnrollmentsManager = () => {
  const { toast } = useToast();
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      const enrollmentsData = await courseProviderService.getCourseEnrollments();
      setEnrollments(enrollmentsData);
    } catch (error) {
      console.error('Error loading enrollments:', error);
      toast({
        title: "Error",
        description: "Failed to load enrollments.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-green-400";
    if (progress >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="text-white">Loading enrollments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Course Enrollments</h2>
        <p className="text-gray-300">Track student progress and engagement</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Enrollments</p>
                <p className="text-2xl font-bold text-white mt-1">{enrollments.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Completed</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {enrollments.filter(e => e.completed_at).length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Avg Progress</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {enrollments.length > 0 
                    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress_percentage, 0) / enrollments.length)
                    : 0}%
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollments List */}
      {enrollments.length === 0 ? (
        <Card className="bg-white/5 border-white/10">
          <CardContent className="text-center py-12">
            <p className="text-gray-300">No enrollments yet. Students will appear here once they enroll in your courses.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((enrollment) => (
            <Card key={enrollment.id} className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {enrollment.course?.title || 'Unknown Course'}
                      </h3>
                      {enrollment.completed_at && (
                        <Badge variant="default">Completed</Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400">
                      <span>Enrolled: {new Date(enrollment.enrolled_at).toLocaleDateString()}</span>
                      {enrollment.completed_at && (
                        <span>Completed: {new Date(enrollment.completed_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-lg font-semibold ${getProgressColor(enrollment.progress_percentage)}`}>
                      {enrollment.progress_percentage}%
                    </div>
                    <div className="text-sm text-gray-400">Progress</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${enrollment.progress_percentage}%` }}
                    />
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

export default EnrollmentsManager;
