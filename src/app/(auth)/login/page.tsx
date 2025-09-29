
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { GhanaMustGoIcon } from '@/components/icons';
import { useAuth } from '@/context/app-context';
import { Loader2 } from 'lucide-react';
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
import { DUMMY_USERS } from '@/lib/dummy-data';

const emailSchema = z.object({
  email: z.string().email('Invalid email address.'),
});

const passwordSchema = z.object({
    password: z.string().min(1, 'Password is required.'),
});

const formSchema = emailSchema.merge(passwordSchema);

type LoginFormValues = z.infer<typeof formSchema>;


export default function LoginPage() {
  const { toast } = useToast();
  const { user, login, loading, redirectToDashboard } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submittedEmail, setSubmittedEmail] = useState('');


  useEffect(() => {
    if (!loading && user) {
       redirectToDashboard(user);
    }
  }, [user, loading, router, redirectToDashboard]);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(step === 1 ? emailSchema : formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleEmailCheck = async ({ email }: { email: string }) => {
    setIsSubmitting(true);
    
    const dummyUser = DUMMY_USERS.find(u => u.email === email && u.password);

    if (dummyUser) {
        const result = await login(email, dummyUser.password!);
        if (result.success) {
            toast({ title: 'Login Successful', description: 'Welcome back!' });
        } else {
             toast({ variant: 'destructive', title: 'Login Failed', description: result.error });
        }
    } else {
        setSubmittedEmail(email);
        setStep(2);
    }
    
    setIsSubmitting(false);
  }

  const handlePasswordLogin = async (values: LoginFormValues) => {
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

  const handleBack = () => {
    setStep(1);
    form.reset({ email: submittedEmail, password: '' });
  }

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
            {step === 1 ? "Enter your email to sign in or get started." : "Enter your password to continue."}
          </CardDescription>
        </CardHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(step === 1 ? handleEmailCheck : handlePasswordLogin)}>
                <CardContent className="grid gap-4">
                    {step === 1 ? (
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
                    ) : (
                        <>
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input 
                                      value={submittedEmail} 
                                      readOnly 
                                      disabled 
                                      onChange={(e) => {
                                        setSubmittedEmail(e.target.value);
                                        form.setValue('email', e.target.value);
                                      }}
                                  />
                                </FormControl>
                            </FormItem>
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
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex-col gap-4">
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {step === 1 ? 'Continue' : 'Sign In'}
                    </Button>
                    {step === 2 && (
                         <Button variant="link" onClick={handleBack}>
                            Back
                        </Button>
                    )}
                     <div className="text-center text-sm">
                        {step === 1 && (
                            <>
                                Don't have an account?{' '}
                                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                                Sign up here
                                </Link>
                            </>
                        )}
                    </div>
                </CardFooter>
            </form>
        </Form>
      </Card>
    </div>
  );
}
