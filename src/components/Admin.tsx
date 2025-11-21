// src/components/Admin.tsx
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"; // Ensure these components are correctly exported from the module
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  XCircle,
  User,
  Crown,
  Shield,
  BookOpen,
  School,
  Percent
} from "lucide-react";
import { toast } from "sonner";

type GoalRequest = {
  id: string;
  title: string;
  description: string;
  userId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

export default function Admin() {
  const { user: adminUser, allUsers, updateUserData } = useAuth();
  const [requests, setRequests] = useState<GoalRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRequests = () => {
      try {
        const allRequests: GoalRequest[] = JSON.parse(localStorage.getItem('requests') || '[]');
        setRequests(allRequests.filter(request => request.status === 'pending'));
      } catch (error) {
        console.error('Error loading requests:', error);
        toast.error('Failed to load requests');
      }
      setLoading(false);
    };
    loadRequests();
  }, []);

  const getBadgeVariant = (user: any) => {
    if (user.role === 'admin') return 'default';
    if (user.premium) return 'secondary';
    return 'outline';
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Badge variant="outline" className="px-4 py-2">
          <ShieldCheck className="w-4 h-4 mr-2" />
          Logged in as: {adminUser?.email}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registered Users Card with Full Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Registered Users</CardTitle>
                <CardDescription>
                  {allUsers.length} total users with complete academic details
                </CardDescription>
              </div>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {allUsers.map(user => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-green-600" />
                          <span>10th: {user.class10Percentage ?? 'N/A'}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Percent className="w-4 h-4 text-blue-600" />
                          <span>12th: {user.class12Percentage ?? 'N/A'}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                          <span>{user.board ?? 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <School className="w-4 h-4 text-orange-600" />
                          <span>{user.branch ?? 'N/A'}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <p className="font-medium">{user.college ?? 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{user.degree ?? 'N/A'}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(user)}>
                        {user.role === 'admin' ? (
                          <Shield className="w-3 h-3 mr-1" />
                        ) : user.premium ? (
                          <Crown className="w-3 h-3 mr-1" />
                        ) : null}
                        {user.role === 'admin' ? 'Admin' : user.premium ? 'Premium' : 'Basic'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}