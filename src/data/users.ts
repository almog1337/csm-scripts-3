import { User } from '../types';

export const users: User[] = [
  {
    id: '1',
    name: 'משתמש מנהל',
    role: 'admin',
    permissions: ['run_scripts', 'approve_requests', 'rerun_scripts'],
  },
  {
    id: '2',
    name: 'משתמש רגיל',
    role: 'user',
    permissions: ['create_requests'],
  },
];