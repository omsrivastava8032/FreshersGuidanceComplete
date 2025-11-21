// contexts/AuthContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  premium: boolean;
  createdAt: string;
  class10Percentage: string;
  class12Percentage: string;
  board: string;
  branch: string;
  college: string;
  degree: string;
  goals: any[];
};

type AuthContextType = {
  user: User | null;
  allUsers: User[];
  login: (email: string, password: string) => void;
  logout: () => void;
  register: (
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
  ) => void;
  updateUserData: (updatedUser: User) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    const initializeUsers = () => {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Add default admin if missing
      if (!storedUsers.some((u: User) => u.role === 'admin')) {
        const adminUser: User = {
          id: 'admin_001',
          name: 'Admin',
          email: 'admin@example.com',
          password: 'admin123',
          role: 'admin',
          premium: true,
          createdAt: new Date().toISOString(),
          class10Percentage: '0',
          class12Percentage: '0',
          board: 'Other',
          branch: 'Other',
          college: 'Admin College',
          degree: 'Other',
          goals: []
        };
        storedUsers.push(adminUser);
      }

      // Add test user if missing
      if (!storedUsers.some((u: User) => u.email === 'user@example.com')) {
        const testUser: User = {
          id: 'user_001',
          name: 'Test User',
          email: 'user@example.com',
          password: 'userpass',
          role: 'user',
          premium: false,
          createdAt: new Date().toISOString(),
          class10Percentage: '85',
          class12Percentage: '78',
          board: 'CBSE',
          branch: 'Science',
          college: 'Test University',
          degree: 'B.Tech',
          goals: []
        };
        storedUsers.push(testUser);
      }

      localStorage.setItem('users', JSON.stringify(storedUsers));
      setAllUsers(storedUsers);
    };

    initializeUsers();
  }, []);

  const login = (email: string, password: string) => {
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find(u => u.email === email);

    if (!foundUser) throw new Error('User not found - please register first');
    if (foundUser.password !== password) throw new Error('Invalid credentials');

    setUser(foundUser);
  };

  const register = (
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
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
      throw new Error('Email already registered');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      password,
      role: 'user',
      premium: false,
      createdAt: new Date().toISOString(),
      goals: [],
      ...academicDetails
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    setUser(newUser);
  };

  const updateUserData = (updatedUser: User) => {
    const updatedUsers = allUsers.map(u => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setAllUsers(updatedUsers);
    if (user?.id === updatedUser.id) setUser(updatedUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      allUsers,
      login, 
      logout, 
      register,
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);