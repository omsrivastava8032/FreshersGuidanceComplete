import { useEffect, useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Plus, ExternalLink, BookOpen, CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import api from "@/lib/api";

type Goal = {
  _id: string;
  title: string;
  category: string;
};

type TrackedCourse = {
  _id: string;
  title: string;
  provider: string;
  status: 'in_progress' | 'completed';
  progress?: number;
  startedAt: string;
  completedAt?: string;
};

type RecommendedCourse = {
  id: number;
  title: string;
  description: string;
  duration: string;
  instructor: string;
  rating: number;
  reviews: number;
  url: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
};

const Courses = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [myCourses, setMyCourses] = useState<TrackedCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingId, setTrackingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [goalsRes, coursesRes] = await Promise.all([
          api.get('/goals'),
          api.get('/courses')
        ]);
        setGoals(goalsRes.data);
        setMyCourses(coursesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Failed to load courses data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTrackCourse = async (course: RecommendedCourse) => {
    setTrackingId(course.id);
    try {
      // Check if already tracked
      if (myCourses.some(c => c.title === course.title)) {
        toast.info("You are already tracking this course");
        return;
      }

      const { data } = await api.post('/courses', {
        title: course.title,
        provider: course.instructor,
        status: 'in_progress',
        progress: 0
      });

      setMyCourses([...myCourses, data]);
      toast.success("Course added to your learning list");
    } catch (error) {
      console.error("Failed to track course", error);
      toast.error("Failed to add course");
    } finally {
      setTrackingId(null);
    }
  };

  const updateCourseProgress = async (courseId: string, newProgress: number) => {
    try {
      const { data } = await api.patch(`/courses/${courseId}`, {
        progress: newProgress,
        status: newProgress === 100 ? 'completed' : 'in_progress'
      });

      setMyCourses(myCourses.map(c => c._id === courseId ? data : c));
      if (newProgress === 100) {
        toast.success("Course completed! 🎉");
      }
    } catch (error) {
      console.error("Failed to update progress", error);
      toast.error("Failed to update progress");
    }
  };

  const deleteCourse = async (courseId: string) => {
    try {
      await api.delete(`/courses/${courseId}`);
      setMyCourses(myCourses.filter(c => c._id !== courseId));
      toast.success("Course removed");
    } catch (error) {
      console.error("Failed to delete course", error);
      toast.error("Failed to remove course");
    }
  };

  // Complete course data with proper category matching
  const recommendedCourses: RecommendedCourse[] = [
    {
      id: 1,
      title: "The Complete Modern JavaScript Course",
      description: "Master ES6+ features and modern JS concepts",
      duration: "6 weeks",
      instructor: "Packt Instructors",
      rating: 4.7,
      reviews: 3560,
      url: "https://www.coursera.org/specializations/packt-the-complete-modern-javascript-course-with-es6",
      level: "beginner",
      category: "Web Development"
    },
    {
      id: 2,
      title: "Complete ReactJS Masterclass",
      description: "Build modern web applications with React from scratch",
      duration: "8 weeks",
      instructor: "Eduonix Team",
      rating: 4.6,
      reviews: 8924,
      url: "https://www.udemy.com/course/complete-reactjs-masterclass/",
      level: "intermediate",
      category: "Web Development"
    },
    {
      id: 3,
      title: "Machine Learning Specialization",
      description: "Introduction to ML concepts and algorithms",
      duration: "12 weeks",
      instructor: "Andrew Ng",
      rating: 4.9,
      reviews: 45230,
      url: "https://www.coursera.org/specializations/machine-learning-introduction",
      level: "advanced",
      category: "Data Science"
    },
    {
      id: 4,
      title: "Data Visualization with Microsoft",
      description: "Master data presentation techniques",
      duration: "6 weeks",
      instructor: "Microsoft Experts",
      rating: 4.5,
      reviews: 8912,
      url: "https://www.coursera.org/professional-certificates/microsoft-data-visualization",
      level: "intermediate",
      category: "Data Science"
    },
    {
      id: 5,
      title: "Google Cybersecurity Professional Certificate",
      description: "Launch your career in cybersecurity",
      duration: "6 months",
      instructor: "Google",
      rating: 4.8,
      reviews: 14567,
      url: "https://www.coursera.org/professional-certificates/google-cybersecurity",
      level: "beginner",
      category: "Cybersecurity"
    },
    {
      id: 6,
      title: "Ethical Hacking Fundamentals",
      description: "Learn penetration testing and vulnerability assessment",
      duration: "8 weeks",
      instructor: "EC-Council",
      rating: 4.7,
      reviews: 9214,
      url: "https://www.eccouncil.org/programs/certified-ethical-hacker-ceh/",
      level: "intermediate",
      category: "Cybersecurity"
    },
    {
      id: 7,
      title: "Android Development with Kotlin",
      description: "Build professional Android apps using Kotlin",
      duration: "9 weeks",
      instructor: "Google Developers",
      rating: 4.8,
      reviews: 23456,
      url: "https://www.udacity.com/course/android-kotlin-developer-nanodegree--nd940",
      level: "intermediate",
      category: "Android App Development"
    },
    {
      id: 8,
      title: "Advanced Android Architecture",
      description: "Master MVVM, Clean Architecture, and testing",
      duration: "6 weeks",
      instructor: "Android Team",
      rating: 4.9,
      reviews: 6789,
      url: "https://developer.android.com/courses",
      level: "advanced",
      category: "Android App Development"
    },
    {
      id: 9,
      title: "AWS Fundamentals",
      description: "Master core AWS services and cloud concepts",
      duration: "6 weeks",
      instructor: "Amazon Web Services",
      rating: 4.8,
      reviews: 23456,
      url: "https://www.coursera.org/specializations/aws-fundamentals",
      level: "intermediate",
      category: "Cloud Computing"
    },
    {
      id: 10,
      title: "Azure Cloud Architecture",
      description: "Design and implement cloud solutions",
      duration: "8 weeks",
      instructor: "Microsoft Learn",
      rating: 4.7,
      reviews: 15632,
      url: "https://learn.microsoft.com/en-us/training/azure/",
      level: "advanced",
      category: "Cloud Computing"
    }
  ];

  const filteredCourses = recommendedCourses.filter(course =>
    goals.some(goal => goal.category === course.category)
  );

  const getBadgeVariant = (level: RecommendedCourse['level']) => {
    switch (level) {
      case 'beginner': return undefined;
      case 'intermediate': return 'outline';
      case 'advanced': return 'secondary';
      default: return undefined;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-10">
      {/* My Active Courses Section */}
      {myCourses.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            My Learning Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCourses.map(course => (
              <Card key={course._id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    {course.status === 'completed' && (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <CardDescription>{course.provider}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <Progress value={course.progress || 0} className="h-2" />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCourse(course._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                  {course.status !== 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCourseProgress(course._id, Math.min((course.progress || 0) + 25, 100))}
                    >
                      Update Progress
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Recommended Courses Section */}
      <section>
        <h1 className="text-3xl font-bold mb-6">Recommended Courses</h1>

        {goals.length === 0 ? (
          <div className="mb-8 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">No learning goals selected</h2>
            <p className="mb-4">Add learning goals in the Goals section to see relevant course recommendations.</p>
            <Button asChild>
              <a href="/goals" className="hover:no-underline">
                Manage Learning Goals
              </a>
            </Button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="mb-8 p-6 bg-muted rounded-lg">
            <h2 className="text-xl font-semibold mb-4">No courses available for your current goals</h2>
            <p className="mb-4">We'll add more courses for these categories soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const isTracked = myCourses.some(c => c.title === course.title);
              return (
                <Card key={course.id} className="hover:shadow-md transition-shadow flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      <Badge variant={getBadgeVariant(course.level)}>
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        <strong>Duration:</strong> {course.duration}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        <strong>Instructor:</strong> {course.instructor}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, star) => (
                            <svg
                              key={star}
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-muted-foreground">
                          {course.rating} ({course.reviews.toLocaleString()} reviews)
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <a
                        href={course.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:no-underline flex items-center justify-center gap-2"
                      >
                        View <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                    <Button
                      className="flex-1"
                      variant={isTracked ? "secondary" : "default"}
                      disabled={isTracked || trackingId === course.id}
                      onClick={() => handleTrackCourse(course)}
                    >
                      {trackingId === course.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isTracked ? (
                        <>Tracked <CheckCircle2 className="w-4 h-4 ml-2" /></>
                      ) : (
                        <>Track <Plus className="w-4 h-4 ml-2" /></>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Courses;