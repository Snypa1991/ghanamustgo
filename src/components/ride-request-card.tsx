
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ride } from '@/lib/dummy-data';
import { Check, Dot, MapPin, X, Loader2 } from 'lucide-react';

interface RideRequestCardProps {
    ride: Ride;
    status: 'requesting' | 'accepted';
    onAccept: () => void;
    onDecline: () => void;
}

export default function RideRequestCard({ ride, status, onAccept, onDecline }: RideRequestCardProps) {
    if (status === 'accepted') {
        return (
             <Card className="shadow-2xl bg-green-50 border-green-200">
                <CardHeader>
                    <CardTitle className="font-headline text-green-800">Trip in Progress</CardTitle>
                    <CardDescription>Heading to {ride.endLocation}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center text-green-700">
                        <Loader2 className="h-6 w-6 animate-spin mr-2"/>
                        <p>Completing trip...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="shadow-2xl animate-in fade-in-0 zoom-in-95">
            <CardHeader>
                <CardTitle className="font-headline text-2xl">New Ride Request</CardTitle>
                <div className="flex items-center justify-between pt-2">
                    <CardDescription>A new trip is available nearby.</CardDescription>
                    <p className="text-2xl font-bold text-primary">${ride.fare.toFixed(2)}</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-sm space-y-2 pl-2 relative">
                    <div className="absolute left-[1px] top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
                    <div className="flex items-start gap-2">
                        <MapPin className="text-primary h-5 w-5 -ml-1.5 mt-0.5"/>
                        <span className="font-medium">From:</span> {ride.startLocation}
                    </div>
                    <div className="flex items-start gap-2">
                        <Dot className="text-red-500 h-8 w-8 -ml-3 -mt-1.5"/>
                        <span className="font-medium">To:</span> {ride.endLocation}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="grid grid-cols-2 gap-4">
                <Button variant="outline" size="lg" onClick={onDecline}>
                    <X className="mr-2 h-4 w-4" /> Decline
                </Button>
                <Button size="lg" onClick={onAccept} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                    <Check className="mr-2 h-4 w-4" /> Accept
                </Button>
            </CardFooter>
        </Card>
    );
}
