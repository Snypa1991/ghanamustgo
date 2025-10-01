'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GhanaMustGoIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import { useToast } from '@/hooks/use-toast';
import { DUMMY_USERS } from '@/lib/dummy-data';
import { Loader2, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, switchUserForTesting } = useAuth();

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDummy = DUMMY_USERS.some(user => user.email === email && user.password);
    
    if (isDummy) {
      handleDummyLogin();
    } else {
      setStep(2);
    }
  };

  const handleDummyLogin = async () => {
    setIsLoading(true);
    const dummyUser = DUMMY_USERS.find(user => user.email === email);
    if(dummyUser) {
        const result = await switchUserForTesting(dummyUser.role);
        if (!result.success) {
            toast({
                variant: 'destructive',
                title: 'Login Failed',
                description: result.error,
            });
            setIsLoading(false);
        }
        // Success will trigger redirection via AuthContext effect
    }
  };


  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await login(email, password);

    if (result.success) {
      toast({
        title: 'Login Successful',
        description: 'You are now logged in.',
      });
      // Redirect is handled by the auth context
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.error,
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <GhanaMustGoIcon className="mx-auto h-16 w-auto text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">
            {step === 1 ? 'Sign In' : 'Enter Password'}
          </CardTitle>
          <CardDescription>
            {step === 1 ? "Enter your email to continue." : `Signing in as ${email}`}
          </CardDescription>
        </CardHeader>

        {step === 1 ? (
          <form onSubmit={handleEmailSubmit}>
            <CardContent>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="okada@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading || !email}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                Continue
              </Button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handlePasswordSubmit}>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
               <Button variant="link" onClick={() => { setStep(1); setPassword(''); }}>
                Back to email
              </Button>
            </CardFooter>
          </form>
        )}

        <CardFooter className="flex-col gap-4 border-t pt-6">
            <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                    Sign up
                </Link>
            </div>
             <div className="text-center text-sm">
                Or use the{' '}
                <Link href="/test-login" className="underline text-primary hover:text-primary/80">
                    Quick Test Login
                </Link>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
