import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ChevronRight, 
  GraduationCap, 
  Compass, 
  Award, 
  Video, 
  Briefcase, 
  Globe, 
  Menu, 
  X, 
  ArrowDown,
  Rocket,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isRocketVisible, setIsRocketVisible] = useState(false);
  const sectionsRef = useRef<Record<string, HTMLElement | null>>({});
  const navigate = useNavigate();

  // Scroll observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // When section is visible
          if (entry.isIntersecting) {
            // Add visible class for animations
            entry.target.classList.add("visible");
            // Update active section for navigation
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    // Get all sections and observe them
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      sectionsRef.current[section.id] = section as HTMLElement;
      observer.observe(section);
    });

    // Trigger rocket animation after a delay
    const rocketTimer = setTimeout(() => {
      setIsRocketVisible(true);
    }, 1000);

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      clearTimeout(rocketTimer);
    };
  }, []);

  // Scroll to section
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    const section = sectionsRef.current[id];
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <span className="text-xl font-medium">IT Career Guidance</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Button 
                variant="ghost" 
                className={cn(
                  "text-sm font-medium",
                  activeSection === "hero" && "text-primary"
                )}
                onClick={() => scrollToSection("hero")}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-sm font-medium",
                  activeSection === "features" && "text-primary"
                )}
                onClick={() => scrollToSection("features")}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-sm font-medium",
                  activeSection === "premium" && "text-primary"
                )}
                onClick={() => scrollToSection("premium")}
              >
                Premium
              </Button>
              <Button 
                variant="ghost" 
                className={cn(
                  "text-sm font-medium",
                  activeSection === "testimonials" && "text-primary"
                )}
                onClick={() => scrollToSection("testimonials")}
              >
                Success Stories
              </Button>
              <Button 
                variant="outline" 
                className="ml-2"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button 
                className="ml-2"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </nav>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="m:hidden absolute top-16 inset-x-0 bg-white shadow-lg border-b animate-slide-down">
            <div className="px-4 py-2 space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => scrollToSection("hero")}
              >
                Home
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => scrollToSection("features")}
              >
                Features
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => scrollToSection("premium")}
              >
                Premium
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start"
                onClick={() => scrollToSection("testimonials")}
              >
                Success Stories
              </Button>
              <hr className="my-2" />
              <Button 
                variant="outline" 
                className="w-full mb-2"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button 
                className="w-full"
                onClick={() => navigate("/register")}
              >
                Get Started
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section 
          id="hero" 
          className="section-animate relative min-h-[90vh] flex items-center justify-center overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight mb-8 leading-tight">
                Your Personal Guide to a 
                <span className="text-primary block mt-2">Successful Career</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
                Get personalized guidance, expert mentorship, and a clear roadmap to achieve your career goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="h-14 px-8 text-lg group"
                  onClick={() => navigate("/register")}
                >
                  Start Your Journey
                  <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-14 px-8 text-lg group"
                  onClick={() => scrollToSection("features")}
                >
                  Learn More
                  <ArrowDown className="ml-2 w-4 h-4 transition-transform group-hover:translate-y-1" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Background decorative elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl animate-pulse-subtle [animation-delay:1s]" />
          </div>
          
          {/* Rocket Animation */}
          <div className={cn(
            "absolute bottom-0 left-1/2 transform -translate-x-1/2 transition-all duration-1000",
            isRocketVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
          )}>
            <div className="relative">
              <Rocket className="w-16 h-16 text-primary animate-float" />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-8 bg-gradient-to-t from-primary/30 to-transparent rounded-b-full animate-flame" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-primary/20 rounded-full animate-float-slow [animation-delay:0.5s]" />
            <div className="absolute top-1/2 right-1/3 w-6 h-6 bg-primary/10 rounded-full animate-float [animation-delay:1s]" />
            <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-primary/30 rounded-full animate-float-slow [animation-delay:1.5s]" />
            <div className="absolute top-1/4 right-1/4 w-5 h-5 bg-primary/20 rounded-full animate-float [animation-delay:2s]" />
          </div>
        </section>

        {/* Features Section */}
        <section 
          id="features" 
          className="section-animate py-24 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-medium mb-4">Everything You Need to Succeed</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive tools and guidance to help you navigate your career journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Compass,
                  title: "Goal Setting",
                  description: "Define your career objectives and get a personalized action plan.",
                },
                {
                  icon: GraduationCap,
                  title: "Course Recommendations",
                  description: "Discover the best courses aligned with your career goals.",
                },
                {
                  icon: Award,
                  title: "Certifications",
                  description: "Learn which certifications will boost your career prospects.",
                },
                {
                  icon: Video,
                  title: "Personal Guidance",
                  description: "Get one-on-one mentorship through video calls.",
                },
                {
                  icon: Briefcase,
                  title: "Internship Opportunities",
                  description: "Find internships that match your career path.",
                },
                {
                  icon: Globe,
                  title: "University Programs",
                  description: "Explore international education opportunities.",
                },
              ].map((feature, index) => (
                <div 
                  key={index}
                  className={cn(
                    "group p-6 rounded-xl bg-white shadow-subtle hover:shadow-hover",
                    "transition-all duration-300 hover:-translate-y-1"
                  )}
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Premium Section */}
        <section 
          id="premium" 
          className="section-animate relative py-24 overflow-hidden"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl sm:text-4xl font-medium mb-4">Premium Benefits</h2>
                <p className="text-lg text-muted-foreground">
                  Unlock advanced features to accelerate your career growth.
                </p>
              </div>

              <div className="glass-card p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
                <div className="relative z-10">
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium mb-4">Premium Membership</h3>
                      <ul className="space-y-4">
                        <li className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </span>
                          <span>Personalized career roadmap</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </span>
                          <span>1-on-1 video mentorship</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </span>
                          <span>Priority internship placements</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                            <ChevronRight className="w-4 h-4 text-primary" />
                          </span>
                          <span>University transfer assistance</span>
                        </li>
                      </ul>
                      <div className="mt-8">
                        <Button 
                          size="lg" 
                          onClick={() => navigate("/register")}
                          className="bg-primary hover:bg-primary/90 group"
                        >
                          Get Premium Access
                          <ChevronRight className="ml-2 transition-transform group-hover:translate-x-1" />
                        </Button>
                        <p className="mt-4 text-sm text-muted-foreground">
                          Only $10/month - Cancel anytime
                        </p>
                      </div>
                    </div>
                    {/* Free Features Section */}
                    <div className="lg:w-1/2">
                      <div className="p-6 bg-white/50 backdrop-blur rounded-lg">
                        <h3 className="text-xl font-medium mb-6 text-center">
                          Free Tier Benefits
                        </h3>
                        <div className="grid gap-6">
                          {[
                            {
                              icon: Compass,
                              title: "Basic Career Roadmap",
                              description: "General career path recommendations based on your field"
                            },
                            {
                              icon: Award,
                              title: "Skill Assessment",
                              description: "Basic skills evaluation and improvement suggestions"
                            },
                            {
                              icon: Globe,
                              title: "Community Support",
                              description: "Access to student forums and discussion groups"
                            },
                            {
                              icon: Briefcase,
                              title: "Job Listings",
                              description: "Curated entry-level job opportunities"
                            }
                          ].map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <feature.icon className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <h4 className="font-medium">{feature.title}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {feature.description}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl animate-pulse-subtle [animation-delay:0.5s]" />
            <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl animate-pulse-subtle [animation-delay:1.5s]" />
          </div>
        </section>

        {/* Success Stories Section */}
        <section 
          id="testimonials" 
          className="section-animate py-24 bg-gray-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-medium mb-4">Success Stories</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how IT Career Guidance has helped students achieve their career goals.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Abhinav Sharma",
                  role: "Software Developer",
                  company: "Tech Corp",
                  testimonial: "The personalized roadmap helped me land my dream job in web development.",
                },
                {
                  name: "Sandeep Singh",
                  role: "Data Scientist",
                  company: "Data Analytics Inc",
                  testimonial: "The mentorship program was invaluable in helping me transition into data science.",
                },
                {
                  name: "Rahul Yadav",
                  role: "UX Designer",
                  company: "Creative Solutions",
                  testimonial: "Found my perfect career path and got certified with expert guidance.",
                },
              ].map((testimonial, index) => (
                <div 
                  key={index}
                  className={cn(
                    "p-6 rounded-xl bg-white shadow-subtle",
                    "transition-all duration-300 hover:-translate-y-1 hover:shadow-hover"
                  )}
                >
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xl font-medium text-primary">
                        {testimonial.name[0]}
                      </span>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.testimonial}"</p>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium mb-4">Product</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="h-auto p-0">Features</Button></li>
                <li><Button variant="link" className="h-auto p-0">Premium</Button></li>
                <li><Button variant="link" className="h-auto p-0">Pricing</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="h-auto p-0">About</Button></li>
                <li><Button variant="link" className="h-auto p-0">Careers</Button></li>
                <li><Button variant="link" className="h-auto p-0">Blog</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="h-auto p-0">Documentation</Button></li>
                <li><Button variant="link" className="h-auto p-0">Help Center</Button></li>
                <li><Button variant="link" className="h-auto p-0">Contact</Button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Button variant="link" className="h-auto p-0">Privacy Policy</Button></li>
                <li><Button variant="link" className="h-auto p-0">Terms of Service</Button></li>
                <li><Button variant="link" className="h-auto p-0">Cookie Policy</Button></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} IT Career Guidance. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
