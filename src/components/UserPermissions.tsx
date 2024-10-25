import React from 'react';
import { Check, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';
import { useAppContext } from '../AppContext';

const UserPermissions: React.FC = () => {
  const { theme } = useTheme();
  const { currentUser } = useAppContext();
  const allPermissions = [
    { key: 'run_scripts', label: 'הרצת סקריפטים' },
    { key: 'approve_requests', label: 'אישור בקשות' },
    { key: 'rerun_scripts', label: 'הרצה חוזרת של סקריפטים' }
  ];

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-text">הרשאות משתמש</h2>
      <p className="mb-2 text-text">
        <strong>שם:</strong> {currentUser.name}
      </p>
      <p className="mb-4 text-text">
        <strong>תפקיד:</strong> {currentUser.role === 'admin' ? 'מנהל' : 'משתמש'}
      </p>
      <ul>
        {allPermissions.map((permission) => (
          <li key={permission.key} className="flex items-center mb-2 text-text">
            {currentUser.permissions.includes(permission.key) ? (
              <Check className="text-success ml-2" size={20} />
            ) : (
              <X className="text-error ml-2" size={20} />
            )}
            {permission.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserPermissions;