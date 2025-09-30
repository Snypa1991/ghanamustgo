'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GhanaMustGoIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/app-context';
import { DUMMY_USERS, User } from '@/lib/dummy-data';
import { useEffect } from 'react';
import { Loader2, User as UserIcon, Bike, Car, Store, Shield, UserPlus } from 'lucide-react';

const roleIcons: Record<User['role'], React.ReactNode> = {
    user: <UserIcon className="h-6 w-6" />,
    biker: <Bike className="h-6 w-6" />,
    driver: <Car className="h-6 w-6" />,
    vendor: <Store className="h-6 w-6" />,
    admin: <Shield className="h-6 w-6" />,
    unassigned: <UserPlus className="h-6 w-6" />,
};


export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user: loggedInUser, loading, switchUserForTesting } = useAuth();

  const redirectToDashboard = (user: User) => {
    if (user.role === 'unassigned') {
      router.push('/role-selection');
    } else if (user.role === 'admin') {
      router.push('/admin/dashboard');
    } else if (user.role === 'biker' || user.role === 'driver') {
      router.push('/dashboard');
    } else if (user.role === 'vendor') {
      router.push('/vendor/dashboard');
    } else {
      router.push('/book');
    }
  };

  useEffect(() => {
    if (!loading && loggedInUser) {
      redirectToDashboard(loggedInUser);
    }
  }, [loggedInUser, loading, router]);


  const handleLogin = (role: User['role']) => {
    const userToLogin = DUMMY_USERS.find(user => user.role === role);
    if (userToLogin) {
        switchUserForTesting(userToLogin.role).then(result => {
            if (result.success) {
                toast({
                    title: 'Logged In',
                    description: `You are now logged in as ${userToLogin.name} (${userToLogin.role}).`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Login Failed',
                    description: result.error || `Failed to log in as ${role}`
                });
            }
        });
    } else {
        toast({
            variant: 'destructive',
            title: 'Login Failed',
            description: `No dummy user found for role: ${role}`,
        });
    }
  };

  if (loading || loggedInUser) {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
            <Loader2 className="h-10 w-10 animate-spin text-primary"/>
        </div>
    );
  }

  const roles: User['role'][] = ['user', 'biker', 'driver', 'vendor', 'admin', 'unassigned'];

  return (
    <div className="flex items-center justify-center min-h-screen sm:min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <GhanaMustGoIcon className="mx-auto h-16 w-auto text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">Select a Role</CardTitle>
          <CardDescription>
            Choose a role to log in and test the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {roles.map(role => (
                    <Button 
                        key={role} 
                        onClick={() => handleLogin(role)} 
                        variant="secondary" 
                        className="h-24 flex flex-col gap-2 items-center justify-center"
                    >
                        {roleIcons[role]}
                        <span className="capitalize text-sm font-medium">{role}</span>
                    </Button>
                ))}
            </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
             <div className="text-center text-sm text-muted-foreground">
                This is a development login page for testing purposes.
              </div>
        </CardFooter>
      </Card>
    </div>
  );
}
