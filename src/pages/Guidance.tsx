import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Search, Filter } from 'lucide-react';
import { format } from "date-fns";
import VideoCall from '@/components/VideoCall';

type Mentor = {
  id: string;
  name: string;
  role: string;
  expertise: string;
  availability: string[];
  rating: number;
  reviews: number;
  imageUrl: string;
};

type Session = {
  id: string;
  mentorId: string;
  mentorName: string;
  title: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
};

const Guidance = () => {
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [activeTab, setActiveTab] = useState('upcoming');

  const mentors: Mentor[] = [
    {
      id: '1',
      name: 'Murugan',
      role: 'Senior Frontend Developer',
      expertise: 'React, TypeScript, UI/UX',
      availability: ['Mon', 'Wed', 'Fri'],
      rating: 4.8,
      reviews: 124,
      imageUrl: 'https://i.pravatar.cc/150?img=1'
    },
    {
      id: '2',
      name: 'Sahil Singh',
      role: 'Tech Lead',
      expertise: 'Full Stack, System Design',
      availability: ['Tue', 'Thu', 'Sat'],
      rating: 4.9,
      reviews: 98,
      imageUrl: 'https://i.pravatar.cc/150?img=2'
    },
    {
      id: '3',
      name: 'Aditya Singh',
      role: 'Engineering Manager',
      expertise: 'Career Development, Leadership',
      availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      rating: 4.7,
      reviews: 156,
      imageUrl: 'https://i.pravatar.cc/150?img=3'
    }
  ];

  const sessions: Session[] = [
    {
      id: '1',
      mentorId: '1',
      mentorName: 'Murugan',
      title: 'React Project Review',
      date: '2024-03-20',
      time: '15:00',
      status: 'upcoming'
    },
    {
      id: '2',
      mentorId: '2',
      mentorName: 'Sahil Singh',
      title: 'System Design Discussion',
      date: '2024-03-15',
      time: '14:00',
      status: 'completed',
      notes: 'Discussed microservices architecture and scalability patterns.'
    }
  ];

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mentor.expertise.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBookSession = (mentor: Mentor) => {
    setSelectedMentor(mentor);
  };

  const handleStartCall = (session: Session) => {
    setIsVideoCallActive(true);
  };

  const handleEndCall = () => {
    setIsVideoCallActive(false);
  };

  if (isVideoCallActive && selectedMentor) {
    return <VideoCall mentorName={selectedMentor.name} onEndCall={handleEndCall} />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Personal Guidance</h1>
          <p className="text-muted-foreground mt-2">Connect with industry experts for personalized mentoring</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">Premium Feature</Badge>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Sessions</CardTitle>
              <CardDescription>Manage your mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                  <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>
                
                <TabsContent value="upcoming" className="space-y-4">
                  {sessions
                    .filter(session => session.status === 'upcoming')
                    .map(session => (
                      <div key={session.id} className="bg-accent rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-4 items-center">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${session.mentorId}`} alt={session.mentorName} />
                            <AvatarFallback>{session.mentorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{session.title}</h3>
                            <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <div className="text-sm font-medium">{format(new Date(session.date), 'PPP')}</div>
                          <div className="text-sm text-muted-foreground">{session.time}</div>
                          <div className="flex gap-2 mt-2">
                            <Button size="sm" variant="outline">Reschedule</Button>
                            <Button size="sm" onClick={() => handleStartCall(session)}>Join Call</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="completed" className="space-y-4">
                  {sessions
                    .filter(session => session.status === 'completed')
                    .map(session => (
                      <div key={session.id} className="bg-muted/40 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex gap-4 items-center">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`https://i.pravatar.cc/150?img=${session.mentorId}`} alt={session.mentorName} />
                            <AvatarFallback>{session.mentorName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{session.title}</h3>
                            <p className="text-sm text-muted-foreground">with {session.mentorName}</p>
                            {session.notes && (
                              <p className="text-sm text-muted-foreground mt-1">{session.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end">
                          <div className="text-sm text-muted-foreground">
                            {format(new Date(session.date), 'PPP')}
                          </div>
                          <Button size="sm" variant="ghost" className="mt-2">View Recording</Button>
                        </div>
                      </div>
                    ))}
                </TabsContent>
                
                <TabsContent value="cancelled" className="space-y-4">
                  <p className="text-muted-foreground text-center py-4">No cancelled sessions</p>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Book a New Session</Button>
            </CardFooter>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Find a Mentor</CardTitle>
              <CardDescription>Connect with industry experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search mentors..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {filteredMentors.map((mentor) => (
                    <div
                      key={mentor.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors"
                      onClick={() => handleBookSession(mentor)}
                    >
                      <Avatar>
                        <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
                        <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium text-sm">{mentor.name}</h3>
                        <p className="text-xs text-muted-foreground">{mentor.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs font-normal">
                            {mentor.expertise}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            ⭐ {mentor.rating} ({mentor.reviews})
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>How It Works</CardTitle>
              <CardDescription>Get the most from your mentoring sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">1</div>
                  <div>
                    <h3 className="font-medium">Book a Session</h3>
                    <p className="text-sm text-muted-foreground">Choose a mentor that matches your needs and schedule a time.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">2</div>
                  <div>
                    <h3 className="font-medium">Prepare Questions</h3>
                    <p className="text-sm text-muted-foreground">List your goals and specific questions before the call.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">3</div>
                  <div>
                    <h3 className="font-medium">Join the Video Call</h3>
                    <p className="text-sm text-muted-foreground">Connect with your mentor via our secure video platform.</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">4</div>
                  <div>
                    <h3 className="font-medium">Follow Up</h3>
                    <p className="text-sm text-muted-foreground">Review session notes and implement suggested actions.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!selectedMentor} onOpenChange={() => setSelectedMentor(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Book a Session with {selectedMentor?.name}</DialogTitle>
            <DialogDescription>
              Schedule a mentoring session with {selectedMentor?.role}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Session Title</label>
              <Input placeholder="What would you like to discuss?" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <div className="grid grid-cols-3 gap-2">
                {['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'].map((time) => (
                  <Button
                    key={time}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Clock className="h-4 w-4" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Questions/Topics</label>
              <Textarea
                placeholder="List your questions or topics you'd like to discuss..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMentor(null)}>Cancel</Button>
            <Button>Book Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Guidance;
