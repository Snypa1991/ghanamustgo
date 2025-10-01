"use client";
import { useAuth } from '@/context/app-context';

export default function Home() {
  const { user } = useAuth();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2 bg-background text-foreground">
      <h1 className="text-4xl font-bold text-center">Welcome to Ghana Must Go!</h1>
      <p className="mt-4 text-lg text-center text-muted-foreground">
        The super-app for all your needs.
      </p>

      {user ? (
        <div className="mt-8 text-center">
          <p className="text-xl">Hello, {user.name}!</p>
          <p className="text-md text-muted-foreground">Your email is: {user.email}</p>
        </div>
      ) : (
        <p className="mt-8 text-lg text-center">Please log in to see your personalized content.</p>
      )}
    </main>
  );
}