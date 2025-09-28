
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Should not be sent to client in a real app
  role: 'user' | 'biker' | 'admin' | 'driver' | 'vendor' | 'unassigned';
};

export const DUMMY_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Ama User',
    email: 'user@example.com',
    password: 'password',
    role: 'user',
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


export type Ride = {
  id: string;
  userId: string;
  driverId: string;
  startLocation: string;
  endLocation: string;
  fare: number;
  date: string;
  status: 'completed' | 'cancelled';
};


export let DUMMY_RIDES: Ride[] = [
  {
    id: 'ride-1',
    userId: 'user-1',
    driverId: 'user-2', // Kofi Biker
    startLocation: 'Accra Mall',
    endLocation: 'East Legon, American House',
    fare: 15.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    status: 'completed',
  },
  {
    id: 'ride-2',
    userId: 'user-1',
    driverId: 'user-4', // Adjoa Driver
    startLocation: 'Labadi Beach',
    endLocation: 'Osu Oxford Street',
    fare: 25.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    status: 'completed',
  },
    {
    id: 'ride-3',
    userId: 'user-6',
    driverId: 'user-2', // Kofi Biker
    startLocation: 'University of Ghana',
    endLocation: 'A&C Mall',
    fare: 12.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    status: 'completed',
  },
   {
    id: 'ride-4',
    userId: 'user-1',
    driverId: 'user-2', // Kofi Biker
    startLocation: 'Kotoka International Airport',
    endLocation: 'Movenpick Ambassador Hotel',
    fare: 30.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    status: 'cancelled',
  },
  {
    id: 'ride-5',
    userId: 'user-6',
    driverId: 'user-4', // Adjoa Driver
    startLocation: 'Independence Square',
    endLocation: 'Jamestown Lighthouse',
    fare: 10.00,
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: 'completed',
  },
];
