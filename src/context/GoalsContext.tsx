// contexts/GoalsContext.tsx
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';

type Task = {
  id: string;
  label: string;
  checked: boolean;
};

type Goal = {
  id: number;
  title: string;
  description: string;
  tasks: Task[];
};

type GoalsContextType = {
  goals: Goal[];
  toggleTask: (goalId: number, taskId: string) => void;
  addGoal: (goal: Goal) => void;
};

const GoalsContext = createContext<GoalsContextType>({} as GoalsContextType);

export const GoalsProvider = ({ children }: { children: ReactNode }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) return JSON.parse(savedGoals);
    
    // Default goals for new users
    return [
      {
        id: 1,
        title: "Web Development",
        description: "Become a full-stack web developer",
        tasks: [
          { id: "task-1", label: "Learn HTML & CSS basics", checked: false },
          { id: "task-2", label: "Complete JavaScript fundamentals", checked: false },
          { id: "task-3", label: "Build a React project", checked: false },
          { id: "task-4", label: "Learn Node.js and Express", checked: false },
        ],
      },
      {
        id: 2,
        title: "Data Science",
        description: "Master data analysis and machine learning",
        tasks: [
          { id: "ds-task-1", label: "Learn Python basics", checked: false },
          { id: "ds-task-2", label: "Complete data visualization course", checked: false },
          { id: "ds-task-3", label: "Study statistics fundamentals", checked: false },
          { id: "ds-task-4", label: "Build ML models with scikit-learn", checked: false },
        ],
      },
    ];
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const toggleTask = (goalId: number, taskId: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => 
        goal.id === goalId ? {
          ...goal,
          tasks: goal.tasks.map(task => 
            task.id === taskId ? { ...task, checked: !task.checked } : task
          )
        } : goal
      )
    );
  };

  const addGoal = (goal: Goal) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now() }]);
  };

  return (
    <GoalsContext.Provider value={{ goals, toggleTask, addGoal }}>
      {children}
    </GoalsContext.Provider>
  );
};

export const useGoals = () => useContext(GoalsContext);