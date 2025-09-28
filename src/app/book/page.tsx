
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Car, Package, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import RouteOptimization from '@/components/route-optimization';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MopedIcon } from '@/components/icons';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/app-context';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Accra, Ghana coordinates
const center = {
  lat: 5.6037,
  lng: -0.1870
};

export default function BookPage() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });
  const { user } = useAuth();

  const [startLocation, setStartLocation] = useState<string>('');
  const [endLocation, setEndLocation] = useState<string>('');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);


  const handleRouteUpdate = (start: string, end: string) => {
    setStartLocation(start);
    setEndLocation(end);
    setDirections(null); // Clear previous directions
  };

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };

  const shouldRenderDirectionsService = useMemo(() => {
    return isLoaded && startLocation && endLocation && !directions;
  }, [isLoaded, startLocation, endLocation, directions]);

  const startMarkerIcon = useMemo(() => {
    if (user && isLoaded) {
      return {
        url: `https://picsum.photos/seed/${user.email}/40/40`,
        scaledSize: new google.maps.Size(40, 40),
        anchor: new google.maps.Point(20, 20),
      };
    }
    return undefined;
  }, [user, isLoaded]);


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
                             <RouteOptimization onRouteUpdate={handleRouteUpdate} />
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
                            <RouteOptimization onRouteUpdate={handleRouteUpdate} />
                        </CardContent>
                         <CardFooter>
                             <Alert>
                                <ShieldCheck className="h-4 w-4" />
                                <AlertTitle className="font-headline">Secure Payments</AlertTitle>
                                <AlertDescription>
                                    Your payment is held securely and only released to the biker upon your confirmation of successful delivery.
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
                                Okada
                            </Label>
                        </div>
                         <div>
                            <RadioGroupItem value="car" id="car" className="peer sr-only" />
                            <Label
                                htmlFor="car"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            >
                                <Car className="mb-3 h-6 w-6" />
                                Taxi
                            </Label>
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline">Live Tracking</CardTitle>
            <CardDescription>Monitor your journey or package in real-time.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                 {isLoaded ? (
                    <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={12}
                        options={{
                            streetViewControl: false,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            zoomControl: false,
                        }}
                        onLoad={onMapLoad}
                        onUnmount={onMapUnmount}
                    >
                       {shouldRenderDirectionsService && (
                          <DirectionsService
                            options={{
                              destination: endLocation,
                              origin: startLocation,
                              travelMode: google.maps.TravelMode.DRIVING,
                            }}
                            callback={directionsCallback}
                          />
                        )}

                        {directions && (
                          <DirectionsRenderer
                            options={{
                              directions: directions,
                              suppressMarkers: true, // We can use our own markers
                            }}
                          />
                        )}

                        {!directions && startLocation && <Marker position={{ lat: 5.6395, lng: -0.1719 }} icon={startMarkerIcon} />}
                        {!directions && endLocation && <Marker position={{ lat: 5.5562, lng: -0.1451 }} label="B" />}
                        
                    </GoogleMap>
                ) : (
                    <Skeleton className="w-full h-full" />
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
