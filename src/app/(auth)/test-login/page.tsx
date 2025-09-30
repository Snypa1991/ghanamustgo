
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GhanaMustGoIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import { Loader2, User as UserIcon, Shield, Store, Car } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from '@/lib/dummy-data';


const testRoles: { role: User['role'], title: string, icon: React.ElementType }[] = [
    { role: 'user', title: 'User', icon: UserIcon },
    { role: 'biker', title: 'Biker', icon: Car },
    { role: 'driver', title: 'Driver', icon: Car },
    { role: 'vendor', title: 'Vendor', icon: Store },
    { role: 'admin', title: 'Admin', icon: Shield },
];


export default function TestLoginPage() {
  const { toast } = useToast();
  const { user, switchUserForTesting, loading, redirectToDashboard } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState<User['role'] | null>(null);

  useEffect(() => {
    if (!loading && user) {
       redirectToDashboard(user);
    }
  }, [user, loading, router, redirectToDashboard]);
  
  const handleLogin = async (role: User['role']) => {
    setIsSubmitting(role);
    const result = await switchUserForTesting(role);
    if (result.success) {
      toast({
        title: 'Login Successful',
        description: `Logged in as ${role}.`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.error,
      });
    }
     setIsSubmitting(null);
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
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <GhanaMustGoIcon className="mx-auto h-16 w-auto text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">Quick Test Login</CardTitle>
          <CardDescription>
            Select a role to instantly log in as a test user.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
           {testRoles.map(({ role, title, icon: Icon }) => (
                <Button 
                    key={role}
                    variant="outline"
                    className="h-20 flex-col gap-2"
                    onClick={() => handleLogin(role)}
                    disabled={!!isSubmitting}
                >
                    {isSubmitting === role ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                        <Icon className="h-6 w-6 text-primary" />
                    )}
                    <span className="capitalize">{title}</span>
                </Button>
           ))}
        </CardContent>
        <CardFooter className="flex-col gap-4">
            <Link href="/login" className="text-sm underline">
                Back to standard login
            </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
