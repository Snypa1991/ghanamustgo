
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Ride, User } from '@/lib/dummy-data';
import { Loader2, Star, CheckCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { MopedIcon } from './icons';
import { Car } from 'lucide-react';
import { Button } from './ui/button';
import { RideReviewDialog } from './ride-review-dialog';


type BookingStep = 'confirming' | 'enroute-to-pickup' | 'enroute-to-destination' | 'completed';

interface TripStatusCardProps {
    step: BookingStep;
    driver: User | null;
    ride: Ride | null;
    onReviewAndFinish: () => void;
}

const DriverDetails = ({ driver, ride }: { driver: User | null, ride: Ride | null }) => {
    if (!driver || !ride) return null;

    return (
        <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                        <AvatarImage src={`https://picsum.photos/seed/${driver.email}/100/100`} />
                        <AvatarFallback>{driver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-bold">{driver.name}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" /> 4.9 <span className="text-gray-400">(120 trips)</span>
                        </p>
                    </div>
                </div>
                <div className="text-right">
                    {driver.role === 'biker' ? 
                        <MopedIcon className="h-10 w-10 text-primary" /> : 
                        <Car className="h-10 w-10 text-primary" />}
                     <p className="text-xs font-mono bg-primary/20 text-primary-foreground rounded px-1.5 py-0.5 mt-1 inline-block">GT-1234-24</p>
                </div>
            </div>
        </div>
    );
};

export default function TripStatusCard({ step, driver, ride, onReviewAndFinish }: TripStatusCardProps) {

    const handleReviewPublished = () => {
       // In a real app, we'd persist this. Here we just use it to enable the finish button.
       // The actual data update is handled on the book page for the simulation.
       console.log("Review submitted by passenger");
       // For this component's purpose, we can just call the finish function
       onReviewAndFinish();
    }


    if (step === 'confirming') {
        return (
            <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-center">Finding your ride...</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-8">
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                </CardContent>
                <CardFooter>
                     <p className="text-sm text-muted-foreground text-center w-full">Please wait while we connect you with a nearby driver.</p>
                </CardFooter>
            </Card>
        );
    }
    
    if (step === 'enroute-to-pickup') {
         return (
             <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-headline">Driver is on the way!</CardTitle>
                    <CardDescription>Your driver will arrive shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DriverDetails driver={driver} ride={ride} />
                </CardContent>
            </Card>
        )
    }

    if (step === 'enroute-to-destination') {
        return (
            <Card className="shadow-2xl bg-green-50 border-green-200">
                <CardHeader>
                    <CardTitle className="font-headline text-green-800">Trip in Progress</CardTitle>
                    <CardDescription className="text-green-700">Enjoy your ride to <span className="font-bold">{ride?.endLocation}</span>.</CardDescription>
                </CardHeader>
                <CardContent>
                    <DriverDetails driver={driver} ride={ride} />
                </CardContent>
            </Card>
        );
    }
    
    if (step === 'completed' && ride && driver) {
        return (
             <Card className="shadow-2xl">
                <CardHeader className="text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <CardTitle className="font-headline mt-4">Trip Completed</CardTitle>
                    <CardDescription>We hope you enjoyed your ride with {driver.name}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Total Fare</p>
                        <p className="text-3xl font-bold text-primary">GH₵{ride.fare.toFixed(2)}</p>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                   <p className="text-sm text-muted-foreground mb-2">Please rate your driver to complete the process.</p>
                    <RideReviewDialog 
                        ride={ride} 
                        otherUser={driver}
                        onReviewSubmit={handleReviewPublished}
                    >
                         <Button className="w-full">
                            <Star className="mr-2 h-4 w-4" /> Rate & Finish
                        </Button>
                    </RideReviewDialog>
                </CardFooter>
            </Card>
        )
    }

    return null;
}
