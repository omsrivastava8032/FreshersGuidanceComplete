import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "sonner";
import api from '@/lib/api';

export type SupportTicket = {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
};

export type LearningGoal = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'rejected';
  progress?: number;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  targetDate?: string;
  category: string;
  priority: 'low' | 'medium' | 'high';
  tasks: Array<{
    id: string;
    label: string;
    checked: boolean;
  }>;
};

export type Course = {
  id: string;
  title: string;
  provider: string;
  status: 'in_progress' | 'completed';
  progress?: number;
  startedAt: string;
  completedAt?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  premium: boolean;
  lastLogin?: string;
  emailVerified: boolean;
  createdAt: string;
  // These arrays are now managed by their own components fetching from API
  // Keeping them in type for now to avoid breaking changes, but they will be empty in context
  goals: LearningGoal[];
  learningGoals: LearningGoal[];
  courses: Course[];
  supportTickets: SupportTicket[];
  class10Percentage?: string;
  class12Percentage?: string;
  board?: string;
  branch?: string;
  college?: string;
  degree?: string;
  preferences: {
    notifications: boolean;
    emailUpdates: boolean;
    theme: string;
  };
  academicInfo: {
    university: string;
    major: string;
    graduationYear: string;
    gpa: string;
  };
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, academicDetails: {
    class10Percentage: string;
    class12Percentage: string;
    board: string;
    branch: string;
    college: string;
    degree: string;
  }) => Promise<void>;
  logout: () => void;
  updateUserPremium: (premium: boolean) => void;
  updateUserData: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const { token } = JSON.parse(storedUser);
          if (token) {
            // Verify token and get latest user data
            const { data } = await api.get('/auth/me');
            // Map backend user to frontend user type
            setUser({
              ...data,
              id: data._id,
              goals: [], // These should be fetched by components
              learningGoals: [],
              courses: [],
              supportTickets: []
            });
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });

      localStorage.setItem('user', JSON.stringify({ token: data.token }));

      setUser({
        ...data,
        id: data._id,
        goals: [],
        learningGoals: [],
        courses: [],
        supportTickets: []
      });

      toast.success(`Welcome back, ${data.name}!`);
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.response?.data?.message || "Invalid credentials",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    academicDetails: {
      class10Percentage: string;
      class12Percentage: string;
      board: string;
      branch: string;
      college: string;
      degree: string;
    }
  ) => {
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email,
        password,
        academicDetails
      });

      localStorage.setItem('user', JSON.stringify({ token: data.token }));

      setUser({
        ...data,
        id: data._id,
        goals: [],
        learningGoals: [],
        courses: [],
        supportTickets: []
      });

      toast.success("Registration successful!", {
        description: `Welcome ${name}, your account has been created`,
      });
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.response?.data?.message || "Please check your information",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success("Logged out successfully");
  };

  const updateUserPremium = (premium: boolean) => {
    // This should ideally call an API endpoint
    if (user) {
      setUser({ ...user, premium });
      toast.success(premium ? "🎉 Premium unlocked!" : "Premium status updated");
    }
  };

  const updateUserData = (updatedUser: User) => {
    // This is kept for compatibility but should be replaced by specific API calls in components
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        updateUserPremium,
        updateUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};