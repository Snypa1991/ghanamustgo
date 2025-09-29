
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { GhanaMustGoIcon } from '@/components/icons';
import { User, Store, Car } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/app-context';
import { User as UserType } from '@/lib/dummy-data';

type Role = 'user' | 'biker' | 'vendor' | 'driver';

const roles: {name: Role, title: string, description: string, icon: React.ElementType}[] = [
    {
        name: 'user',
        title: 'User',
        description: 'Book rides and shop.',
        icon: User,
    },
    {
        name: 'driver',
        title: 'Driver or Biker',
        description: 'Offer rides and delivery services.',
        icon: Car,
    },
    {
        name: 'vendor',
        title: 'Vendor/Retailer',
        description: 'Sell items on the marketplace.',
        icon: Store,
    }
];

export default function RoleSelectionPage() {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>('user');

  useEffect(() => {
    // If no user is logged in, or user already has a role, redirect them.
    if (!user || (user.role !== 'unassigned' && user.role !== 'user' && user.role !== 'driver' && user.role !== 'vendor' && user.role !== 'biker' ) ) {
      router.push('/login');
    }
  }, [user, router]);

  const handleRoleSelection = () => {
    if (user) {
        // In a real app, this would be an API call to the backend.
        let roleToSet = selectedRole;
        // The UI presents "driver" for both, but we need to know which one. For simulation, we can default to driver.
        // A real app might have a second step to differentiate.
        if (selectedRole === 'driver') {
            // This is a simplification. A real app would need a clearer way
            // to distinguish between biker and driver during role selection.
            // For now, we can just default to 'driver' or add more logic.
            // Let's assume the user can be a 'driver' and the system handles it.
        }

        const updatedUser: UserType = { ...user, role: roleToSet };
        updateUser(updatedUser);
        
        if (roleToSet === 'user') {
          router.push('/book');
        } else if (roleToSet === 'driver' || roleToSet === 'biker') {
          router.push('/dashboard');
        } else if (roleToSet === 'vendor') {
            router.push('/vendor/dashboard');
        } else {
          router.push('/profile');
        }
    }
  };

  if (!user) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
            <GhanaMustGoIcon className="mx-auto h-10 w-10 text-primary" />
            <CardTitle className="mt-4 font-headline text-2xl">Choose Your Role</CardTitle>
            <CardDescription>Welcome, {user.name}! How will you be using the app?</CardDescription>
        </CardHeader>
        <CardContent>
            <RadioGroup
                defaultValue="user"
                className="grid gap-4"
                onValueChange={(value: Role) => setSelectedRole(value)}
            >
               {roles.map((role) => (
                 <Label
                    key={role.name}
                    htmlFor={role.name}
                    className={cn(
                        "flex items-start space-x-4 rounded-md border p-4 transition-all hover:bg-accent/50",
                        selectedRole === role.name && "border-primary bg-accent/50"
                    )}
                 >
                    <RadioGroupItem value={role.name} id={role.name} className="mt-1"/>
                    <div className="flex flex-col">
                        <span className="font-semibold text-base flex items-center gap-2">
                            <role.icon className="h-5 w-5 text-primary" />
                            {role.title}
                        </span>
                        <span className="text-sm text-muted-foreground">{role.description}</span>
                    </div>
                 </Label>
               ))}
            </RadioGroup>
        </CardContent>
        <CardFooter className="flex-col gap-4">
             <Button className="w-full" onClick={handleRoleSelection}>
                Continue
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
