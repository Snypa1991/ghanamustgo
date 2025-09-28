
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client in a real app
  role: 'personal' | 'biker' | 'admin' | 'driver' | 'vendor' | 'unassigned';
};

export const DUMMY_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Ama Personal',
    email: 'personal@example.com',
    password: 'password',
    role: 'personal',
  },
  {
    id: 'user-2',
    name: 'Kofi Biker',
    email: 'biker@example.com',
    password: 'password',
    role: 'biker',
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
   {
    id: 'user-6',
    name: 'New User',
    email: 'new@example.com',
    password: 'password',
    role: 'unassigned',
  },
];

export type Bid = {
  id: string;
  itemId: string;
  userId: string;
  amount: number;
  timestamp: string;
};

export const DUMMY_BIDS: Bid[] = [
    { id: 'bid-1', itemId: '1', userId: 'user-2', amount: 155, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: 'bid-2', itemId: '1', userId: 'user-3', amount: 160, timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
    { id: 'bid-3', itemId: '1', userId: 'user-1', amount: 165, timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
    { id: 'bid-4', itemId: '2', userId: 'user-1', amount: 48, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
    { id: 'bid-5', itemId: '2', userId: 'user-4', amount: 50, timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
];
