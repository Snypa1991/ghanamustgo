
"use client";

import { useState, useMemo, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Car, MapPin, Loader2, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MopedIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/app-context';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { getOptimizedRoute } from '@/app/actions';
import type { OptimizeRouteWithAIOutput } from '@/ai/flows/optimize-route-with-ai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Accra, Ghana coordinates
const center = {
  lat: 5.6037,
  lng: -0.1870
};

const formSchema = z.object({
  startLocation: z.string().min(1, 'Start location is required'),
  endLocation: z.string().min(1, 'End location is required'),
});

type RouteOptimizationFormValues = z.infer<typeof formSchema>;


export default function BookPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });
  const { user } = useAuth();
  
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [step, setStep] = useState<'details' | 'selection'>('details');
  const [ridePrices, setRidePrices] = useState({ okada: 0, taxi: 0 });

  const [aiResult, setAiResult] = useState<OptimizeRouteWithAIOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

  const form = useForm<RouteOptimizationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: 'East Legon, American House',
      endLocation: '',
    },
  });

  const { watch } = form;
  const startLocation = watch('startLocation');
  const endLocation = watch('endLocation');

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);

      const distanceInKm = response.routes[0].legs[0].distance?.value ?? 0 / 1000;
      // Simple pricing model for prototype
      setRidePrices({
          okada: Math.max(5, distanceInKm * 1.5),
          taxi: Math.max(10, distanceInKm * 2.5),
      })
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };
  
  async function onSubmit(values: RouteOptimizationFormValues) {
    setIsLoading(true);
    setAiError(null);
    setAiResult(null);

    // Get directions from Google Maps
    setDirections(null); // Reset directions to trigger DirectionsService
    
    // Get AI optimization
    const response = await getOptimizedRoute(values);
    if (response.success && response.data) {
      setAiResult(response.data);
    } else {
      setAiError(response.error || 'An unknown error occurred.');
    }
    
    setIsLoading(false);
    setStep('selection');
  }

  const shouldRenderDirectionsService = useMemo(() => {
    return isLoaded && startLocation && endLocation;
  }, [isLoaded, startLocation, endLocation]);
  
  const startMarkerIcon = useMemo(() => {
    if (user && isLoaded) {
      const imageUrl = `https://picsum.photos/seed/${user.email}/40/40`;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <defs>
            <clipPath id="circle-clip">
              <circle cx="24" cy="24" r="20" />
            </clipPath>
          </defs>
          <circle cx="24" cy="24" r="22" fill="white" stroke="hsl(var(--primary))" stroke-width="2"/>
          <image href="${imageUrl}" x="4" y="4" width="40" height="40" clip-path="url(#circle-clip)" />
        </svg>`;
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(48, 48),
        anchor: new window.google.maps.Point(24, 24),
      };
    }
    return undefined;
  }, [user, isLoaded]);

  const endMarkerIcon = useMemo(() => {
    if (isLoaded) {
      return {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "hsl(var(--primary))",
        fillOpacity: 1,
        strokeWeight: 3,
        strokeColor: "white",
      }
    }
    return undefined;
  }, [isLoaded]);

  if (loadError) {
    return <div>Error loading maps. Please check your API key.</div>;
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: true,
          }}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
        >
          {shouldRenderDirectionsService && !directions && (
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
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: 'hsl(var(--primary))',
                  strokeOpacity: 0.8,
                  strokeWeight: 6
                }
              }}
            />
          )}
          
           {directions && directions.routes[0]?.legs[0]?.start_location && (
             <Marker 
                position={directions.routes[0].legs[0].start_location} 
                icon={startMarkerIcon}
             />
           )}
           {directions && directions.routes[0]?.legs[0]?.end_location && (
             <Marker 
                position={directions.routes[0].legs[0].end_location} 
                icon={endMarkerIcon}
             />
           )}

        </GoogleMap>
      ) : (
        <Skeleton className="absolute inset-0" />
      )}

      <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 sm:w-full sm:max-w-sm">
        <Card className="shadow-2xl">
          {step === 'details' && (
            <>
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Where to?</CardTitle>
                <CardDescription>Enter your pickup and drop-off locations.</CardDescription>
              </CardHeader>
               <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="startLocation"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pickup Location</FormLabel>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <FormControl>
                                      <Input placeholder="e.g., Accra Mall" {...field} className="pl-9" />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="endLocation"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Drop-off Location</FormLabel>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <FormControl>
                                      <Input placeholder="e.g., Labadi Beach" {...field} className="pl-9" />
                                    </FormControl>
                                </div>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading} className="w-full h-11" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
                            Find Ride
                        </Button>
                    </CardFooter>
                </form>
              </Form>
            </>
          )}

          {step === 'selection' && (
            <>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold font-headline text-center">Choose a ride</CardTitle>
                    <CardDescription className="text-center">Select a vehicle that suits your needs.</CardDescription>
                </CardHeader>

                <CardContent>
                    {aiResult && (
                       <Alert className="mb-4 bg-primary/5">
                          <CardTitle className="text-sm font-headline text-primary">AI-Optimized Route</CardTitle>
                          <AlertDescription className="text-xs">{aiResult.optimizedRoute} (Est: {aiResult.estimatedTravelTime})</AlertDescription>
                        </Alert>
                    )}
                     <RadioGroup defaultValue="okada" className="grid grid-cols-1 gap-4">
                        <Label
                            htmlFor="okada"
                            className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <div className='flex items-center gap-4'>
                                <MopedIcon className="h-10 w-10 text-primary" />
                                <div>
                                <p className="font-bold text-lg">Okada</p>
                                <p className="text-sm text-muted-foreground">Quick & affordable</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold">GH₵{ridePrices.okada.toFixed(2)}</p>
                            <RadioGroupItem value="okada" id="okada" className="sr-only" />
                        </Label>
                        <Label
                            htmlFor="car"
                            className="flex items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                        >
                            <div className='flex items-center gap-4'>
                                <Car className="h-10 w-10 text-primary" />
                                <div>
                                <p className="font-bold text-lg">Taxi</p>
                                <p className="text-sm text-muted-foreground">Comfortable & private</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold">GH₵{ridePrices.taxi.toFixed(2)}</p>
                            <RadioGroupItem value="car" id="car" className="sr-only" />
                        </Label>
                    </RadioGroup>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                    <Button size="lg" className="w-full h-12 text-lg">Book Ride</Button>
                    <Button variant="link" onClick={() => setStep('details')}>Back</Button>
                </CardFooter>
            </>
          )}

        </Card>
      </div>
    </div>
  );
}
