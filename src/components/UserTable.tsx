// components/UserTable.tsx
import { User } from "@/context/AuthContext";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Crown, Shield, BookOpen, School, Percent } from "lucide-react";

export default function UserTable({ users }: { users: User[] }) {
  const getBadgeVariant = (user: User) => {
    if (user.role === 'admin') return 'default';
    if (user.premium) return 'secondary';
    return 'outline';
  };

  return (
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
        {users.map(user => (
          <TableRow key={user.id}>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
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
                  <span>10th: {user.class10Percentage}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span>12th: {user.class12Percentage}%</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>{user.board}</span>
                </div>
                <div className="flex items-center gap-2">
                  <School className="w-4 h-4 text-orange-600" />
                  <span>{user.branch}</span>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-1">
                <p className="font-medium">{user.college}</p>
                <p className="text-sm text-muted-foreground">{user.degree}</p>
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
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}