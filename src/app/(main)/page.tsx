
"use client";
import { useAuth } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-2 bg-background text-foreground text-center">
      <h1 className="text-4xl font-bold font-headline">Welcome to Ghana Must Go!</h1>
      <p className="mt-4 text-lg max-w-2xl text-muted-foreground">
        The super-app for all your needs. This is your main dashboard after logging in. From here, you can access all services.
      </p>

      {user ? (
        <div className="mt-8">
          <p className="text-xl">Hello, <span className="font-semibold text-primary">{user.name}</span>!</p>
          <p className="text-md text-muted-foreground">You are logged in as a <span className="font-medium capitalize">{user.role}</span>.</p>
        </div>
      ) : (
         <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link href="/signup" passHref>
                <Button size="lg" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    Get Started
                </Button>
            </Link>
            <Link href="/login" passHref>
                <Button size="lg" variant="secondary">
                    Login
                </Button>
            </Link>
        </div>
      )}
    </main>
  );
}
