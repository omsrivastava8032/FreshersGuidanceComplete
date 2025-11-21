
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left section - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <Link to="/" className="inline-block mb-6">
              <h2 className="text-2xl font-medium">IT Career Guidance</h2>
            </Link>
            <h1 className="text-3xl font-medium tracking-tight">Welcome back</h1>
            <p className="mt-2 text-muted-foreground">Log in to your account to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
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
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="h-auto p-0" type="button">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
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
              {isSubmitting ? "Logging in..." : "Log in"}
              <ArrowRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                isSubmitting ? "translate-x-1" : ""
              )} />
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account?</span>{" "}
              <Link to="/register" className="font-medium text-primary hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right section - image/illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="absolute inset-0 flex items-center justify-center p-10">
            <div className="max-w-lg text-center">
              <h2 className="text-3xl font-medium mb-4">Shape your future with expert guidance</h2>
              <p className="text-lg text-muted-foreground">
                Get personalized career roadmaps, course recommendations, and mentorship to achieve your goals.
              </p>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full filter blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/5 rounded-full filter blur-3xl" />
        </div>
      </div>
    </div>
  );
}
