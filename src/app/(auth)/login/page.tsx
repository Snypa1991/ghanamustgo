
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GhanaMustGoIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import { Loader2, TestTube } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof formSchema>;


export default function LoginPage() {
  const { toast } = useToast();
  const { user, login, loading, redirectToDashboard } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
       redirectToDashboard(user);
    }
  }, [user, loading, router, redirectToDashboard]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleLogin = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    const result = await login(values.email, values.password);
    if (result.success) {
      toast({
        title: 'Login Successful',
        description: 'Welcome back!',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: result.error || 'Please check your credentials and try again.',
      });
    }
    setIsSubmitting(false);
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
          <CardTitle className="mt-4 font-headline text-2xl">Akwaaba Back</CardTitle>
          <CardDescription>
            Enter your credentials to sign in to your account.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleLogin)}>
                <CardContent className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl><Input placeholder="user@example.com" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl><Input type="password" placeholder="••••••••" {...field} autoFocus /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Sign In
                    </Button>
                     <div className="text-center text-sm space-y-2">
                        <p>
                            Don't have an account?{' '}
                            <Link href="/signup" className="underline text-primary hover:text-primary/80">
                            Sign up here
                            </Link>
                        </p>
                        <p>
                             <Link href="/(auth)/test-login" className="text-muted-foreground underline text-xs flex items-center justify-center gap-1">
                                <TestTube className="h-3 w-3" /> Quick Test Login
                            </Link>
                        </p>
                    </div>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
