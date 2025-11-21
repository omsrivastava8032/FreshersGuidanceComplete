// types.ts
export type GoalRequest = {
    id: string;
    title: string;
    description: string;
    userId: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
  };
  
  export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
    premium: boolean;
    createdAt: string;
    goals: any[];
    class10Percentage: string;
    class12Percentage: string;
    board: string;
    branch: string;
    college: string;
    degree: string;
  };