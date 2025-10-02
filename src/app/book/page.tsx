
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Car, Loader2, Navigation, Bot, Package, PersonStanding, X, Bike } from 'lucide-react';
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
type VehicleType = 'bike' | 'car';
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
  const [vehicleType, setVehicleType] = useState<VehicleType>('bike');
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [step, setStep] = useState<BookingStep>('details');
  const [ridePrices, setRidePrices] = useState<{ okada: number, taxi: number } | null>(null);
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
       if (mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        response.routes[0].legs.forEach(leg => {
          leg.steps.forEach(step => step.path.forEach(path => bounds.extend(path)));
        });
        mapRef.current.fitBounds(bounds);
      }
      const distanceInKm = (response.routes[0].legs[0].distance?.value ?? 0) / 1000;
       if (bookingType === 'ride') {
        setRidePrices({
            okada: Math.max(5, distanceInKm * 1.5),
            taxi: Math.max(10, distanceInKm * 2.5),
        })
      }
    } else {
      console.error(`Directions request failed due to ${status}`);
      toast({
        variant: 'destructive',
        title: 'Route Not Found',
        description: 'Could not find a route between the specified locations.'
      })
    }
  };
  
  async function handleGetEstimate(values?: any) {
    if (!startLocation || !endLocation) {
        toast({ variant: 'destructive', title: 'Missing Locations', description: 'Please provide both pickup and drop-off locations.' });
        return;
    }

    setIsLoading(true);
    setAiResult(null);
    setDirections(null);
    setDispatchFee(null);

    toast({ title: 'Calculating...', description: 'Finding the best route and price for you.' });

    if (bookingType === 'ride') {
      const response = await getOptimizedRoute({ startLocation, endLocation });
      if (response.success && response.data) {
        setAiResult(response.data);
      } else {
         toast({ variant: 'destructive', title: 'AI Error', description: response.error || "Could not get AI route optimization." });
      }
    } else if (bookingType === 'dispatch' && values) {
        // We need directions to get distance for fee calculation.
        // The DirectionsService will trigger the callback which calculates distance.
        // We'll calculate fee after directions are set.
    }
    
    // The DirectionsService will be rendered and will trigger the callback.
    // The callback will set directions and calculate prices.
    setStep('selection');
    setIsSheetOpen(false);
    setIsLoading(false);
  }
  
  useEffect(() => {
    if (step === 'selection' && bookingType === 'dispatch' && directions) {
      const calculateFee = async () => {
        setIsLoading(true);
        const distanceInKm = directions?.routes[0]?.legs[0]?.distance?.value ? directions.routes[0].legs[0].distance.value / 1000 : 10;
        
        // This is a bit of a workaround because we don't have the form values here.
        // In a real app, this state would be managed more globally or passed around.
        // For now, we'll simulate getting some form values.
        const dummyFormValues = { packageSize: 'medium', urgency: 'standard' };

        const response = await getSuggestedDeliveryFee({
            distance: distanceInKm,
            packageSize: dummyFormValues.packageSize, // This is not ideal
            urgency: dummyFormValues.urgency,
        });

        if (response.success && response.data) {
            setDispatchFee(response.data);
        } else {
            toast({ variant: 'destructive', title: 'Fee Error', description: response.error || "Could not calculate delivery fee." });
        }
        setIsLoading(false);
      }
      calculateFee();
    }
  }, [step, bookingType, directions, toast]);


  const handleConfirmBooking = () => {
    if (!user) {
        toast({ title: 'Please log in', description: 'You must be logged in to book a service.'});
        router.push('/login');
        return;
    }
    setStep('confirming');
    toast({ title: "Finding your driver...", description: "This will take a moment." });

    const driverRole = vehicleType === 'bike' ? 'biker' : 'driver';
    const availableDrivers = DUMMY_USERS.filter(u => u.role === driverRole);
    const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    
    const newRide: Ride = {
      id: `ride-${Date.now()}`,
      userId: user!.id,
      driverId: driver.id,
      startLocation,
      endLocation,
      fare: bookingType === 'ride' 
        ? (vehicleType === 'bike' ? (ridePrices?.okada || 0) : (ridePrices?.taxi || 0)) 
        : (dispatchFee?.suggestedFee || 0),
      date: new Date().toISOString(),
      status: 'cancelled', // Default
      vehicleType: vehicleType,
    };

    setCurrentRide(newRide);

    setTimeout(() => {
      setAssignedDriver(driver);
      setStep('enroute-to-pickup');
      toast({ title: "Driver Found!", description: `${driver.name} is on the way.` });
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
    setRidePrices(null);
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

    const animatePath = (path: google.maps.LatLng[], duration: number) => {
        if (animationRef.current) cancelAnimationFrame(animationRef.current);

        const pathDistance = window.google.maps.geometry.spherical.computeLength(path);
        let startTime: number;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / duration;

            if (progress < 1) {
                const travelledDistance = progress * pathDistance;
                let currentDistance = 0;

                for (let i = 0; i < path.length - 1; i++) {
                    const segmentStart = path[i];
                    const segmentEnd = path[i+1];
                    const segmentDistance = window.google.maps.geometry.spherical.computeDistanceBetween(segmentStart, segmentEnd);
                    
                    if (currentDistance + segmentDistance >= travelledDistance) {
                        const remainingDistance = travelledDistance - currentDistance;
                        const segmentProgress = remainingDistance / segmentDistance;
                        const point = window.google.maps.geometry.spherical.interpolate(segmentStart, segmentEnd, segmentProgress);
                        setDriverPosition(point);
                        break;
                    }
                    currentDistance += segmentDistance;
                }
                animationRef.current = requestAnimationFrame(animate);
            } else {
                setDriverPosition(path[path.length - 1]);
            }
        };

        animationRef.current = requestAnimationFrame(animate);
    }
    
    // Simulate driver starting from a random nearby point for pickup
    if (step === 'enroute-to-pickup' && route.legs[0]) {
      const startLeg = route.legs[0];
      const driverStartLat = startLeg.start_location.lat() + (Math.random() - 0.5) * 0.02;
      const driverStartLng = startLeg.start_location.lng() + (Math.random() - 0.5) * 0.02;
      const driverStartPoint = new window.google.maps.LatLng(driverStartLat, driverStartLng);
      
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route({
        origin: driverStartPoint,
        destination: startLeg.start_location,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK' && result) {
          animatePath(result.routes[0].overview_path, 10000);
        } else {
            animatePath([driverStartPoint, startLeg.start_location], 10000);
        }
      });
    } else { // 'enroute-to-destination'
      animatePath(route.overview_path, 15000);
    }

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
    return isLoaded && startLocation && endLocation && step === 'selection';
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
    } else if (step === 'selection' && (!startLocation || !endLocation)) {
        setStep('details');
        setIsSheetOpen(true);
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
    setRidePrices(null);
    setDispatchFee(null);
    setAiResult(null);
  }, [bookingType, vehicleType]);

  const isTripInProgress = step === 'confirming' || step === 'enroute-to-pickup' || step === 'enroute-to-destination' || step === 'completed';

  const renderSelectionCard = () => {
    if (bookingType === 'ride' && ridePrices) {
        const price = vehicleType === 'bike' ? ridePrices.okada : ridePrices.taxi;
        return (
            <Button className="w-full h-auto p-4 flex items-center justify-between" onClick={handleConfirmBooking}>
                <div className='flex items-center gap-4 text-left'>
                    {vehicleType === 'bike' ? <MopedIcon className="h-10 w-10" /> : <Car className="h-10 w-10" />}
                    <div>
                        <p className="font-bold text-lg">Confirm {vehicleType === 'bike' ? 'Okada' : 'Taxi'}</p>
                        <p className="text-sm text-muted-foreground">{vehicleType === 'bike' ? 'Quick & affordable' : 'Comfortable & private'}</p>
                    </div>
                </div>
                <p className="text-lg font-bold">GH₵{price.toFixed(2)}</p>
            </Button>
        );
    }

    if (bookingType === 'dispatch' && dispatchFee) {
        return (
            <Button className="w-full h-auto p-4 flex items-center justify-between" onClick={handleConfirmBooking}>
                <div className='flex items-center gap-4 text-left'>
                    {vehicleType === 'bike' ? <MopedIcon className="h-10 w-10" /> : <Car className="h-10 w-10" />}
                    <div>
                        <p className="font-bold text-lg">Confirm Dispatch</p>
                        <p className="text-sm text-muted-foreground">Send your package securely</p>
                    </div>
                </div>
                <p className="text-lg font-bold">GH₵{dispatchFee.suggestedFee.toFixed(2)}</p>
            </Button>
        );
    }
    
    if (isLoading || (!ridePrices && !dispatchFee)) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                <span>Calculating fee...</span>
            </div>
        )
    }

    return (
        <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Could not determine a price. Please try again.</AlertDescription>
        </Alert>
    );
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
          {shouldRenderDirectionsService && (
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
      {loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <Alert variant="destructive" className="w-auto">
                  <AlertTitle>Map Error</AlertTitle>
                  <AlertDescription>Could not load Google Maps. Please check your API key and network connection.</AlertDescription>
              </Alert>
          </div>
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
                        <CardTitle className="text-2xl font-bold font-headline">Confirm Your Request</CardTitle>
                        <CardDescription>Select your service and confirm the details.</CardDescription>
                         {(aiResult || dispatchFee) && (
                          <Alert className="text-left text-sm bg-primary/5 border-primary/20 mt-2">
                              <Bot className="h-4 w-4" />
                              <AlertTitle className="font-semibold">AI Suggestion</AlertTitle>
                              <AlertDescription>
                                {aiResult ? aiResult.optimizedRoute.split('. ')[0] + '.' : dispatchFee?.reasoning}
                              </AlertDescription>
                          </Alert>
                        )}
                    </CardHeader>
                     <CardContent className="space-y-4">
                        {renderSelectionCard()}
                    </CardContent>
                    <CardFooter className="flex-col gap-3 pt-4">
                        <Button variant="link" onClick={() => { setStep('details'); setIsSheetOpen(true); }}>Back to Details</Button>
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

                        <ToggleGroup type="single" value={vehicleType} onValueChange={(value: VehicleType) => value && setVehicleType(value)} className="grid grid-cols-2">
                            <ToggleGroupItem value="bike" aria-label="Choose bike"><Bike className="h-4 w-4 mr-2"/>Bike</ToggleGroupItem>
                            <ToggleGroupItem value="car" aria-label="Choose car"><Car className="h-4 w-4 mr-2"/>Car</ToggleGroupItem>
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
                                Get Estimate
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

    