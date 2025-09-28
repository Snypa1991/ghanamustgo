
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ride } from '@/lib/dummy-data';
import { Check, Dot, MapPin, X, Loader2, Flag } from 'lucide-react';
import { useEffect, useState } from 'react';

type TripStatus = 'none' | 'requesting' | 'enroute-to-pickup' | 'enroute-to-destination';


interface RideRequestCardProps {
    ride: Ride;
    status: TripStatus;
    onAccept: () => void;
    onDecline: () => void;
    onComplete: () => void;
    isCompleting: boolean;
}

export default function RideRequestCard({ ride, status, onAccept, onDecline, onComplete, isCompleting }: RideRequestCardProps) {
    if (status === 'requesting') {
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
                            <Flag className="text-red-500 h-5 w-5 -ml-1.5 mt-0.5"/>
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
    
    // For enroute-to-pickup and enroute-to-destination
    return (
         <Card className="shadow-2xl bg-green-50 border-green-200">
            <CardHeader>
                <CardTitle className="font-headline text-green-800">Trip Accepted</CardTitle>
                <CardDescription>En-route to pickup at {ride.startLocation}</CardDescription>
            </CardHeader>
            <CardContent>
                 {isCompleting ? (
                    <div className="flex items-center justify-center text-green-700">
                        <Loader2 className="h-6 w-6 animate-spin mr-2"/>
                        <p>Completing trip...</p>
                    </div>
                 ) : (
                    <div className="flex items-center justify-center text-green-700">
                        <Check className="h-6 w-6 mr-2"/>
                        <p>Navigating to passenger...</p>
                    </div>
                 )}
            </CardContent>
        </Card>
    );
}
