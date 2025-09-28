
"use client";

import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';
import { Car, Package, ShieldCheck, ArrowLeft, Search, Mic } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { MopedIcon } from '@/components/icons';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/app-context';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
  SheetFooter
} from "@/components/ui/sheet"


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

  const onUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

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
      const imageUrl = `https://picsum.photos/seed/${user.email}/40/40`;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
          <defs>
            <clipPath id="circle-clip">
              <circle cx="24" cy="24" r="20" />
            </clipPath>
          </defs>
          <circle cx="24" cy="24" r="22" fill="white" />
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
            zoomControl: false,
          }}
          onLoad={onMapLoad}
          onUnmount={onUnmount}
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
                suppressMarkers: true,
                polylineOptions: {
                  strokeColor: '#000000',
                  strokeWeight: 4
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
                icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#EA4335",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "white",
                }}
             />
           )}

        </GoogleMap>
      ) : (
        <Skeleton className="absolute inset-0" />
      )}

      <div className="absolute top-4 left-4 right-4 bg-background p-3 rounded-lg shadow-lg flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <ArrowLeft />
        </Button>
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Where to?" 
            className="pl-10 text-base"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
            onFocus={() => {
              // Set a default start location when user focuses on destination
              if (!startLocation) {
                 setStartLocation('East Legon, American House');
              }
            }}
          />
        </div>
        <Button variant="ghost" size="icon">
          <Mic />
        </Button>
      </div>
        
      <Sheet open={true} onOpenChange={()=>{}}>
        <SheetContent side="bottom" className="rounded-t-2xl max-h-[70vh] p-0" hideClose>
          <div className="p-6">
            <div className="w-12 h-1.5 bg-muted-foreground/30 rounded-full mx-auto mb-4" />
             <SheetHeader>
               <SheetTitle className="text-2xl font-bold font-headline text-center">Choose a ride</SheetTitle>
               <SheetDescription className="text-center">Select a vehicle that suits your needs.</SheetDescription>
             </SheetHeader>
          </div>

          <div className="p-6 pt-0">
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
                      <p className="text-lg font-bold">$15.00</p>
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
                      <p className="text-lg font-bold">$25.00</p>
                       <RadioGroupItem value="car" id="car" className="sr-only" />
                  </Label>
              </RadioGroup>
          </div>
          
          <SheetFooter className="p-6 pt-0 bg-background sticky bottom-0">
              <Button size="lg" className="w-full h-12 text-lg">Book Ride</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
