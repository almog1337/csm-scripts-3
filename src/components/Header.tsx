import React from 'react';
import { User } from '../types';
import { FileText, Grid, List, PlusCircle, UserCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../ThemeContext';

interface HeaderProps {
  currentUser: User;
  onUserChange: (userId: string) => void;
  viewMode: 'combined' | 'dashboard' | 'creation' | 'permissions';
  setViewMode: (mode: 'combined' | 'dashboard' | 'creation' | 'permissions') => void;
}

const Header: React.FC<HeaderProps> = ({ currentUser, onUserChange, viewMode, setViewMode }) => {
  const { theme } = useTheme();

  return (
    <header className="bg-primary text-background p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <FileText size={24} className="ml-2 rtl-mirror" />
          <h1 className="text-2xl font-bold">סקריפטים CSM</h1>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setViewMode('combined')}
            className={`p-2 rounded ${viewMode === 'combined' ? 'bg-secondary text-primary' : ''}`}
            title="תצוגה משולבת"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`p-2 rounded ${viewMode === 'dashboard' ? 'bg-secondary text-primary' : ''}`}
            title="לוח בקרה"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode('creation')}
            className={`p-2 rounded ${viewMode === 'creation' ? 'bg-secondary text-primary' : ''}`}
            title="יצירת סקריפט"
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => setViewMode('permissions')}
            className={`p-2 rounded ${viewMode === 'permissions' ? 'bg-secondary text-primary' : ''}`}
            title="הרשאות משתמש"
          >
            <UserCheck size={20} />
          </button>
          <div className="flex items-center">
            <span className="ml-2">משתמש נוכחי:</span>
            <select
              value={currentUser.id}
              onChange={(e) => onUserChange(e.target.value)}
              className="bg-background text-primary p-1 rounded mr-2"
            >
              <option value="1">משתמש מנהל</option>
              <option value="2">משתמש רגיל</option>
            </select>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;