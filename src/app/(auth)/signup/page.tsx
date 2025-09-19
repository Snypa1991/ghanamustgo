import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MopedIcon } from '@/components/icons';

export default function SignupPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)] py-12 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <MopedIcon className="mx-auto h-10 w-10 text-primary" />
          <CardTitle className="mt-4 font-headline text-2xl">Create an Account</CardTitle>
          <CardDescription>Join the Ghana Must Go community</CardDescription>
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
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>Create Account</Button>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline text-primary hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
