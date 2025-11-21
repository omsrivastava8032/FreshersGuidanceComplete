import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  HelpCircle,
  CheckCircle2,
  Clock,
  MessageSquare,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

type SupportTicket = {
  _id: string;
  userId: { _id: string; name: string; email: string };
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
};

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchTickets = async () => {
    try {
      const { data } = await api.get('/support/admin');
      setTickets(data);
    } catch (error) {
      console.error("Failed to fetch tickets", error);
      toast.error("Failed to load support tickets");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusBadge = (status: SupportTicket['status']) => {
    const variants = {
      open: 'default',
      in_progress: 'secondary',
      resolved: 'success'
    } as const;

    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved'
    };

    const badgeVariant = status === 'resolved' ? 'outline' : (variants[status] || 'default');
    const className = status === 'resolved' ? 'text-green-600 border-green-600' : '';

    return (
      <Badge variant={badgeVariant} className={className}>
        {labels[status]}
      </Badge>
    );
  };

  const handleRespond = async () => {
    if (!selectedTicket || !response.trim()) return;

    setLoading(true);
    try {
      const updatedTicket = {
        ...selectedTicket,
        status: 'resolved',
        adminResponse: response
      };

      await api.patch(`/support/${selectedTicket._id}`, {
        status: 'resolved',
        adminResponse: response
      });

      setTickets(tickets.map(t => t._id === selectedTicket._id ? { ...t, status: 'resolved', adminResponse: response } : t));
      toast.success("Response sent successfully");
      setSelectedTicket(null);
      setResponse("");
    } catch (error) {
      console.error("Failed to send response", error);
      toast.error("Failed to send response");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticket: SupportTicket, newStatus: SupportTicket['status']) => {
    try {
      await api.patch(`/support/${ticket._id}`, { status: newStatus });
      setTickets(tickets.map(t => t._id === ticket._id ? { ...t, status: newStatus } : t));
      toast.success("Ticket status updated");
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update ticket status");
    }
  };

  if (fetching) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage and respond to user support tickets
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <HelpCircle className="w-4 h-4 mr-2" />
          Admin Support
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Support Tickets</CardTitle>
          <CardDescription>
            {tickets.length} total tickets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket._id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.userId?.name || 'Unknown'}</p>
                      <p className="text-sm text-muted-foreground">{ticket.userEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px]">
                      <p className="font-medium truncate">{ticket.subject}</p>
                      <p className="text-sm text-muted-foreground truncate">{ticket.message}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(ticket.status)}
                  </TableCell>
                  <TableCell>
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTicket(ticket)}
                      >
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Respond
                      </Button>
                      {ticket.status === 'open' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(ticket, 'in_progress')}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Start Progress
                        </Button>
                      )}
                      {ticket.status === 'in_progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(ticket, 'resolved')}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1" />
                          Mark Resolved
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Respond to Support Ticket</DialogTitle>
            <DialogDescription>
              From {selectedTicket?.userId?.name} ({selectedTicket?.userEmail})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Subject</h3>
              <p className="text-sm text-muted-foreground">{selectedTicket?.subject}</p>
            </div>

            <div>
              <h3 className="font-medium">Message</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {selectedTicket?.message}
              </p>
            </div>

            {selectedTicket?.adminResponse && (
              <div>
                <h3 className="font-medium">Previous Response</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {selectedTicket.adminResponse}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Your Response</label>
              <Textarea
                placeholder="Type your response here..."
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTicket(null);
                setResponse("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRespond}
              disabled={loading || !response.trim()}
            >
              {loading ? "Sending..." : "Send Response"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}