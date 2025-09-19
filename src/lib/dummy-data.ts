export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client in a real app
  role: 'customer' | 'rider' | 'admin' | 'driver' | 'vendor';
};

export const DUMMY_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Ama Customer',
    email: 'customer@example.com',
    password: 'password',
    role: 'customer',
  },
  {
    id: 'user-2',
    name: 'Kofi Rider',
    email: 'rider@example.com',
    password: 'password',
    role: 'rider',
  },
   {
    id: 'user-4',
    name: 'Adjoa Driver',
    email: 'driver@example.com',
    password: 'password',
    role: 'driver',
  },
  {
    id: 'user-5',
    name: 'Yaw Vendor',
    email: 'vendor@example.com',
    password: 'password',
    role: 'vendor',
  },
  {
    id: 'user-3',
    name: 'Esi Admin',
    email: 'admin@example.com',
    password: 'password',
    role: 'admin',
  },
];
