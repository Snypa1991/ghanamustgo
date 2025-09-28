
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GhanaMustGoIcon } from '@/components/icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/app-context';
import { DUMMY_USERS } from '@/lib/dummy-data';

const formSchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(1, 'Password is required.'),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: LoginFormValues) {
    const user = DUMMY_USERS.find(
      (u) => u.email === values.email && u.password === values.password
    );

    if (user) {
      login(user);
      toast({
        title: 'Login Successful',
        description: `Akwaaba, ${user.name}!`,
      });
      if (user.role === 'unassigned') {
        router.push('/role-selection');
      } else if (user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/profile');
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: 'Invalid email or password.',
      });
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <GhanaMustGoIcon className="mx-auto h-16 w-auto text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">Akwaaba</CardTitle>
          <CardDescription>
            Sign in to continue your journey.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="customer@example.com" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                Sign In
              </Button>
              <div className="text-center text-sm">
                Don't have an account?{' '}
                <Link href="/signup" className="underline text-primary hover:text-primary/80">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Form>
        <CardContent>
            <div className="text-center text-xs text-muted-foreground mb-2">Quick Logins</div>
            <div className="flex justify-center flex-wrap gap-2 text-sm">
                <Button variant="outline" size="sm" onClick={() => {
                    form.setValue('email', 'new@example.com');
                    form.setValue('password', 'password');
                }}>New User</Button>
                <Button variant="outline" size="sm" onClick={() => {
                    form.setValue('email', 'customer@example.com');
                    form.setValue('password', 'password');
                }}>Customer</Button>
                <Button variant="outline" size="sm" onClick={() => {
                    form.setValue('email', 'biker@example.com');
                    form.setValue('password', 'password');
                }}>Biker</Button>
                 <Button variant="outline" size="sm" onClick={() => {
                    form.setValue('email', 'driver@example.com');
                    form.setValue('password', 'password');
                }}>Driver</Button>
                <Button variant="outline" size="sm" onClick={() => {
                    form.setValue('email', 'vendor@example.com');
                    form.setValue('password', 'password');
                }}>Vendor</Button>
                 <Button variant="outline" size="sm" onClick={() => {
                    form.setValue('email', 'admin@example.com');
                    form.setValue('password', 'password');
                }}>Admin</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
