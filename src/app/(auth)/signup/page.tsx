
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MopedIcon } from '@/components/icons';
import { User, Store, Car } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

type Role = 'customer' | 'partner' | 'vendor';

const roles = [
    {
        name: 'customer',
        title: 'Customer',
        description: 'Book rides, order food, and shop.',
        icon: User,
    },
    {
        name: 'partner',
        title: 'Rider or Driver',
        description: 'Offer rides and delivery services.',
        icon: Car,
    },
    {
        name: 'vendor',
        title: 'Vendor',
        description: 'Sell food or items on the marketplace.',
        icon: Store,
    }
]

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<Role>('customer');

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        {step === 1 && (
            <>
                <CardHeader className="text-center">
                    <MopedIcon className="mx-auto h-10 w-10 text-primary" />
                    <CardTitle className="mt-4 font-headline text-2xl">Join the Community</CardTitle>
                    <CardDescription>How would you like to use our service?</CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup 
                        defaultValue="customer" 
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
                     <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }} onClick={() => setStep(2)}>
                        Continue
                    </Button>
                    <div className="text-center text-sm">
                        Already have an account?{' '}
                        <Link href="/login" className="underline text-primary hover:text-primary/80">
                        Sign in
                        </Link>
                    </div>
                </CardFooter>
            </>
        )}

        {step === 2 && (
             <>
                <CardHeader className="text-center">
                    <MopedIcon className="mx-auto h-10 w-10 text-primary" />
                    <CardTitle className="mt-4 font-headline text-2xl">Create Your Account</CardTitle>
                    <CardDescription>
                        You are signing up as a <span className="font-bold text-primary">{roles.find(r => r.name === selectedRole)?.title}</span>.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" placeholder="Ama Busia" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="okada@example.com" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required />
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Create Account</Button>
                    <Button variant="link" onClick={() => setStep(1)}>Back to role selection</Button>
                </CardFooter>
            </>
        )}

      </Card>
    </div>
  );
}
