import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Script, ScriptExecution } from './types';
import { users } from './data/users';
import { scripts as initialScripts } from './data/scripts';

interface AppContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  scripts: Script[];
  setScripts: (scripts: Script[]) => void;
  executions: ScriptExecution[];
  setExecutions: (executions: ScriptExecution[]) => void;
  addExecution: (execution: ScriptExecution) => void;
  updateExecution: (executionId: string, updates: Partial<ScriptExecution>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : users[0];
  });
  
  const [scripts, setScripts] = useState<Script[]>(initialScripts);
  const [executions, setExecutions] = useState<ScriptExecution[]>(() => {
    const savedExecutions = localStorage.getItem('scriptExecutions');
    return savedExecutions ? JSON.parse(savedExecutions) : [];
  });

  // Save current user to localStorage
  useEffect(() => {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  // Save executions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('scriptExecutions', JSON.stringify(executions));
  }, [executions]);

  const addExecution = (execution: ScriptExecution) => {
    setExecutions(prev => {
      const newExecutions = [...prev, execution];
      localStorage.setItem('scriptExecutions', JSON.stringify(newExecutions));
      return newExecutions;
    });
  };

  const updateExecution = (executionId: string, updates: Partial<ScriptExecution>) => {
    setExecutions(prev => {
      const newExecutions = prev.map(exe => 
        exe.id === executionId ? { ...exe, ...updates } : exe
      );
      localStorage.setItem('scriptExecutions', JSON.stringify(newExecutions));
      return newExecutions;
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      scripts,
      setScripts,
      executions,
      setExecutions,
      addExecution,
      updateExecution
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};