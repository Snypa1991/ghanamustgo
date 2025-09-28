
"use client";

import Image from 'next/image';
import { MapPin, Car, Package } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import RouteOptimization from '@/components/route-optimization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MopedIcon } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldCheck } from 'lucide-react';

export default function BookPage() {
  const mapImage = PlaceHolderImages.find(p => p.id === 'map-background');

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <Package className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-4xl font-bold font-headline">Book a Service</h1>
        <p className="mt-2 text-lg text-muted-foreground">Rides and deliveries, all in one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
            <Tabs defaultValue="ride" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="ride">
                        <Car className="mr-2 h-4 w-4" />
                        Book a Ride
                    </TabsTrigger>
                    <TabsTrigger value="dispatch">
                        <Package className="mr-2 h-4 w-4" />
                        Send a Package
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="ride" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Trip Details</CardTitle>
                             <CardDescription>Our AI will find the best path for you.</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <RouteOptimization />
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="dispatch" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Your Delivery Details</CardTitle>
                             <CardDescription>Secure and efficient delivery, powered by AI.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <RouteOptimization />
                        </CardContent>
                         <CardFooter>
                             <Alert>
                                <ShieldCheck className="h-4 w-4" />
                                <AlertTitle className="font-headline">Secure Payments</AlertTitle>
                                <AlertDescription>
                                    Your payment is held securely and only released to the rider upon your confirmation of successful delivery.
                                </AlertDescription>
                            </Alert>
                         </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Choose Vehicle</CardTitle>
                </CardHeader>
                <CardContent>
                     <RadioGroup defaultValue="okada" className="grid grid-cols-2 gap-4">
                        <div>
                            <RadioGroupItem value="okada" id="okada" className="peer sr-only" />
                            <Label
                                htmlFor="okada"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <MopedIcon className="mb-3 h-6 w-6" />
                                Motorcycle
                            </Label>
                        </div>
                         <div>
                            <RadioGroupItem value="car" id="car" className="peer sr-only" />
                            <Label
                                htmlFor="car"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <Car className="mb-3 h-6 w-6" />
                                Car
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Live Tracking</CardTitle>
            <CardDescription>Monitor your journey or package in real-time (simulation).</CardDescription>
          </CardHeader>
          <CardContent>
            {mapImage && (
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                <Image
                  src={mapImage.imageUrl}
                  alt={mapImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={mapImage.imageHint}
                />
                 <div className="absolute top-1/4 left-1/4 animate-pulse">
                    <MapPin className="h-8 w-8 text-blue-500" />
                    <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-black/50 text-white p-1 rounded">Start</span>
                    </div>
                </div>
                 <div className="absolute bottom-1/4 right-1/4 animate-pulse">
                    <MapPin className="h-8 w-8 text-green-500" />
                     <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                        <span className="text-xs bg-black/50 text-white p-1 rounded">End</span>
                    </div>
                </div>
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 animate-pulse">
                    <Car className="h-8 w-8 text-primary" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
