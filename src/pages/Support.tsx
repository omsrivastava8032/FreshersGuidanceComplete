import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Mail,
  Phone,
  Clock,
  BookOpen,
  GraduationCap,
  Briefcase,
  Globe,
  AlertCircle,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

type SupportTicket = {
  _id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
};

export default function Support() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const { data } = await api.get('/support');
        setTickets(data);
      } catch (error) {
        console.error("Failed to fetch tickets", error);
        toast.error("Failed to load support tickets");
      } finally {
        setFetching(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { data } = await api.post('/support', {
        subject,
        message
      });

      setTickets([...tickets, data]);
      toast.success("Support ticket submitted successfully");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error submitting ticket:", error);
      toast.error("Failed to submit support ticket");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const variants = {
      open: 'default',
      in_progress: 'secondary',
      resolved: 'success' // Note: 'success' might not be a valid variant in standard badge, usually 'default', 'secondary', 'destructive', 'outline'
    } as const;

    // Map to valid badge variants
    const badgeVariant = status === 'resolved' ? 'outline' : (variants[status] || 'default');
    const className = status === 'resolved' ? 'text-green-600 border-green-600' : '';

    const labels = {
      open: 'Open',
      in_progress: 'In Progress',
      resolved: 'Resolved'
    };

    return (
      <Badge variant={badgeVariant} className={className}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Center</h1>
          <p className="text-muted-foreground mt-2">
            Get help with your career journey and platform usage
          </p>
        </div>
        <Badge variant="outline" className="px-4 py-2">
          <HelpCircle className="w-4 h-4 mr-2" />
          Support
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Contact Support Card */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="What's your issue about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Describe your issue in detail"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="min-h-[100px]"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? "Submitting..." : "Submit Ticket"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              support@freshersguidance.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +1 (555) 123-4567
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Response time: Within 24 hours
            </div>
          </CardFooter>
        </Card>

        {/* My Tickets Card */}
        <Card>
          <CardHeader>
            <CardTitle>My Support Tickets</CardTitle>
            <CardDescription>
              Track your support requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {fetching ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : tickets.length > 0 ? (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {tickets.map((ticket) => (
                  <div key={ticket._id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {ticket.message}
                        </p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      {ticket.adminResponse && (
                        <span className="flex items-center gap-1 text-blue-600">
                          <AlertCircle className="w-3 h-3" />
                          Response received
                        </span>
                      )}
                    </div>
                    {ticket.adminResponse && (
                      <div className="mt-2 p-2 bg-muted rounded-md">
                        <p className="text-sm font-medium">Admin Response:</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {ticket.adminResponse}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No support tickets yet
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Links Card */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Links</CardTitle>
            <CardDescription>
              Access helpful resources and guides
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BookOpen className="w-4 h-4" />
                User Guide
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <GraduationCap className="w-4 h-4" />
                Career Resources
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Briefcase className="w-4 h-4" />
                Job Search Tips
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Globe className="w-4 h-4" />
                Community Forums
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>
            Find answers to common questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="account">
              <AccordionTrigger>How do I manage my account?</AccordionTrigger>
              <AccordionContent>
                You can manage your account settings, including profile information, preferences, and subscription details, from your dashboard. Click on your profile icon in the top right corner to access these settings.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="goals">
              <AccordionTrigger>How do I set and track my learning goals?</AccordionTrigger>
              <AccordionContent>
                You can set learning goals from your dashboard by clicking on the "Goals" section. Each goal can be broken down into tasks, and you can track your progress through the progress bar. Goals can be modified or updated at any time.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="mentorship">
              <AccordionTrigger>How does the mentorship program work?</AccordionTrigger>
              <AccordionContent>
                Our mentorship program connects you with industry experts for one-on-one guidance. You can book sessions through the Guidance page, where you'll find available mentors and their expertise. Sessions can be conducted via video call or chat.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="premium">
              <AccordionTrigger>What are the benefits of premium membership?</AccordionTrigger>
              <AccordionContent>
                Premium members get access to exclusive features including priority support, unlimited mentorship sessions, advanced career roadmaps, and personalized learning paths. You can upgrade to premium from the Payment page.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="refund">
              <AccordionTrigger>What is your refund policy?</AccordionTrigger>
              <AccordionContent>
                We offer a 7-day money-back guarantee for premium subscriptions. If you're not satisfied with our service, contact our support team within 7 days of your purchase for a full refund.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}