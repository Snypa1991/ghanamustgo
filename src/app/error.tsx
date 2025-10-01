"use client";

import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
    return (
        <div className="container mx-auto flex h-full flex-col items-center justify-center text-center py-12">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl font-headline text-destructive">
                Oops! Something went wrong.
            </h1>
            <p className="mt-4 max-w-2xl text-lg sm:text-xl text-muted-foreground">
                {error.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="mt-8">
                <Button size="lg" onClick={() => reset()}>
                    Try Again
                </Button>
            </div>
        </div>
    );
}