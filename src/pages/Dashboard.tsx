import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { ShieldCheck, Loader2 } from 'lucide-react';
import api from '@/lib/api';

type Task = {
  _id: string;
  label: string;
  checked: boolean;
};

type Goal = {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  status: string;
  progress?: number;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [activeGoals, setActiveGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user || user.role === 'admin') {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/goals');
        const userGoals = data.map((goal: any) => ({
          ...goal,
          progress: calculateProgress(goal.tasks)
        }));
        setGoals(userGoals);

        // Calculate overall progress
        const totalProgress = userGoals.reduce((sum: number, goal: Goal) => sum + (goal.progress || 0), 0);
        const averageProgress = userGoals.length > 0 ? Math.round(totalProgress / userGoals.length) : 0;
        setOverallProgress(averageProgress);

        // Get active goals
        const active = userGoals.filter((goal: Goal) => goal.status === 'active');
        setActiveGoals(active);
      } catch (error) {
        console.error("Failed to fetch goals", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGoals();
  }, [user]);

  const calculateProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.checked).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  if (user?.role === 'admin') {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="px-4 py-2 bg-primary/10 rounded-full flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Administrator</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage user accounts and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Access the admin panel to manage users and review goal requests.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Goal Requests</CardTitle>
              <CardDescription>Review and manage learning goal requests</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Approve or reject learning goal requests from users.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Overview</CardTitle>
              <CardDescription>Monitor platform activity</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">View system statistics and user engagement metrics.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Progress</CardTitle>
            <CardDescription>Track your learning journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallProgress}%</div>
            <p className="text-muted-foreground">
              {overallProgress === 0
                ? "Start by adding some learning goals!"
                : overallProgress < 50
                  ? "Keep going! You're making progress."
                  : "Great job! You're more than halfway there!"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Goals</CardTitle>
            <CardDescription>Your active learning goals</CardDescription>
          </CardHeader>
          <CardContent>
            {activeGoals.length > 0 ? (
              <ul className="space-y-2">
                {activeGoals.map(goal => (
                  <li key={goal._id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                      <span>{goal.title}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">{goal.progress}%</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No active goals. Add some goals to get started!</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {goals.some(goal => goal.tasks.some(task => task.checked)) ? (
              <ul className="space-y-2">
                {goals
                  .flatMap(goal =>
                    goal.tasks
                      .filter(task => task.checked)
                      .map(task => ({
                        goalTitle: goal.title,
                        taskLabel: task.label
                      }))
                  )
                  .slice(0, 3)
                  .map((item, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-sm">
                        Completed "{item.taskLabel}" in {item.goalTitle}
                      </span>
                    </li>
                  ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">No completed tasks yet. Start checking off your tasks!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
