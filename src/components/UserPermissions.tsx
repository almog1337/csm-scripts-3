import React from 'react';
import { User } from '../types';
import { Check, X } from 'lucide-react';
import { useTheme } from '../ThemeContext';

interface UserPermissionsProps {
  user: User;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ user }) => {
  const { theme } = useTheme();
  const allPermissions = [
    { key: 'run_scripts', label: 'הרצת סקריפטים' },
    { key: 'approve_requests', label: 'אישור בקשות' }
  ];

  return (
    <div className="bg-background p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-text">הרשאות משתמש</h2>
      <p className="mb-2 text-text">
        <strong>שם:</strong> {user.name}
      </p>
      <p className="mb-4 text-text">
        <strong>תפקיד:</strong> {user.role === 'admin' ? 'מנהל' : 'משתמש'}
      </p>
      <ul>
        {allPermissions.map((permission) => (
          <li key={permission.key} className="flex items-center mb-2 text-text">
            {user.permissions.includes(permission.key) ? (
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