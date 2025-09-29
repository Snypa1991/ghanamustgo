
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GhanaMustGoIcon, MopedIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import { DUMMY_USERS, User as UserType } from '@/lib/dummy-data';
import { Loader2, User, Car, Store, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Role = 'user' | 'biker' | 'driver' | 'vendor' | 'admin';

const roles: {name: Role, title: string, description: string, icon: React.ElementType, user: UserType | undefined}[] = [
    {
        name: 'user',
        title: 'User',
        description: 'Book rides and shop.',
        icon: User,
        user: DUMMY_USERS.find(u => u.role === 'user')
    },
    {
        name: 'biker',
        title: 'Biker',
        description: 'Offer okada & dispatch.',
        icon: MopedIcon,
        user: DUMMY_USERS.find(u => u.role === 'biker')
    },
    {
        name: 'driver',
        title: 'Driver',
        description: 'Offer taxi rides.',
        icon: Car,
        user: DUMMY_USERS.find(u => u.role === 'driver')
    },
    {
        name: 'vendor',
        title: 'Vendor',
        description: 'Sell on the marketplace.',
        icon: Store,
        user: DUMMY_USERS.find(u => u.role === 'vendor')
    },
    {
        name: 'admin',
        title: 'Admin',
        description: 'Manage the platform.',
        icon: Shield,
        user: DUMMY_USERS.find(u => u.role === 'admin')
    }
];

export default function LoginPage() {
  const { toast } = useToast();
  const { user, loading, switchUserForTesting } = useAuth();
  const router = useRouter();

  // Redirect if user is ALREADY logged in and not loading.
  useEffect(() => {
    if (!loading && user) {
       if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (user.role === 'biker' || user.role === 'driver') {
        router.push('/dashboard');
      } else if (user.role === 'vendor') {
        router.push('/vendor/dashboard');
      } else if (user.role === 'user') {
        router.push('/book');
      } else if (user.role === 'unassigned') {
        router.push('/role-selection');
      }
    }
  }, [user, loading, router]);
  
  const handleTestUserLogin = async (testUser: UserType) => {
    toast({
      title: 'Switching User...',
      description: `Logging in as ${testUser.name} (${testUser.role})`,
    });
    await switchUserForTesting(testUser);
  };

  if (loading || user) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary"/>
        </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <GhanaMustGoIcon className="mx-auto h-16 w-auto text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">Akwaaba</CardTitle>
          <CardDescription>
            Choose a test account to log in.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              role.user && (
                <button
                    key={role.name}
                    onClick={() => handleTestUserLogin(role.user!)}
                    className="text-left border p-4 rounded-lg hover:bg-accent/50 hover:border-primary transition-all flex items-start space-x-4"
                    disabled={loading}
                >
                    <role.icon className="h-8 w-8 text-primary mt-1" />
                    <div>
                        <p className="font-bold text-lg">{role.title}</p>
                        <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                </button>
              )
            ))}
        </CardContent>
         <CardContent className="text-center text-sm pt-6">
            <p>
                Need to create a new account?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                  Sign up here
                </Link>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
