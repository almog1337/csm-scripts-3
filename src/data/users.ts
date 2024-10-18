import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'משתמש מנהל',
    role: 'admin',
    permissions: ['run_scripts', 'approve_requests'],
  },
  {
    id: '2',
    name: 'משתמש רגיל',
    role: 'user',
    permissions: ['run_scripts'],
  },
];