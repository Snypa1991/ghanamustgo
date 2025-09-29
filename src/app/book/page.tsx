
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Car, Loader2, Navigation, Bot } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MopedIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/app-context';
import { getOptimizedRoute } from '@/app/actions';
import type { OptimizeRouteWithAIOutput } from '@/ai/flows/optimize-route-with-ai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RouteOptimization from '@/components/route-optimization';
import { DUMMY_RIDES, DUMMY_USERS, Ride, User } from '@/lib/dummy-data';
import TripStatusCard from '@/components/trip-status-card';
import { useToast } from '@/hooks/use-toast';

type BookingStep = 'details' | 'selection' | 'confirming' | 'enroute-to-pickup' | 'enroute-to-destination' | 'completed';
type PinningLocation = 'start' | 'end' | null;


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
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [step, setStep] = useState<BookingStep>('details');
  const [ridePrices, setRidePrices] = useState({ okada: 0, taxi: 0 });

  const [aiResult, setAiResult] = useState<OptimizeRouteWithAIOutput | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startLocation, setStartLocation] = useState('East Legon, American House');
  const [endLocation, setEndLocation] = useState('Osu Oxford Street');

  const [assignedDriver, setAssignedDriver] = useState<User | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  
  const [pinningLocation, setPinningLocation] = useState<PinningLocation>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!pinningLocation || !e.latLng) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: e.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            if (pinningLocation === 'start') {
                setStartLocation(address);
            } else {
                setEndLocation(address);
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Could not get address',
                description: 'Failed to reverse geocode the selected location.'
            })
        }
        setPinningLocation(null); // Exit pinning mode
    });
  }, [pinningLocation, toast]);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);

      const distanceInKm = (response.routes[0].legs[0].distance?.value ?? 0) / 1000;
      // Simple pricing model for prototype
      setRidePrices({
          okada: Math.max(5, distanceInKm * 1.5),
          taxi: Math.max(10, distanceInKm * 2.5),
      })
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };
  
  async function handleFindRide() {
    setIsLoading(true);
    setAiError(null);
    setAiResult(null);

    // Get directions from Google Maps
    setDirections(null); // Reset directions to trigger DirectionsService
    
    // Get AI optimization
    const response = await getOptimizedRoute({startLocation, endLocation});
    if (response.success && response.data) {
      setAiResult(response.data);
    } else {
      setAiError(response.error || 'An unknown error occurred.');
    }
    
    setIsLoading(false);
    setStep('selection');
  }

  const handleBookRide = (rideType: 'okada' | 'taxi') => {
    if (!user) return;
    setStep('confirming');

    const driverRole = rideType === 'okada' ? 'biker' : 'driver';
    const availableDrivers = DUMMY_USERS.filter(u => u.role === driverRole);
    const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    
    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      userId: user.id,
      driverId: driver.id,
      startLocation,
      endLocation,
      fare: rideType === 'okada' ? ridePrices.okada : ridePrices.taxi,
      date: new Date().toISOString(),
      status: 'cancelled', // Will be updated to completed later
    };

    setCurrentRide(newRide);

    setTimeout(() => {
      setAssignedDriver(driver);
      setStep('enroute-to-pickup');
    }, 4000); // Simulate finding a driver
  };

  const handleCompleteRide = () => {
    if(currentRide){
      const completedRide: Ride = {...currentRide, status: 'completed' };
      DUMMY_RIDES.unshift(completedRide);
    }
    setStep('completed');
  }
  
  const handleReviewAndFinish = () => {
    setStep('details');
    setDirections(null);
    setCurrentRide(null);
    setAssignedDriver(null);
  }


  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'enroute-to-pickup') {
      timer = setTimeout(() => setStep('enroute-to-destination'), 10000); // 10s to pickup
    } else if (step === 'enroute-to-destination') {
      timer = setTimeout(() => handleCompleteRide(), 15000); // 15s to destination
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);


  const handleRouteUpdate = (start: string, end: string) => {
    if (start !== startLocation) setStartLocation(start);
    if (end !== endLocation) setEndLocation(end);
  }

  const shouldRenderDirectionsService = useMemo(() => {
    return isLoaded && startLocation && endLocation && step === 'details';
  }, [isLoaded, startLocation, endLocation, step]);
  
  const startMarkerIcon = useMemo(() => {
    if (!user || !isLoaded) return undefined;
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
  
  const driverMarkerIcon = useMemo(() => {
    if (!assignedDriver || !isLoaded) return undefined;
    
    const commonOptions = {
      fillColor: 'hsl(var(--accent))',
      fillOpacity: 1,
      strokeColor: 'white',
      strokeWeight: 2,
      anchor: new window.google.maps.Point(12, 12),
    };

    if (assignedDriver.role === 'biker') {
        const svgPath = 'M5 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM19 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM8 19h8M19 14a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2zM5 11v-5h8M11 6L7 4M13 11V4h-2';
        return { ...commonOptions, path: svgPath, scale: 1.2 };
    }
    
    return { ...commonOptions, path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6 };
  }, [assignedDriver, isLoaded]);


  if (loadError) {
    return <div>Error loading maps. Please check your API key.</div>;
  }
  
  // Set directions when step changes back to details
   useEffect(() => {
    if (step === 'details') {
      setDirections(null);
    }
  }, [step]);
  
  useEffect(() => {
    if (pinningLocation) {
        toast({
            title: 'Select a location',
            description: `Click on the map to set your ${pinningLocation} point.`,
        });
        if (mapRef.current) {
            mapRef.current.setOptions({ draggableCursor: 'crosshair' });
        }
    } else {
        if (mapRef.current) {
            mapRef.current.setOptions({ draggableCursor: undefined });
        }
    }
  }, [pinningLocation, toast]);

  const isTripInProgress = step === 'confirming' || step === 'enroute-to-pickup' || step === 'enroute-to-destination' || step === 'completed';

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
          onClick={onMapClick}
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
                suppressMarkers: step !== 'details',
                polylineOptions: {
                  strokeColor: 'hsl(var(--primary))',
                  strokeOpacity: 0.8,
                  strokeWeight: 6
                }
              }}
            />
          )}
          
           {directions && directions.routes[0]?.legs[0]?.start_location && !isTripInProgress &&(
             <Marker 
                position={directions.routes[0].legs[0].start_location} 
                icon={startMarkerIcon}
             />
           )}
           {directions && directions.routes[0]?.legs[0]?.end_location && !isTripInProgress && (
             <Marker 
                position={directions.routes[0].legs[0].end_location} 
                icon={endMarkerIcon}
             />
           )}
           {isTripInProgress && assignedDriver && directions?.routes[0]?.legs[0]?.start_location && (
              <Marker
                position={directions.routes[0].legs[0].start_location}
                icon={driverMarkerIcon}
              />
           )}

        </GoogleMap>
      ) : (
        <Skeleton className="absolute inset-0" />
      )}

      <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 sm:w-full sm:max-w-sm">
        
        {isTripInProgress ? (
          <TripStatusCard 
            step={step} 
            driver={assignedDriver} 
            ride={currentRide}
            onReviewAndFinish={handleReviewAndFinish}
          />
        ) : (
          <Card className="shadow-2xl">
            {step === 'details' && (
              <>
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">Where to?</CardTitle>
                  <CardDescription>Enter your pickup and drop-off locations.</CardDescription>
                </CardHeader>
                <CardContent>
                    <RouteOptimization 
                        startLocation={startLocation}
                        endLocation={endLocation}
                        onRouteUpdate={handleRouteUpdate} 
                        onPinLocation={setPinningLocation}
                        onSubmit={handleFindRide} 
                        isLoading={isLoading}
                    />
                </CardContent>
              </>
            )}

            {step === 'selection' && (
              <>
                  <CardHeader>
                      <CardTitle className="text-2xl font-bold font-headline text-center">Choose a ride</CardTitle>
                      <CardDescription className="text-center">Select a vehicle that suits your needs.</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                      {aiResult && (
                        <Alert className="mb-4 bg-primary/5">
                            <Bot className="h-5 w-5 text-primary" />
                            <AlertTitle className="text-sm font-headline text-primary">Smart Route Suggestion</AlertTitle>
                            <AlertDescription className="text-xs">{aiResult.optimizedRoute} (Est: {aiResult.estimatedTravelTime})</AlertDescription>
                          </Alert>
                      )}
                      
                        <Button
                            variant="outline"
                            className="w-full h-auto p-4 flex items-center justify-between border-2 hover:border-primary hover:bg-accent/50"
                            onClick={() => handleBookRide('okada')}
                        >
                            <div className='flex items-center gap-4 text-left'>
                                <MopedIcon className="h-10 w-10 text-primary" />
                                <div>
                                <p className="font-bold text-lg">Book Okada</p>
                                <p className="text-sm text-muted-foreground">Quick & affordable</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold">GH₵{ridePrices.okada.toFixed(2)}</p>
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full h-auto p-4 flex items-center justify-between border-2 hover:border-primary hover:bg-accent/50"
                            onClick={() => handleBookRide('taxi')}
                        >
                            <div className='flex items-center gap-4 text-left'>
                                <Car className="h-10 w-10 text-primary" />
                                <div>
                                <p className="font-bold text-lg">Book Taxi</p>
                                <p className="text-sm text-muted-foreground">Comfortable & private</p>
                                </div>
                            </div>
                            <p className="text-lg font-bold">GH₵{ridePrices.taxi.toFixed(2)}</p>
                        </Button>

                  </CardContent>
                  <CardFooter className="flex-col gap-3 pt-4">
                      <Button variant="link" onClick={() => setStep('details')}>Back</Button>
                  </CardFooter>
              </>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}

    