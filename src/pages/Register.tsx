// components/Register.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BOARDS = ["CBSE", "ICSE", "State Board", "Other"];
const STREAMS = ["Science", "Commerce", "Arts", "Other"];
const DEGREES = [
  "B.Tech",
  "B.Sc.",
  "B.Com",
  "B.A.",
  "BBA",
  "BCA",
  "B.Arch",
  "Other",
];

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [class10Percentage, setClass10Percentage] = useState("");
  const [class12Percentage, setClass12Percentage] = useState("");
  const [board, setBoard] = useState("");
  const [stream, setStream] = useState("");
  const [college, setCollege] = useState("");
  const [degree, setDegree] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) return;
    
    // Validate percentage values
    const class10Percent = parseFloat(class10Percentage);
    const class12Percent = parseFloat(class12Percentage);
    
    if (isNaN(class10Percent) || class10Percent < 0 || class10Percent > 100) {
      toast.error("Class 10 percentage must be between 0 and 100");
      return;
    }
    
    if (isNaN(class12Percent) || class12Percent < 0 || class12Percent > 100) {
      toast.error("Class 12 percentage must be between 0 and 100");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await register(
        name, 
        email, 
        password,
        {
          class10Percentage,
          class12Percentage,
          board,
          branch: stream, // Keep using branch in the API call for backward compatibility
          college,
          degree
        }
      );
      navigate("/goals");
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/10 to-primary/5">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="max-w-lg text-center">
              <h2 className="text-3xl font-medium mb-4">Begin your journey to success</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of students who've found their perfect career path with personalized guidance.
              </p>
            </div>
          </div>
          
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl" />
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-medium">IT Career Guidance</h2>
            </Link>
            <h1 className="text-3xl font-medium tracking-tight">Create your account</h1>
            <p className="mt-2 text-muted-foreground">Sign up to get started with personalized guidance</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="class10">Class 10 (%)</Label>
                  <Input
                    id="class10"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="95.6%"
                    value={class10Percentage}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                        setClass10Percentage(value);
                      }
                    }}
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class12">Class 12 (%)</Label>
                  <Input
                    id="class12"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder="92.4%"
                    value={class12Percentage}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                        setClass12Percentage(value);
                      }
                    }}
                    required
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="board">Class 12 Board</Label>
                <select
                  id="board"
                  value={board}
                  onChange={(e) => setBoard(e.target.value)}
                  required
                  className="w-full h-12 px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                >
                  <option value="">Select Board</option>
                  {BOARDS.map((board) => (
                    <option key={board} value={board}>{board}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream">Class 12 Stream</Label>
                <select
                  id="stream"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  required
                  className="w-full h-12 px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                >
                  <option value="">Select Stream</option>
                  {STREAMS.map((stream) => (
                    <option key={stream} value={stream}>{stream}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="college">College/University</Label>
                <Input
                  id="college"
                  type="text"
                  placeholder="University of Technology"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="degree">Degree Pursuing</Label>
                <select
                  id="degree"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                  required
                  className="w-full h-12 px-4 py-2 border rounded-md bg-background focus:ring-2 focus:ring-primary focus:outline-none transition-colors"
                >
                  <option value="">Select Degree</option>
                  {DEGREES.map((degree) => (
                    <option key={degree} value={degree}>{degree}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters long
                </p>
              </div>
            </div>

            <Button 
              type="submit" 
              className={cn(
                "w-full h-12 gap-2",
                "bg-primary hover:bg-primary/90",
                "transition-all duration-200"
              )}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account..." : "Create account"}
              <ArrowRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                isSubmitting ? "translate-x-1" : ""
              )} />
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account?</span>{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}