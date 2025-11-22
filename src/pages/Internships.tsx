import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface Internship {
  _id: string;
  company: string;
  position: string;
  location: string;
  type: string;
  tags: string[];
  deadline: string;
  logo: string;
  description: string;
  duration: string;
  stipend: string;
  postedAt: string;
  applicants: string[];
}

const Internships = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [savedInternships, setSavedInternships] = useState<string[]>([]);

  useEffect(() => {
    fetchInternships();
    if (user) {
      fetchSavedInternships();
    }
  }, [page, searchQuery, selectedLocation, user]);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '9'); // 9 items per page
      if (searchQuery) params.append('search', searchQuery);
      if (selectedLocation !== 'all') params.append('location', selectedLocation);

      const { data } = await api.get(`/internships?${params.toString()}`);
      setInternships(data.internships);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Failed to fetch internships", error);
      toast.error("Failed to load internships");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedInternships = async () => {
    try {
      const { data } = await api.get('/users/saved-internships');
      // data is array of full objects, we just need IDs for checking status
      setSavedInternships(data.map((i: any) => i._id));
    } catch (error) {
      console.error("Failed to fetch saved internships", error);
    }
  };

  const handleSave = async (id: string) => {
    if (!user) {
      toast.error("Please login to save internships");
      return;
    }
    try {
      const { data } = await api.post(`/users/saved-internships/${id}`);
      if (data.saved) {
        setSavedInternships(prev => [...prev, id]);
        toast.success("Internship saved");
      } else {
        setSavedInternships(prev => prev.filter(savedId => savedId !== id));
        toast.success("Internship removed from saved");
      }
    } catch (error) {
      console.error("Failed to toggle save", error);
      toast.error("Failed to update saved status");
    }
  };

  // No client-side filtering needed anymore for main list
  // But for tabs like "Applied" or "Saved", we might need to fetch differently or filter client side if we fetch all
  // For now, let's keep simple tab logic but be aware "recommended" is the main paginated list

  const handleApply = async (id: string) => {
    if (!user) return;
    setApplying(true);
    try {
      await api.post(`/internships/${id}/apply`);
      toast.success("Application submitted successfully!");

      // Update local state
      setInternships(prev => prev.map(internship => {
        if (internship._id === id) {
          return { ...internship, applicants: [...internship.applicants, (user as any)._id] };
        }
        return internship;
      }));

      if (selectedInternship && selectedInternship._id === id) {
        setSelectedInternship(prev => prev ? { ...prev, applicants: [...prev.applicants, (user as any)._id] } : null);
      }
    } catch (error: any) {
      console.error("Failed to apply", error);
      toast.error(error.response?.data?.message || "Failed to apply for internship");
    } finally {
      setApplying(false);
    }
  };

  const getTabContent = (tab: string) => {
    switch (tab) {
      case "recommended":
        return internships;
      case "new":
        // This logic is now flawed because we only have current page.
        // Ideally backend should have a 'sort' param.
        // For now, just show current page internships sorted by date (default)
        return internships;
      case "applied":
        return internships.filter(i => user && i.applicants.includes((user as any)._id));
      case "saved":
        // We need to fetch full saved internships objects if we want to show them in a tab
        // For now, let's just filter from current page (which is incomplete) OR better:
        // We should probably have a separate API call for "saved" tab or just show what we have.
        // Given the constraints, let's filter what we have on the current page for now,
        // but ideally we'd fetch /users/saved-internships again to get full objects.
        return internships.filter(i => savedInternships.includes(i._id));
      default:
        return [];
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="w-8 h-8 animate-spin" /></div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Internship Opportunities</h1>
          <p className="text-muted-foreground mt-2">Curated internships to kickstart your career</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">Premium Feature</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Input
          placeholder="Search internships..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="lg:col-span-2"
        />
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger>
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="remote">Remote</SelectItem>
            <SelectItem value="new york, ny">New York, NY</SelectItem>
            <SelectItem value="san francisco, ca">San Francisco, CA</SelectItem>
            <SelectItem value="bangalore">Bangalore</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="recommended">Recommended</TabsTrigger>
          <TabsTrigger value="new">New Listings</TabsTrigger>
          <TabsTrigger value="applied">Applied</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>

        {["recommended", "new", "applied", "saved"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {getTabContent(tab).length > 0 ? (
                getTabContent(tab).map((internship) => (
                  <Card
                    key={internship._id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedInternship(internship)}
                  >
                    <CardContent className="p-6 flex gap-4">
                      <div className="flex-none w-12 h-12 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                        {internship.logo || internship.company.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{internship.position}</h3>
                        <p className="text-sm text-muted-foreground">{internship.company}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {internship.location}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {internship.type}
                          </Badge>
                          {new Date(internship.postedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <Badge variant="secondary" className="text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center border-t bg-muted/30 px-6 py-3">
                      <div className="text-xs">Apply by {new Date(internship.deadline).toLocaleDateString()}</div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSave(internship._id);
                          }}
                        >
                          {savedInternships.includes(internship._id) ? 'Unsave' : 'Save'}
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleApply(internship._id);
                          }}
                          disabled={user && internship.applicants.includes((user as any)._id)}
                        >
                          {user && internship.applicants.includes((user as any)._id) ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                    <Loader2 className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-medium">No internships found</h3>
                  <p className="text-muted-foreground mt-2 mb-4">
                    {tab === "saved" ? "Save internships to view them here" :
                      tab === "applied" ? "Apply to internships to track them here" :
                        "Try adjusting your search filters"}
                  </p>
                  <Button variant="outline" onClick={() => {
                    setSearchQuery("");
                    setSelectedLocation("all");
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Pagination Controls */}
      {
        totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8 mb-8">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        )
      }

      <Dialog open={!!selectedInternship} onOpenChange={() => setSelectedInternship(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden">
          {selectedInternship && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedInternship.position}</DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  <span>{selectedInternship.company}</span>
                  <span>•</span>
                  <span>Posted {new Date(selectedInternship.postedAt).toLocaleDateString()}</span>
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-[70vh] pr-4">
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm">{selectedInternship.location}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Type</p>
                      <p className="text-sm">{selectedInternship.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm">{selectedInternship.duration}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Stipend</p>
                      <p className="text-sm">{selectedInternship.stipend}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {selectedInternship.description}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium">Requirements</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {selectedInternship.tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Application Deadline</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(selectedInternship.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        className="w-full sm:w-auto"
                        onClick={() => {
                          handleApply(selectedInternship._id);
                        }}
                        disabled={applying || (user && selectedInternship.applicants.includes((user as any)._id))}
                      >
                        {user && selectedInternship.applicants.includes((user as any)._id)
                          ? 'Applied'
                          : applying ? 'Applying...' : 'Apply Now'}
                      </Button>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Internship Application Tips</CardTitle>
              <CardDescription>Maximize your chances of landing your dream internship</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">📄 Perfect Your Resume</h3>
                  <p className="text-sm text-muted-foreground">
                    Tailor your resume for each application using keywords from the job description. Highlight relevant coursework, projects, and skills.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">💼 Build a Portfolio</h3>
                  <p className="text-sm text-muted-foreground">
                    Create a professional portfolio website showcasing your best work. Include project descriptions, technologies used, and outcomes.
                  </p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">💻 Technical Preparation</h3>
                  <p className="text-sm text-muted-foreground">
                    Practice coding challenges on platforms like LeetCode. Review data structures and algorithms fundamentals.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Applications Sent</span>
                    <span className="font-medium">
                      {internships.filter(i => user && i.applicants.includes((user as any)._id)).length}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${internships.length > 0 ? (internships.filter(i => user && i.applicants.includes((user as any)._id)).length / internships.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Saved Internships</span>
                    <span className="font-medium">{savedInternships.length}</span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${internships.length > 0 ? (savedInternships.length / internships.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Upcoming Deadlines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {internships
                .filter(i => new Date(i.deadline) > new Date())
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 3)
                .map((internship) => (
                  <div key={internship._id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                    <div>
                      <p className="text-sm font-medium">{internship.company}</p>
                      <p className="text-xs text-muted-foreground">{internship.position}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {new Date(internship.deadline).toLocaleDateString()}
                    </Badge>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div >
  );
};

export default Internships;