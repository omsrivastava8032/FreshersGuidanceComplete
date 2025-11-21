import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Laptop, 
  GraduationCap, 
  Award, 
  MapPin, 
  Video, 
  Briefcase, 
  Globe, 
  LogOut, 
  Crown, 
  Menu, 
  User,
  Shield,
  Users,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  icon: React.ElementType;
  premium?: boolean;
  adminOnly?: boolean;
};

const userNavItems: NavItem[] = [
  { label: 'My Dashboard', href: '/dashboard', icon: Laptop },
  { label: 'My Learning Goals', href: '/goals', icon: MapPin },
  { label: 'Courses', href: '/courses', icon: GraduationCap },
  { label: 'Certifications', href: '/certificates', icon: Award },
  { label: 'Mentorship', href: '/guidance', icon: Video, premium: true },
  { label: 'Internships', href: '/internships', icon: Briefcase, premium: true },
  { label: 'University Programs', href: '/university', icon: Globe, premium: true },
  { label: 'Support', href: '/support', icon: HelpCircle },
];

const adminNavItems: NavItem[] = [
  { label: 'Admin Dashboard', href: '/admin', icon: Shield },
  { label: 'User Management', href: '/admin/users', icon: Users },
  { label: 'Support Management', href: '/admin/support', icon: HelpCircle },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pageTransitioning, setPageTransitioning] = useState(false);

  useEffect(() => {
    setPageTransitioning(true);
    const timer = setTimeout(() => setPageTransitioning(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleNav = (href: string) => {
    navigate(href);
  };

  const navItems = user?.role === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="flex h-screen overflow-hidden bg-background">
     
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 transform bg-white/90 backdrop-blur-lg",
          "border-r border-border shadow-subtle transition-transform duration-300 ease-in-out",
          "lg:relative lg:translate-x-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center h-16 px-6 border-b">
            <span className="text-xl font-medium">IT Career Guidance</span>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3",
                      location.pathname === item.href && "bg-accent"
                    )}
                    onClick={() => handleNav(item.href)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                    {item.premium && (
                      <Crown className="h-3 w-3 ml-auto text-yellow-500" />
                    )}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-destructive hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 flex items-center justify-between px-6 border-b bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-medium hidden sm:block">
              {navItems.find(item => item.href === location.pathname)?.label || 'Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === 'admin' ? (
              <div className="flex items-center text-blue-500 gap-1 px-3 py-1 bg-blue-50 rounded-full text-sm">
                <Shield className="w-3 h-3" />
                <span className="font-medium">Admin</span>
              </div>
            ) : user?.premium ? (
              <div className="flex items-center text-amber-500 gap-1 px-3 py-1 bg-amber-50 rounded-full text-sm">
                <Crown className="w-3 h-3" />
                <span className="font-medium">Premium</span>
              </div>
            ) : (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                onClick={() => navigate('/payment')}
              >
                <Crown className="w-4 h-4 mr-2" />
                Go Premium
              </Button>
            )}
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="hidden sm:block">
                  <p className="font-medium truncate text-sm">{user?.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-secondary"
                onClick={() => logout()}
              >
                <LogOut className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </header>
        
        <main className={cn(
          "flex-1 overflow-y-auto p-6 transition-opacity duration-300",
          pageTransitioning ? "opacity-0" : "opacity-100"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}