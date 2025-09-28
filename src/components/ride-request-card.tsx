
"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ride, User, DUMMY_USERS } from '@/lib/dummy-data';
import { Check, MapPin, X, Loader2, Flag, Navigation, User as UserIcon } from 'lucide-react';
import type { TripStatus } from '@/app/dashboard/page';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';

interface RideRequestCardProps {
    ride: Ride;
    status: TripStatus;
    onAccept: () => void;
    onDecline: () => void;
    onStartTrip: () => void;
    onComplete: () => void;
    isCompleting: boolean;
}

export default function RideRequestCard({ ride, status, onAccept, onDecline, onStartTrip, onComplete, isCompleting }: RideRequestCardProps) {
    const [progress, setProgress] = useState(100);
    const [passenger, setPassenger] = useState<User | null>(null);

    useEffect(() => {
        const user = DUMMY_USERS.find(u => u.id === ride.userId) || null;
        setPassenger(user);
    }, [ride.userId]);

    useEffect(() => {
        if (status === 'requesting') {
            setProgress(100);
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev <= 0) {
                        clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 100); // Update every 100ms for a 10s timer

            return () => clearInterval(interval);
        }
    }, [status]);


    if (status === 'requesting') {
         return (
            <Card className="shadow-2xl animate-in fade-in-0 zoom-in-95">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">New Ride Request</CardTitle>
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            {passenger && (
                                <>
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={`https://picsum.photos/seed/${passenger.email}/100/100`} />
                                        <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold">{passenger.name}</p>
                                        <p className="text-xs text-muted-foreground">New Request</p>
                                    </div>
                                </>
                            )}
                        </div>
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
                     <Progress value={progress} className="w-full h-1 mt-4" />
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
    
    const TripDetails = () => (
        <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                     {passenger && (
                        <>
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={`https://picsum.photos/seed/${passenger.email}/100/100`} />
                                <AvatarFallback>{passenger.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-semibold">{passenger.name}</p>
                                <p className="text-xs text-muted-foreground">Passenger</p>
                            </div>
                        </>
                    )}
                </div>
                <p className="text-lg font-bold text-primary">${ride.fare.toFixed(2)}</p>
            </div>
        </div>
    );

    if (status === 'enroute-to-pickup') {
         return (
             <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-headline">En-Route to Passenger</CardTitle>
                    <CardDescription>Navigate to the pickup location at <span className="font-semibold text-foreground">{ride.startLocation}</span>.</CardDescription>
                </CardHeader>
                <CardContent>
                    <TripDetails />
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" onClick={onStartTrip} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        <Navigation className="mr-2 h-4 w-4" /> Arrived / Start Trip
                    </Button>
                </CardFooter>
            </Card>
        )
    }

    if (status === 'enroute-to-destination') {
        return (
            <Card className="shadow-2xl bg-green-50 border-green-200">
                <CardHeader>
                    <CardTitle className="font-headline text-green-800">Trip in Progress</CardTitle>
                    <CardDescription>Heading to destination at <span className="font-semibold text-green-900">{ride.endLocation}</span>.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isCompleting ? (
                        <div className="flex items-center justify-center text-green-700">
                            <Loader2 className="h-6 w-6 animate-spin mr-2"/>
                            <p>Completing trip...</p>
                        </div>
                    ) : (
                        <TripDetails />
                    )}
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" variant="destructive" onClick={onComplete} disabled={isCompleting}>
                        {isCompleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flag className="mr-2 h-4 w-4" />}
                        End Trip
                    </Button>
                </CardFooter>
            </Card>
        );
    }

    return null;
}
