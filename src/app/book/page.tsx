
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Car, Loader2, Navigation, Bot, Package, PersonStanding, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MopedIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/app-context';
import { getOptimizedRoute, getSuggestedDeliveryFee } from '@/app/actions';
import type { OptimizeRouteWithAIOutput } from '@/ai/flows/optimize-route-with-ai';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import RouteOptimization from '@/components/route-optimization';
import { DUMMY_RIDES, DUMMY_USERS, Ride, User } from '@/lib/dummy-data';
import TripStatusCard from '@/components/trip-status-card';
import { useToast } from '@/hooks/use-toast';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import DispatchForm from '@/components/dispatch-form';
import type { SuggestDeliveryFeeOutput } from '@/ai/flows/suggest-delivery-fee';
import { ScrollArea } from '@/components/ui/scroll-area';
import Link from 'next/link';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

type BookingType = 'ride' | 'dispatch';
type BookingStep = 'details' | 'selection' | 'confirming' | 'enroute-to-pickup' | 'enroute-to-destination' | 'completed';
type PinningLocation = 'start' | 'end' | null;

const containerStyle = {
  width: '100%',
  height: '100%'
};

const center = {
  lat: 5.6037,
  lng: -0.1870
};

export default function BookPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places', 'geometry']
  });
  const { user } = useAuth();
  const { toast } = useToast();

  const [bookingType, setBookingType] = useState<BookingType>('ride');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [step, setStep] = useState<BookingStep>('details');
  const [ridePrices, setRidePrices] = useState({ okada: 0, taxi: 0 });
  const [dispatchFee, setDispatchFee] = useState<SuggestDeliveryFeeOutput | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [startLocation, setStartLocation] = useState('');
  const [endLocation, setEndLocation] = useState('');
  
  const [aiResult, setAiResult] = useState<OptimizeRouteWithAIOutput | null>(null);
  const [assignedDriver, setAssignedDriver] = useState<User | null>(null);
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  
  const [pinningLocation, setPinningLocation] = useState<PinningLocation>(null);

  const [driverPosition, setDriverPosition] = useState<google.maps.LatLng | null>(null);
  const animationRef = useRef<number>();

  const mapRef = useRef<google.maps.Map | null>(null);
  
  const [isSheetOpen, setIsSheetOpen] = useState(false);


  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = null;
    if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
    }
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
            setIsSheetOpen(true);
        } else {
            toast({
                variant: 'destructive',
                title: 'Could not get address',
                description: 'Failed to reverse geocode the selected location.'
            })
        }
        setPinningLocation(null);
    });
  }, [pinningLocation, toast]);

  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
      if (bookingType === 'ride') {
        const distanceInKm = (response.routes[0].legs[0].distance?.value ?? 0) / 1000;
        setRidePrices({
            okada: Math.max(5, distanceInKm * 1.5),
            taxi: Math.max(10, distanceInKm * 2.5),
        })
      }
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };
  
  async function handleGetEstimate(values?: any) {
    setIsLoading(true);
    setAiResult(null);
    setDirections(null); 

    if (bookingType === 'ride') {
      const response = await getOptimizedRoute({ startLocation, endLocation });
      if (response.success && response.data) {
        setAiResult(response.data);
      } 
    } else if (bookingType === 'dispatch' && values) {
        const distanceInKm = directions?.routes[0]?.legs[0]?.distance?.value ? directions.routes[0].legs[0].distance.value / 1000 : 10;
        const response = await getSuggestedDeliveryFee({
            distance: distanceInKm,
            packageSize: values.packageSize,
            urgency: 'standard'
        });
        if (response.success && response.data) {
            setDispatchFee(response.data);
        } else {
            toast({ variant: 'destructive', title: 'Error', description: response.error || "Could not calculate fee." });
        }
    }
    
    setIsLoading(false);
    setStep('selection');
    setIsSheetOpen(false);
  }

  const handleConfirmBooking = (rideType: 'okada' | 'taxi') => {
    setStep('confirming');

    const driverRole = rideType === 'okada' ? 'biker' : 'driver';
    const availableDrivers = DUMMY_USERS.filter(u => u.role === driverRole);
    const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    
    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      userId: user!.id,
      driverId: driver.id,
      startLocation,
      endLocation,
      fare: bookingType === 'ride' 
        ? (rideType === 'okada' ? ridePrices.okada : ridePrices.taxi) 
        : (dispatchFee?.suggestedFee || 0),
      date: new Date().toISOString(),
      status: 'cancelled',
    };

    setCurrentRide(newRide);

    setTimeout(() => {
      setAssignedDriver(driver);
      setStep('enroute-to-pickup');
    }, 4000);
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
    setStartLocation('');
    setEndLocation('');
    setAiResult(null);
    setDispatchFee(null);
    setDriverPosition(null);
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'enroute-to-pickup') {
      timer = setTimeout(() => setStep('enroute-to-destination'), 10000); 
    } else if (step === 'enroute-to-destination') {
      timer = setTimeout(() => handleCompleteRide(), 15000); 
    }
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);


  useEffect(() => {
    if (!directions || !isLoaded || (step !== 'enroute-to-pickup' && step !== 'enroute-to-destination')) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const route = directions.routes[0];
    if (!route) return;

    let path: google.maps.LatLng[];
    let duration: number;

    if (step === 'enroute-to-pickup') {
        const startLeg = route.legs[0];
        const driverStartLat = startLeg.start_location.lat() + (Math.random() - 0.5) * 0.02;
        const driverStartLng = startLeg.start_location.lng() + (Math.random() - 0.5) * 0.02;
        const driverStartPoint = new window.google.maps.LatLng(driverStartLat, driverStartLng);
        path = [driverStartPoint, startLeg.start_location];
        duration = 10000; 
    } else { 
        path = route.overview_path;
        duration = 15000;
    }

    let startTime: number;
    const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / duration;

        if (progress < 1) {
            const point = window.google.maps.geometry.spherical.interpolate(path[0], path[path.length - 1], progress);
            setDriverPosition(point);
            animationRef.current = requestAnimationFrame(animate);
        } else {
            setDriverPosition(path[path.length - 1]);
        }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    };
}, [step, directions, isLoaded]);

  const handleRouteUpdate = (start: string, end: string) => {
    setStartLocation(start);
    setEndLocation(end);
  }

  const shouldRenderDirectionsService = useMemo(() => {
    return isLoaded && startLocation && endLocation && (step === 'details' || step === 'selection' || step === 'enroute-to-pickup' || step === 'enroute-to-destination');
  }, [isLoaded, startLocation, endLocation, step]);
  
  const startMarkerIcon = useMemo(() => {
    if (!user || !isLoaded) return undefined;
    const imageUrl = `https://picsum.photos/seed/${user.email}/40/40`;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <defs><clipPath id="circle-clip"><circle cx="24" cy="24" r="20" /></clipPath></defs>
        <circle cx="24" cy="24" r="22" fill="white" stroke="hsl(var(--primary))" stroke-width="2"/>
        <image href="${imageUrl}" x="4" y="4" width="40" height="40" clip-path="url(#circle-clip)" />
      </svg>`;
    
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
      scaledSize: new window.google.maps.Size(48, 48),
      anchor: new window.google.maps.Point(24, 48),
    };
  }, [user, isLoaded]);

  const endMarkerIcon = useMemo(() => {
    if (!isLoaded) return undefined;
    return {
      path: window.google.maps.SymbolPath.CIRCLE,
      scale: 10,
      fillColor: "hsl(var(--primary))",
      fillOpacity: 1,
      strokeWeight: 3,
      strokeColor: "white",
    };
  }, [isLoaded]);
  
  const driverMarkerIcon = useMemo(() => {
    if (!assignedDriver || !isLoaded) return undefined;
    const commonOptions = { fillColor: 'hsl(var(--accent))', fillOpacity: 1, strokeColor: 'white', strokeWeight: 2, anchor: new window.google.maps.Point(12, 12) };
    if (assignedDriver.role === 'biker') {
        const svgPath = 'M5 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM19 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM8 19h8M19 14a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2zM5 11v-5h8M11 6L7 4M13 11V4h-2';
        return { ...commonOptions, path: svgPath, scale: 1.2 };
    }
    return { ...commonOptions, path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW, scale: 6 };
  }, [assignedDriver, isLoaded]);

  useEffect(() => {
    if (step === 'details') {
      setDirections(null);
    }
  }, [step, startLocation, endLocation]);
  
  useEffect(() => {
    if (pinningLocation) {
        toast({ title: 'Select a location', description: `Click on the map to set your ${pinningLocation} point.` });
        if (mapRef.current) mapRef.current.setOptions({ draggableCursor: 'crosshair' });
        setIsSheetOpen(false);
    } else {
        if (mapRef.current) mapRef.current.setOptions({ draggableCursor: undefined });
    }
  }, [pinningLocation, toast]);

  useEffect(() => {
    if (step !== 'details') {
        setIsSheetOpen(false);
    }
  }, [step]);
  
  useEffect(() => {
    setDirections(null);
  }, [bookingType]);

  const isTripInProgress = step === 'confirming' || step === 'enroute-to-pickup' || step === 'enroute-to-destination' || step === 'completed';

  const renderActionButton = (rideType: 'okada' | 'taxi') => {
    if (!user) {
        return (
             <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full">Login to Book</Button>
            </Link>
        )
    }
    return (
        <Button 
            variant="outline" 
            className="w-full h-auto p-4 flex items-center justify-between border-2 hover:border-primary hover:bg-accent/50" 
            onClick={() => handleConfirmBooking(rideType)}
            disabled={!startLocation || !endLocation}
        >
            <div className='flex items-center gap-4 text-left'>
                {rideType === 'okada' ? <MopedIcon className="h-10 w-10 text-primary" /> : <Car className="h-10 w-10 text-primary" />}
                <div>
                    <p className="font-bold text-lg">Book {rideType === 'okada' ? 'Okada' : 'Taxi'}</p>
                    <p className="text-sm text-muted-foreground">{rideType === 'okada' ? 'Quick & affordable' : 'Comfortable & private'}</p>
                </div>
            </div>
            <p className="text-lg font-bold">GH₵{rideType === 'okada' ? ridePrices.okada.toFixed(2) : ridePrices.taxi.toFixed(2)}</p>
        </Button>
    )
  }

  const renderDispatchButton = () => {
     if (!user) {
        return (
            <Link href="/login" className="w-full">
                <Button className="w-full">Login to Dispatch</Button>
            </Link>
        )
    }
    return (
        <Button onClick={() => handleConfirmBooking('okada')} className="w-full" disabled={!startLocation || !endLocation || !dispatchFee}>Confirm & Find Rider</Button>
    )
  }

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={12}
          options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false, zoomControl: true, gestureHandling: 'cooperative' }}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
          onClick={onMapClick}
        >
          {shouldRenderDirectionsService && !directions && (
            <DirectionsService
              options={{ destination: endLocation, origin: startLocation, travelMode: google.maps.TravelMode.DRIVING }}
              callback={directionsCallback}
            />
          )}
          {directions && (
            <DirectionsRenderer
              options={{ directions, suppressMarkers: true, polylineOptions: { strokeColor: 'hsl(var(--primary))', strokeOpacity: 0.8, strokeWeight: 6 }}}
            />
          )}
           {directions && directions.routes[0]?.legs[0]?.start_location && (
             <Marker position={directions.routes[0].legs[0].start_location} icon={startMarkerIcon}/>
           )}
           {directions && directions.routes[0]?.legs[0]?.end_location && (
             <Marker position={directions.routes[0].legs[0].end_location} icon={endMarkerIcon}/>
           )}
           {isTripInProgress && driverPosition && (
              <Marker position={driverPosition} icon={driverMarkerIcon}/>
           )}
        </GoogleMap>
      ) : (
        <Skeleton className="h-full w-full" />
      )}

      {isTripInProgress ? (
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 sm:max-w-md sm:left-auto">
            <TripStatusCard step={step} driver={assignedDriver} ride={currentRide} onReviewAndFinish={handleReviewAndFinish} />
        </div>
      ) : step === 'selection' ? (
         <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8 sm:max-w-md sm:left-auto">
             <Card className="shadow-2xl">
                <ScrollArea className="max-h-[70vh]">
                     <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold font-headline">{bookingType === 'ride' ? 'Choose a ride' : 'Confirm Dispatch'}</CardTitle>
                        <CardDescription>{bookingType === 'ride' ? 'Select a vehicle that suits your needs' : 'Review the details and confirm your request'}</CardDescription>
                         {aiResult && bookingType === 'ride' && (
                          <Alert className="text-left text-sm bg-primary/5 border-primary/20 mt-2">
                              <Bot className="h-4 w-4" />
                              <AlertTitle className="font-semibold">Smart Route Suggestion</AlertTitle>
                              <AlertDescription>{aiResult.optimizedRoute}</AlertDescription>
                          </Alert>
                        )}
                        {dispatchFee && bookingType === 'dispatch' && (
                          <Alert className="text-left text-sm bg-primary/5 border-primary/20 mt-2">
                              <Bot className="h-4 w-4" />
                              <AlertTitle className="font-semibold">AI Suggested Fee</AlertTitle>
                              <AlertDescription>{dispatchFee.reasoning}</AlertDescription>
                          </Alert>
                        )}
                    </CardHeader>
                     <CardContent className="space-y-4">
                        {bookingType === 'ride' ? (
                            <>
                              {renderActionButton('okada')}
                              {renderActionButton('taxi')}
                            </>                      
                        ) : (
                          <div className="text-center p-4 rounded-lg bg-muted">
                              <p className="text-sm text-muted-foreground">Delivery Fee</p>
                              <p className="text-4xl font-bold text-primary">GH₵ {dispatchFee?.suggestedFee.toFixed(2)}</p>
                          </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex-col gap-3 pt-4">
                         {bookingType === 'dispatch' && renderDispatchButton()}
                        <Button variant="link" onClick={() => { setStep('details'); setIsSheetOpen(true); }}>Back</Button>
                    </CardFooter>
                 </ScrollArea>
            </Card>
        </div>
      ) : (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
                 <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Card className="shadow-2xl p-4 cursor-pointer hover:bg-muted" onClick={() => setIsSheetOpen(true)}>
                        <Input placeholder="Where to?" className="text-lg pointer-events-none" />
                    </Card>
                 </div>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl max-h-[85vh]">
                 <SheetHeader>
                    <SheetTitle className="font-headline text-2xl">Get a Ride or Send a Package</SheetTitle>
                 </SheetHeader>
                 <ScrollArea className="h-[calc(85vh-4rem)]">
                     <div className="p-4 space-y-4">
                        <ToggleGroup type="single" value={bookingType} onValueChange={(value: BookingType) => value && setBookingType(value)} className="grid grid-cols-2">
                            <ToggleGroupItem value="ride" aria-label="Request a ride"><PersonStanding className="h-4 w-4 mr-2"/>Ride</ToggleGroupItem>
                            <ToggleGroupItem value="dispatch" aria-label="Send a package"><Package className="h-4 w-4 mr-2"/>Dispatch</ToggleGroupItem>
                        </ToggleGroup>
                        <RouteOptimization 
                            startLocation={startLocation}
                            endLocation={endLocation}
                            onRouteUpdate={handleRouteUpdate} 
                            onPinLocation={setPinningLocation}
                            onSubmit={() => {}} 
                            isLoading={false}
                            hideSubmit
                        />
                        {bookingType === 'dispatch' && (
                            <div className="pt-4 border-t">
                                <h3 className="text-lg font-medium mb-2">Package Details</h3>
                                <DispatchForm onSubmit={handleGetEstimate} isLoading={isLoading} />
                            </div>
                        )}
                        {bookingType === 'ride' && (
                            <Button className="w-full" onClick={() => handleGetEstimate()} disabled={isLoading || !startLocation || !endLocation}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Navigation className="mr-2 h-4 w-4"/>}
                                Find Ride Options
                            </Button>
                        )}
                     </div>
                 </ScrollArea>
            </SheetContent>
        </Sheet>
      )}
    </div>
  );
}

    