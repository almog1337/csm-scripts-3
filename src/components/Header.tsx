import React from 'react';
import { FileText, Grid, List, PlusCircle, UserCheck } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../ThemeContext';
import { useAppContext } from '../AppContext';

type ViewMode = 'combined' | 'dashboard' | 'creation' | 'permissions';

interface HeaderProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const Header: React.FC<HeaderProps> = ({ viewMode, setViewMode }) => {
  const { theme } = useTheme();
  const { currentUser, setCurrentUser } = useAppContext();

  const handleUserChange = (userId: string) => {
    const user = userId === '1' 
      ? { id: '1', name: 'משתמש מנהל', role: 'admin' as const, permissions: ['run_scripts', 'approve_requests', 'rerun_scripts'] }
      : { id: '2', name: 'משתמש רגיל', role: 'user' as const, permissions: ['run_scripts'] };
    setCurrentUser(user);
  };

  return (
    <header className="bg-primary text-accent2 p-4 sticky top-0 z-50 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <FileText size={24} className="ml-2 rtl-mirror text-accent2" />
          <h1 className="text-2xl font-bold">סקריפטים CSM</h1>
        </div>
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button
            onClick={() => setViewMode('combined')}
            className={`p-2 rounded ${viewMode === 'combined' ? 'bg-secondary text-primary' : 'text-accent2'}`}
            title="תצוגה משולבת"
          >
            <Grid size={20} />
          </button>
          <button
            onClick={() => setViewMode('dashboard')}
            className={`p-2 rounded ${viewMode === 'dashboard' ? 'bg-secondary text-primary' : 'text-accent2'}`}
            title="לוח בקרה"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => setViewMode('creation')}
            className={`p-2 rounded ${viewMode === 'creation' ? 'bg-secondary text-primary' : 'text-accent2'}`}
            title="יצירת סקריפט"
          >
            <PlusCircle size={20} />
          </button>
          <button
            onClick={() => setViewMode('permissions')}
            className={`p-2 rounded ${viewMode === 'permissions' ? 'bg-secondary text-primary' : 'text-accent2'}`}
            title="הרשאות משתמש"
          >
            <UserCheck size={20} />
          </button>
          <div className="flex items-center">
            <select
              value={currentUser.id}
              onChange={(e) => handleUserChange(e.target.value)}
              className="bg-background text-primary p-1 rounded mr-2 border border-accent3"
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