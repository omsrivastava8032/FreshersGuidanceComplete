import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Trash2, Clock, CheckCircle2, XCircle, Share2, Bell, Filter, Search, CalendarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

type Task = {
  _id?: string;
  label: string;
  checked: boolean;
};

type Goal = {
  _id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: string;
  progress?: number;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  category: string;
  targetDate?: string;
  priority: 'low' | 'medium' | 'high';
};

const predefinedGoals = [
  {
    title: "Web Development",
    description: "Become a full-stack web developer",
    tasks: [
      { label: "Learn HTML & CSS basics", checked: false },
      { label: "Complete JavaScript fundamentals", checked: false },
      { label: "Build a React project", checked: false },
      { label: "Learn Node.js and Express", checked: false },
    ],
    category: "Web Development",
    priority: "medium" as const,
    status: "active" as const
  },
  {
    title: "Data Science",
    description: "Master data analysis and machine learning",
    tasks: [
      { label: "Learn Python basics", checked: false },
      { label: "Complete data visualization course", checked: false },
      { label: "Study statistics fundamentals", checked: false },
      { label: "Build ML models with scikit-learn", checked: false },
    ],
    category: "Data Science",
    priority: "medium" as const,
    status: "active" as const
  },
  {
    title: "Cybersecurity",
    description: "Master cybersecurity fundamentals and practices",
    tasks: [
      { label: "Study network security basics", checked: false },
      { label: "Learn encryption techniques", checked: false },
      { label: "Understand ethical hacking", checked: false },
      { label: "Practice vulnerability assessment", checked: false },
    ],
    category: "Cybersecurity",
    priority: "medium" as const,
    status: "active" as const
  },
  {
    title: "Android App Development",
    description: "Build professional Android applications",
    tasks: [
      { label: "Learn Kotlin fundamentals", checked: false },
      { label: "Understand Android Studio", checked: false },
      { label: "Study Material Design principles", checked: false },
      { label: "Publish a sample app", checked: false },
    ],
    category: "Mobile Development",
    priority: "medium" as const,
    status: "active" as const
  },
  {
    title: "Cloud Computing",
    description: "Master cloud infrastructure and services",
    tasks: [
      { label: "Understand cloud service models", checked: false },
      { label: "Learn AWS/Azure fundamentals", checked: false },
      { label: "Study containerization", checked: false },
      { label: "Deploy a cloud application", checked: false },
    ],
    category: "Cloud Computing",
    priority: "medium" as const,
    status: "active" as const
  },
];

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: '',
    targetDate: new Date(),
    priority: 'medium'
  });
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchGoals = async () => {
    try {
      const { data } = await api.get('/goals');
      setGoals(data.map((goal: any) => ({
        ...goal,
        progress: calculateProgress(goal.tasks)
      })));
    } catch (error) {
      console.error("Failed to fetch goals", error);
      toast.error("Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const calculateProgress = (tasks: Task[]) => {
    if (!tasks || tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.checked).length;
    return (completed / tasks.length) * 100 || 0;
  };

  const toggleTask = async (goalId: string, taskId: string | undefined) => {
    if (!taskId) return;

    const goal = goals.find(g => g._id === goalId);
    if (!goal) return;

    const updatedTasks = goal.tasks.map(task =>
      task._id === taskId ? { ...task, checked: !task.checked } : task
    );

    // Optimistic update
    const updatedGoals = goals.map(g =>
      g._id === goalId ? { ...g, tasks: updatedTasks, progress: calculateProgress(updatedTasks) } : g
    );
    setGoals(updatedGoals);

    try {
      await api.patch(`/goals/${goalId}`, { tasks: updatedTasks });
    } catch (error) {
      console.error("Failed to update task", error);
      toast.error("Failed to update task");
      // Revert on error
      fetchGoals();
    }
  };

  const addPredefinedGoal = async (template: any) => {
    try {
      const { data } = await api.post('/goals', {
        ...template,
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days
      });

      setGoals([...goals, { ...data, progress: 0 }]);
      setShowAddForm(false);
      toast.success("Goal added successfully");
    } catch (error) {
      console.error("Failed to add goal", error);
      toast.error("Failed to add goal");
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await api.delete(`/goals/${goalId}`);
      setGoals(goals.filter(goal => goal._id !== goalId));
      toast.info("Goal deleted");
    } catch (error) {
      console.error("Failed to delete goal", error);
      toast.error("Failed to delete goal");
    }
  };

  const handleRequestSubmit = async () => {
    if (!newRequest.title || !newRequest.description) {
      toast.error("Please fill in both title and description");
      return;
    }

    try {
      const { data } = await api.post('/goals', {
        title: newRequest.title,
        description: newRequest.description,
        category: newRequest.category,
        priority: newRequest.priority,
        targetDate: newRequest.targetDate,
        status: 'pending',
        tasks: []
      });

      setGoals([...goals, { ...data, progress: 0 }]);
      setShowRequestModal(false);
      setNewRequest({ title: '', description: '', category: '', targetDate: new Date(), priority: 'medium' });
      toast.success("Goal request submitted for admin approval");
    } catch (error) {
      console.error("Failed to create goal", error);
      toast.error("Failed to create goal");
    }
  };

  const categories = [
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Mobile Development',
    'Cloud Computing',
    'AI/ML',
    'DevOps',
    'Other'
  ];

  const priorities = [
    { value: 'low', label: 'Low', color: 'text-green-500' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
    { value: 'high', label: 'High', color: 'text-red-500' }
  ];

  const filteredGoals = goals.filter(goal => {
    // Convert status to lowercase for case-insensitive comparison
    const matchesFilter = filter === 'all' || goal.status.toLowerCase() === filter.toLowerCase();

    // Search in title, description, category, and tasks
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' ||
      goal.title.toLowerCase().includes(searchLower) ||
      goal.description.toLowerCase().includes(searchLower) ||
      (goal.category && goal.category.toLowerCase().includes(searchLower)) ||
      goal.tasks.some(task => task.label.toLowerCase().includes(searchLower));

    // Category filter
    const matchesCategory = selectedCategory === 'all' ||
      (goal.category && goal.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesFilter && matchesSearch && matchesCategory;
  });

  // Sort goals by status and date
  const sortedGoals = [...filteredGoals].sort((a, b) => {
    // Sort by status priority: active -> pending -> completed -> rejected
    const statusPriority = {
      active: 0,
      pending: 1,
      completed: 2,
      rejected: 3
    };
    const statusA = statusPriority[a.status as keyof typeof statusPriority] || 0;
    const statusB = statusPriority[b.status as keyof typeof statusPriority] || 0;

    if (statusA !== statusB) return statusA - statusB;

    // If same status, sort by creation date (newest first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  if (loading) {
    return <div className="flex justify-center items-center h-96">Loading goals...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Learning Goals</h1>
          <p className="text-muted-foreground mt-1">Track and manage your learning journey</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            {showAddForm ? 'Close Templates' : 'Add Goal'}
          </Button>
          <Button variant="outline" onClick={() => setShowRequestModal(true)}>
            Request New Goal
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search goals by title, description, or tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Goals</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-2xl font-semibold mb-4">Goal Templates</h2>
            <p className="text-muted-foreground mb-6">
              Choose from our curated templates or create your own custom goal
            </p>

            <Tabs defaultValue="templates" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="templates">Templates</TabsTrigger>
                <TabsTrigger value="custom">Custom Goal</TabsTrigger>
              </TabsList>

              <TabsContent value="templates">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {predefinedGoals
                    .filter(template => !goals.some(goal => goal.title === template.title))
                    .map((goal, index) => (
                      <Card key={index} className="group hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle>{goal.title}</CardTitle>
                              <CardDescription>{goal.description}</CardDescription>
                            </div>
                            <Badge variant="secondary">{goal.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {goal.tasks.map((task, i) => (
                              <div key={i} className="flex items-start space-x-3">
                                <Checkbox id={`template-task-${i}`} checked={false} disabled />
                                <label className="text-sm leading-none">
                                  {task.label}
                                </label>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button onClick={() => addPredefinedGoal(goal)}>Use Template</Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
                {predefinedGoals.filter(template => !goals.some(goal => goal.title === template.title)).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">All templates have been used. Try creating a custom goal!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="custom">
                <div className="max-w-2xl mx-auto">
                  <Card>
                    <CardHeader>
                      <CardTitle>Create Custom Goal</CardTitle>
                      <CardDescription>Define your own learning goal with custom tasks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            value={newRequest.title}
                            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                            placeholder="Enter goal title"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={newRequest.description}
                            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                            placeholder="Describe your learning goal"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={newRequest.category}
                            onValueChange={(value) => setNewRequest({ ...newRequest, category: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={newRequest.priority}
                            onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map(priority => (
                                <SelectItem key={priority.value} value={priority.value}>
                                  <span className={priority.color}>{priority.label}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label>Target Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "justify-start text-left font-normal",
                                  !newRequest.targetDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {newRequest.targetDate ? (
                                  format(newRequest.targetDate, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={newRequest.targetDate}
                                onSelect={(date) => setNewRequest({ ...newRequest, targetDate: date || new Date() })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleRequestSubmit}>Submit Request</Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedGoals.length > 0 ? (
          sortedGoals.map(goal => (
            <Card key={goal._id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{goal.title}</CardTitle>
                    <CardDescription>{goal.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {goal.status === 'pending' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </Badge>
                    )}
                    {goal.status === 'active' && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </Badge>
                    )}
                    {goal.status === 'rejected' && (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </Badge>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        onClick={() => {/* Add share functionality */ }}
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                        onClick={() => {/* Add reminder functionality */ }}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteGoal(goal._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goal.tasks && goal.tasks.length > 0 ? (
                    goal.tasks.map(task => (
                      <div key={task._id} className="flex items-start space-x-3">
                        <Checkbox
                          id={task._id}
                          checked={task.checked}
                          onCheckedChange={() => toggleTask(goal._id, task._id)}
                        />
                        <label
                          htmlFor={task._id}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {task.label}
                        </label>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No tasks defined yet</p>
                  )}
                </div>
              </CardContent>
              {goal.tasks && goal.tasks.length > 0 && (
                <CardFooter>
                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span>Progress</span>
                      <span className="text-muted-foreground">
                        {Math.round(goal.progress || 0)}%
                      </span>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" />
                    {goal.targetDate && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        <span>Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium mb-2">No goals found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? "No goals match your search criteria. Try adjusting your filters or search term."
                  : "You haven't added any goals yet. Get started by adding a new goal!"}
              </p>
              <Button onClick={() => setShowAddForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Goal
              </Button>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showRequestModal} onOpenChange={setShowRequestModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request New Goal</DialogTitle>
            <DialogDescription>
              Submit a new learning goal for admin approval
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newRequest.title}
                onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                placeholder="Enter goal title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newRequest.description}
                onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                placeholder="Describe your learning goal"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newRequest.category}
                onValueChange={(value) => setNewRequest({ ...newRequest, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newRequest.priority}
                onValueChange={(value) => setNewRequest({ ...newRequest, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map(priority => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Target Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !newRequest.targetDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newRequest.targetDate ? (
                      format(newRequest.targetDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newRequest.targetDate}
                    onSelect={(date) => setNewRequest({ ...newRequest, targetDate: date || new Date() })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestSubmit}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}