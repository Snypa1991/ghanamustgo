
"use client";

import { useAuth } from '@/context/app-context';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Car, History, MapPin, Store } from 'lucide-react';
import { DUMMY_RIDES, DUMMY_USERS } from '@/lib/dummy-data';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const { user } = useAuth();
  const mapBackground = PlaceHolderImages.find(p => p.id === 'map-background');

  // If user is not logged in, show the original landing page
  if (!user) {
    return (
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-2 bg-background text-foreground text-center">
        <h1 className="text-4xl font-bold font-headline">Welcome to Ghana Must Go!</h1>
        <p className="mt-4 text-lg max-w-2xl text-muted-foreground">
          The super-app for all your needs. This is your main dashboard after logging in. From here, you can access all services.
        </p>
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
      </main>
    );
  }

  // If user is logged in, show the new dashboard
  const lastRide = DUMMY_RIDES.find(ride => ride.userId === user.id && ride.status === 'completed');
  const lastDriver = lastRide ? DUMMY_USERS.find(u => u.id === lastRide.driverId) : null;

  return (
    <div className="container py-6 md:py-10">
      <div className="space-y-4 mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Hello, <span className="text-primary">{user.name}!</span>
        </h1>
        <p className="text-lg text-muted-foreground">Ready for your next move?</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Main Booking Card */}
          <Card className="overflow-hidden">
            <div className="relative h-48 md:h-64">
              {mapBackground && (
                <Image 
                  src={mapBackground.imageUrl} 
                  alt="Map background" 
                  fill 
                  className="object-cover"
                  data-ai-hint={mapBackground.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Link href="/book">
                  <Card className="shadow-lg hover:bg-muted transition-colors">
                    <CardContent className="p-4 flex items-center gap-4">
                      <MapPin className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="text-lg font-medium text-muted-foreground">Where to?</span>
                      <ArrowRight className="h-5 w-5 text-muted-foreground ml-auto" />
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </Card>

          {/* Last Ride Card */}
          {lastRide && lastDriver && (
            <Card>
              <CardHeader>
                <CardTitle className="font-headline text-xl">Your Last Ride</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${lastDriver.email}/100/100`} />
                        <AvatarFallback>{lastDriver.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{lastDriver.name}</p>
                        <p className="text-sm text-muted-foreground">{format(new Date(lastRide.date), "PPP")}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">GH₵{lastRide.fare.toFixed(2)}</p>
                    <Badge variant="secondary" className="capitalize mt-1">{lastRide.vehicleType}</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3 italic">
                  From {lastRide.startLocation} to {lastRide.endLocation}.
                </p>
              </CardContent>
              <CardFooter>
                 <Link href="/profile" className="w-full">
                    <Button variant="outline" className="w-full">
                        <History className="mr-2 h-4 w-4" />
                        View All Ride History
                    </Button>
                </Link>
              </CardFooter>
            </Card>
          )}

        </div>
        
        {/* Quick Links Card */}
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                     <Link href="/book">
                        <Button variant="secondary" className="w-full h-24 flex-col gap-2">
                            <Car className="h-6 w-6 text-primary"/>
                            <span>Book a Ride</span>
                        </Button>
                     </Link>
                     <Link href="/marketplace">
                         <Button variant="secondary" className="w-full h-24 flex-col gap-2">
                            <Store className="h-6 w-6 text-primary"/>
                            <span>Marketplace</span>
                        </Button>
                     </Link>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
