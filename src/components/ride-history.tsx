
"use client";

import React, { useState } from 'react';
import { useAuth } from '@/context/app-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DUMMY_RIDES, DUMMY_USERS, Ride } from '@/lib/dummy-data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Car, Dot, History, Moped, Star } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';
import RideReviewDialog from './ride-review-dialog';

export default function RideHistory() {
  const { user } = useAuth();
  const [historyKey, setHistoryKey] = useState(Date.now()); // Used to force re-render

  if (!user) {
    return null;
  }

  const isPartner = user.role === 'biker' || user.role === 'driver';

  // We need to re-filter rides inside the component to get the latest data
  const userRides = DUMMY_RIDES.filter(ride => 
    isPartner ? ride.driverId === user.id : ride.userId === user.id
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const getPartnerOrRider = (ride: typeof DUMMY_RIDES[0]) => {
      const targetId = isPartner ? ride.userId : ride.driverId;
      return DUMMY_USERS.find(u => u.id === targetId);
  }

  const handleReviewPublished = (rideId: string, rating: number, review: string) => {
    const rideIndex = DUMMY_RIDES.findIndex(r => r.id === rideId);
    if (rideIndex !== -1) {
        DUMMY_RIDES[rideIndex].rating = rating;
        DUMMY_RIDES[rideIndex].review = review;
        DUMMY_RIDES[rideIndex].reviewBy = isPartner ? 'partner' : 'rider';
        setHistoryKey(Date.now()); // Force re-render
    }
  }

  if (userRides.length === 0) {
      return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><History /> Ride History</CardTitle>
                <CardDescription>Your past trips will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                    You have no ride history yet.
                </div>
            </CardContent>
        </Card>
      );
  }

  return (
    <Card key={historyKey}>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><History /> Ride History</CardTitle>
        <CardDescription>A record of your recent trips.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {userRides.map(ride => {
                const otherUser = getPartnerOrRider(ride);
                const partnerRole = DUMMY_USERS.find(u => u.id === ride.driverId)?.role;
                const canReview = ride.status === 'completed' && (!ride.reviewBy || ride.reviewBy !== (isPartner ? 'partner' : 'rider'));

                return (
                    <div key={ride.id} className="p-4 rounded-lg border flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-grow space-y-3">
                            <div className="flex items-center gap-2">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={`https://picsum.photos/seed/${otherUser?.email}/100/100`} />
                                    <AvatarFallback>{otherUser?.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{otherUser?.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(new Date(ride.date), "PPP")}
                                    </p>
                                </div>
                            </div>
                            <div className="text-sm space-y-1 pl-2 relative">
                                <div className="absolute left-[1px] top-2 bottom-2 w-0.5 bg-border -translate-x-1/2"></div>
                                <div className="flex items-start gap-2">
                                    <Dot className="text-primary h-6 w-6 -ml-2 -mt-0.5"/>
                                    <span className="font-medium">From:</span> {ride.startLocation}
                                </div>
                                <div className="flex items-start gap-2">
                                    <Dot className="text-red-500 h-6 w-6 -ml-2 -mt-0.5"/>
                                    <span className="font-medium">To:</span> {ride.endLocation}
                                </div>
                            </div>
                            
                            {ride.review && (
                                <div className="pt-2 text-sm italic border-t mt-3">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("h-4 w-4", (ride.rating || 0) > i ? "text-yellow-400 fill-yellow-400" : "text-gray-300")} />
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground">"{ride.review}"</p>
                                    <p className="text-xs text-right font-semibold"> - {ride.reviewBy === (isPartner ? 'partner' : 'rider') ? "You" : otherUser?.name}</p>
                                </div>
                            )}

                        </div>
                        <div className="text-right space-y-2 flex-shrink-0 sm:w-48 flex flex-col items-end">
                           <div className="flex items-center justify-end gap-2">
                               {partnerRole === 'biker' ? <Moped className="h-5 w-5 text-muted-foreground" /> : <Car className="h-5 w-5 text-muted-foreground" />}
                                <p className="font-bold text-xl">${ride.fare.toFixed(2)}</p>
                            </div>
                            <Badge
                                variant={ride.status === 'completed' ? 'default' : 'destructive'}
                                className={cn('capitalize self-end', ride.status === 'completed' && 'bg-green-100 text-green-800 border-green-200')}
                            >
                                {ride.status}
                            </Badge>
                            {canReview && (
                                <RideReviewDialog 
                                    ride={ride} 
                                    otherUser={otherUser!} 
                                    onReviewPublished={handleReviewPublished}
                                />
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
      </CardContent>
    </Card>
  );
}
