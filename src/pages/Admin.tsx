import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  User as UserIcon,
  Crown,
  Shield,
  Trash2,
  Target,
  BookOpen,
  Briefcase,
  Globe,
  CheckCircle2,
  XCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import api from "@/lib/api";

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  premium: boolean;
  createdAt: string;
  class10Percentage?: string;
  class12Percentage?: string;
  board?: string;
  branch?: string;
  college?: string;
  degree?: string;
  phone?: string;
  emailVerified?: boolean;
  lastLogin?: string;
  status?: string;
  graduationYear?: string;
  currentYear?: string;
  desiredRole?: string;
  industry?: string;
  experienceLevel?: string;
  jobType?: string;
  learningStyle?: string;
  preferredLanguage?: string;
  timeZone?: string;
  notificationPreferences?: string;
  learningGoals?: any[];
  courses?: any[];
};

type GoalRequest = {
  _id: string;
  title: string;
  description: string;
  userId: { _id: string; name: string; email: string };
  status: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
};

export default function Admin() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<GoalRequest[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchData = async () => {
    try {
      const [usersRes, goalsRes] = await Promise.all([
        api.get('/users'),
        api.get('/goals/pending')
      ]);
      setUsers(usersRes.data);
      setPendingRequests(goalsRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
      toast.error("Failed to load admin dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUserClick = async (user: User) => {
    setLoadingDetails(true);
    try {
      const { data } = await api.get(`/users/${user._id}`);
      setSelectedUser(data);
    } catch (error) {
      console.error("Failed to fetch user details", error);
      toast.error("Failed to load user details");
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleGoalRequest = async (goalId: string, status: 'approved' | 'rejected') => {
    try {
      await api.patch(`/goals/${goalId}`, { status: status === 'approved' ? 'active' : 'rejected' });
      toast.success(`Goal request ${status} successfully`);

      // Update the pending requests list
      setPendingRequests(prev => prev.filter(req => req._id !== goalId));
    } catch (error) {
      console.error("Failed to update goal", error);
      toast.error('Failed to update goal status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await api.delete(`/users/${userId}`);
      setUsers(users.filter(u => u._id !== userId));
      setUserToDelete(null);
      toast.success("User deleted successfully");
    } catch (error) {
      console.error("Failed to delete user", error);
      toast.error("Failed to delete user");
    }
  };

  const getBadgeVariant = (user: User) => {
    if (user.role === 'admin') return 'default';
    if (user.premium) return 'secondary';
    return 'outline';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline" className="px-4 py-2">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Admin Panel
        </Badge>
      </div>

      {/* Pending Goal Requests Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Goal Requests</CardTitle>
          <CardDescription>
            {pendingRequests.length} requests waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length > 0 ? (
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request._id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{request.title}</h3>
                      <p className="text-sm text-muted-foreground">{request.description}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {request.category}
                        </Badge>
                        <Badge
                          variant={
                            request.priority === 'high' ? 'destructive' :
                              request.priority === 'medium' ? 'secondary' :
                                'outline'
                          }
                          className="text-xs"
                        >
                          {request.priority} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Requested by: {request.userId?.email || 'Unknown User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Created: {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 hover:text-green-700"
                        onClick={() => handleGoalRequest(request._id, 'approved')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleGoalRequest(request._id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No pending requests</p>
          )}
        </CardContent>
      </Card>

      {/* User Management Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage {users.filter(u => u.role !== 'admin').length} regular users
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Academic Details</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Education</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users
                .filter(user => user.role !== 'admin')
                .map(user => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserIcon className="w-4 h-4 text-primary" />
                        </div>
                        <div
                          className="cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleUserClick(user)}
                        >
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span>10th: {user.class10Percentage || '-'}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>12th: {user.class12Percentage || '-'}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span>{user.board || '-'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{user.branch || '-'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">{user.college || '-'}</p>
                        <p className="text-sm text-muted-foreground">{user.degree || '-'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(user)}>
                        {user.premium ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : null}
                        {user.premium ? 'Premium' : 'Basic'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setUserToDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          {users.filter(user => user.role !== 'admin').length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No regular users found
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser || loadingDetails} onOpenChange={() => !loadingDetails && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          {loadingDetails ? (
            <div className="flex justify-center items-center h-40"><Loader2 className="w-8 h-8 animate-spin" /></div>
          ) : selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>User Details</DialogTitle>
                <DialogDescription>
                  Complete information about {selectedUser.name}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="goals">Learning Goals</TabsTrigger>
                  <TabsTrigger value="preferences">Preferences</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">Basic Information</h3>
                      <div className="space-y-1">
                        <p><span className="text-muted-foreground">Name:</span> {selectedUser.name}</p>
                        <p><span className="text-muted-foreground">Email:</span> {selectedUser.email}</p>
                        <p><span className="text-muted-foreground">Phone:</span> {selectedUser.phone || 'Not provided'}</p>
                        <p><span className="text-muted-foreground">Status:</span> {selectedUser.premium ? 'Premium' : 'Basic'}</p>
                        <p><span className="text-muted-foreground">Registered:</span> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Account Status</h3>
                      <div className="space-y-1">
                        <p><span className="text-muted-foreground">Email Verified:</span> {selectedUser.emailVerified ? 'Yes' : 'No'}</p>
                        <p><span className="text-muted-foreground">Last Login:</span> {selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}</p>
                        <p><span className="text-muted-foreground">Account Status:</span> {selectedUser.status || 'Active'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium">School Education</h3>
                      <div className="space-y-1">
                        <p><span className="text-muted-foreground">10th Percentage:</span> {selectedUser.class10Percentage}%</p>
                        <p><span className="text-muted-foreground">12th Percentage:</span> {selectedUser.class12Percentage}%</p>
                        <p><span className="text-muted-foreground">Board:</span> {selectedUser.board}</p>
                        <p><span className="text-muted-foreground">Branch:</span> {selectedUser.branch}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium">Higher Education</h3>
                      <div className="space-y-1">
                        <p><span className="text-muted-foreground">College:</span> {selectedUser.college}</p>
                        <p><span className="text-muted-foreground">Degree:</span> {selectedUser.degree}</p>
                        <p><span className="text-muted-foreground">Graduation Year:</span> {selectedUser.graduationYear || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Current Year:</span> {selectedUser.currentYear || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="goals" className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Learning Goals
                      </h3>
                      <div className="space-y-2">
                        {selectedUser.learningGoals && selectedUser.learningGoals.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {selectedUser.learningGoals.map((goal, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium">{goal.title}</p>
                                    <p className="text-sm text-muted-foreground">{goal.description}</p>
                                  </div>
                                  <Badge variant={
                                    goal.status === 'active' ? 'default' :
                                      goal.status === 'pending' ? 'secondary' :
                                        goal.status === 'rejected' ? 'destructive' :
                                          'outline'
                                  }>
                                    {goal.status === 'active' ? (
                                      <CheckCircle2 className="w-3 h-3 mr-1" />
                                    ) : goal.status === 'pending' ? (
                                      <Clock className="w-3 h-3 mr-1" />
                                    ) : goal.status === 'rejected' ? (
                                      <XCircle className="w-3 h-3 mr-1" />
                                    ) : null}
                                    {goal.status}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs text-muted-foreground">
                                    Created: {new Date(goal.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No learning goals set</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        Courses & Certifications
                      </h3>
                      <div className="space-y-2">
                        {selectedUser.courses && selectedUser.courses.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {selectedUser.courses.map((course, index) => (
                              <div key={index} className="p-3 border rounded-lg">
                                <p className="font-medium">{course.title}</p>
                                <p className="text-sm text-muted-foreground">{course.provider}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge variant="outline">
                                    {course.status || 'In Progress'}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground">
                                    Started: {new Date(course.startedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground">No courses enrolled</p>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Career Preferences
                      </h3>
                      <div className="space-y-1">
                        <p><span className="text-muted-foreground">Desired Role:</span> {selectedUser.desiredRole || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Industry:</span> {selectedUser.industry || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Experience Level:</span> {selectedUser.experienceLevel || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Job Type:</span> {selectedUser.jobType || 'Not specified'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-medium flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        Learning Preferences
                      </h3>
                      <div className="space-y-1">
                        <p><span className="text-muted-foreground">Learning Style:</span> {selectedUser.learningStyle || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Preferred Language:</span> {selectedUser.preferredLanguage || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Time Zone:</span> {selectedUser.timeZone || 'Not specified'}</p>
                        <p><span className="text-muted-foreground">Notification Preferences:</span> {selectedUser.notificationPreferences || 'Default'}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user
              {userToDelete && ` "${userToDelete.name}"`} and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (userToDelete) {
                  handleDeleteUser(userToDelete._id);
                }
              }}
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}