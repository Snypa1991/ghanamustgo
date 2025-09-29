
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker, DirectionsService, DirectionsRenderer, Circle } from '@react-google-maps/api';
import { Power, Crosshair, Plus, Minus } from 'lucide-react';
import { useAuth } from '@/context/app-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DUMMY_RIDES, Ride, DUMMY_USERS } from '@/lib/dummy-data';
import RideRequestCard from '@/components/ride-request-card';
import RideHistory from '@/components/ride-history';
import { useToast } from '@/hooks/use-toast';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Accra, Ghana coordinates
const center = {
  lat: 5.6037,
  lng: -0.1870
};

export type TripStatus = 'none' | 'requesting' | 'enroute-to-pickup' | 'enroute-to-destination';


export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [isOnline, setIsOnline] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);
  const [currentRideRequest, setCurrentRideRequest] = useState<Ride | null>(null);
  const [tripStatus, setTripStatus] = useState<TripStatus>('none');
  const [isCompleting, setIsCompleting] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [historyKey, setHistoryKey] = useState(Date.now()); // Used to force re-render
  const [radius, setRadius] = useState(2000); // 2km radius

  const requestIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const requestTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);
  
  // Refs to hold the latest state values to be used inside intervals
  const tripStatusRef = useRef(tripStatus);
  const currentPositionRef = useRef(currentPosition);
  const radiusRef = useRef(radius);

  useEffect(() => {
    tripStatusRef.current = tripStatus;
    currentPositionRef.current = currentPosition;
    radiusRef.current = radius;
  });


  // Load online status from localStorage on initial render
  useEffect(() => {
    const storedIsOnline = localStorage.getItem('ghana-must-go-isOnline');
    if (storedIsOnline) {
      const savedIsOnline = JSON.parse(storedIsOnline);
      if (savedIsOnline) {
        setIsOnline(true);
      }
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  const onUserInteraction = () => {
    if (!userInteracted) {
        setUserInteracted(true);
    }
  }

  const handleRecenter = () => {
    if (mapRef.current && currentPosition) {
        mapRef.current.panTo(currentPosition);
        mapRef.current.setZoom(15);
        setUserInteracted(false);
    }
  }

  const startRequestSimulator = useCallback(() => {
    if (requestIntervalRef.current) clearInterval(requestIntervalRef.current);
    
    const generateRequest = () => {
        if (tripStatusRef.current !== 'none' || !currentPositionRef.current || !isLoaded || !user) {
            return;
        }
        
        // Generate a random passenger
        const passengers = DUMMY_USERS.filter(u => u.role === 'user' || u.role === 'unassigned');
        const randomPassenger = passengers[Math.floor(Math.random() * passengers.length)];

        // Generate a nearby pickup location within the radius
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * radiusRef.current; // distance in meters
        const earthRadius = 6371000; // meters

        const lat1 = currentPositionRef.current.lat * Math.PI / 180;
        const lon1 = currentPositionRef.current.lng * Math.PI / 180;
        
        const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distance / earthRadius) + Math.cos(lat1) * Math.sin(distance / earthRadius) * Math.cos(angle));
        const lon2 = lon1 + Math.atan2(Math.sin(angle) * Math.sin(distance / earthRadius) * Math.cos(lat1), Math.cos(distance / earthRadius) - Math.sin(lat1) * Math.sin(lat2));

        const pickupLat = lat2 * 180 / Math.PI;
        const pickupLng = lon2 * 180 / Math.PI;


        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: { lat: pickupLat, lng: pickupLng } }, (results, status) => {
            if (status === 'OK' && results && results[0]) {
                const pickupAddress = results[0].formatted_address;
                
                const newRide: Ride = {
                    id: `ride-sim-${Date.now()}`,
                    userId: randomPassenger.id,
                    driverId: user!.id,
                    startLocation: pickupAddress,
                    endLocation: "Osu Oxford Street", // Hardcoded destination for simulation
                    fare: Math.floor(Math.random() * (30 - 10 + 1)) + 10,
                    date: new Date().toISOString(),
                    status: 'cancelled', // Initial status
                };

                setCurrentRideRequest(newRide);
                setTripStatus('requesting');

            } else {
                toast({
                    variant: 'destructive',
                    title: 'Simulation Error',
                    description: 'Could not generate a nearby ride request.',
                })
            }
        });
    };
    
    requestIntervalRef.current = setInterval(generateRequest, 12000); // Check for a new ride every 12 seconds
}, [isLoaded, user, toast]);


    const stopRequestSimulator = () => {
        if (requestIntervalRef.current) {
            clearInterval(requestIntervalRef.current);
            requestIntervalRef.current = null;
        }
    };
    
  const handleCompleteRide = useCallback(() => {
    if (currentRideRequest) {
        const completedRide: Ride = {
            ...currentRideRequest,
            id: `ride-${Date.now()}`,
            date: new Date().toISOString(),
            status: 'completed',
        };
        DUMMY_RIDES.unshift(completedRide);
        setHistoryKey(Date.now());
    }

    setDirections(null);
    setCurrentRideRequest(null);
    setTripStatus('none');
    setIsCompleting(false);
  }, [currentRideRequest]);


  const handleDeclineRide = useCallback(() => {
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
      }
      setCurrentRideRequest(null);
      setTripStatus('none');
  }, []);


  useEffect(() => {
    if (!user || (user.role !== 'biker' && user.role !== 'driver')) {
      router.push('/login');
    }
  }, [user, router]);
  
  useEffect(() => {
    let watchId: number;

    if (isOnline) {
      startRequestSimulator();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = { lat: latitude, lng: longitude };
          setCurrentPosition(newPos);
          if (mapRef.current && !userInteracted) {
            mapRef.current.panTo(newPos);
            mapRef.current.setZoom(15);
          }
        },
        (error) => console.error("Error getting initial position:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );

      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = { lat: latitude, lng: longitude };
          setCurrentPosition(newPos);
          if (mapRef.current && !userInteracted) {
            mapRef.current.panTo(newPos);
          }
        },
        (error) => console.error("Geolocation watch error:", error),
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0, }
      );
    } else {
      setCurrentPosition(null);
      stopRequestSimulator();
      if (requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current);
      setCurrentRideRequest(null);
      setTripStatus('none');
      setDirections(null);
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
      stopRequestSimulator();
      if (requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current);
    };
  }, [isOnline, userInteracted, startRequestSimulator]);

    useEffect(() => {
        let tripTimer: NodeJS.Timeout | null = null;
        if (tripStatus === 'enroute-to-destination') {
            tripTimer = setTimeout(() => {
                setIsCompleting(true);
                setTimeout(() => {
                    handleCompleteRide();
                }, 2000); 
            }, 15000); 
        }

        if (tripStatus === 'requesting') {
            if(requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current);
            requestTimeoutRef.current = setTimeout(() => {
                handleDeclineRide();
            }, 10000); // 10-second timer for the request
        }
        
        if (tripStatus === 'none' && isOnline) {
            startRequestSimulator();
        }

        return () => {
            if (tripTimer) clearTimeout(tripTimer);
            if (requestTimeoutRef.current) clearTimeout(requestTimeoutRef.current);
        };
    }, [tripStatus, handleDeclineRide, handleCompleteRide, isOnline, startRequestSimulator]);


  const handleToggleOnline = () => {
    const newIsOnline = !isOnline;
    setIsOnline(newIsOnline);
    localStorage.setItem('ghana-must-go-isOnline', JSON.stringify(newIsOnline));
    
    if (newIsOnline) {
      setUserInteracted(false); 
    }
  };

  const handleAcceptRide = () => {
    if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
        requestTimeoutRef.current = null;
    }
    stopRequestSimulator();
    setDirections(null); 
    setTripStatus('enroute-to-pickup');
  };
  
  const handleStartTrip = () => {
    setDirections(null); 
    setTripStatus('enroute-to-destination');
  };


  const directionsCallback = (
    response: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (status === 'OK' && response) {
      setDirections(response);
       if (mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        response.routes[0].legs.forEach(leg => {
          leg.steps.forEach(step => {
            step.path.forEach(path => bounds.extend(path));
          });
        });
        mapRef.current.fitBounds(bounds);
      }
    } else {
      console.error(`Directions request failed due to ${status}`);
    }
  };

  const partnerIcon = useMemo(() => {
    if (!isLoaded || !user) return undefined;
  
    const commonOptions = {
        fillColor: 'hsl(var(--primary))',
        fillOpacity: 1,
        strokeColor: 'white',
        strokeWeight: 2,
        anchor: new window.google.maps.Point(12, 12),
    };

    if (user.role === 'biker') {
        const svgPath = 'M5 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM19 16.5c-1.5 0-3 1.5-3 3s1.5 3 3 3 3-1.5 3-3-1.5-3-3-3zM8 19h8M19 14a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2zM5 11v-5h8M11 6L7 4M13 11V4h-2';
        return {
            ...commonOptions,
            path: svgPath,
            scale: 1.2,
        };
    }

    if (user.role === 'driver') {
        return {
            ...commonOptions,
            path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            scale: 6,
            rotation: 0
        };
    }
    
    return undefined;
  }, [user, isLoaded]);
  

  if (!user || (user.role !== 'biker' && user.role !== 'driver')) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  const shouldRenderDirections = isLoaded && currentRideRequest && currentPosition && (tripStatus === 'enroute-to-pickup' || tripStatus === 'enroute-to-destination');
  const directionsOrigin = tripStatus === 'enroute-to-pickup' ? currentPosition : currentRideRequest?.startLocation;
  const directionsDestination = tripStatus === 'enroute-to-pickup' ? currentRideRequest?.startLocation : currentRideRequest?.endLocation;

  const changeRadius = (delta: number) => {
    setRadius(prev => Math.max(500, prev + delta)); // Minimum radius 500m
  }

  return (
    <div>
      <div className="relative h-[60vh] w-full">
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
              styles: [
                  { featureType: "poi", stylers: [{ visibility: "off" }], },
                  { featureType: "transit", stylers: [{ visibility: "off" }], },
              ]
            }}
            onLoad={onMapLoad}
            onUnmount={onMapUnmount}
            onDragStart={onUserInteraction}
            onZoomChanged={onUserInteraction}
          >
             {shouldRenderDirections && directionsOrigin && directionsDestination && !directions && (
                <DirectionsService
                    options={{
                        destination: directionsDestination,
                        origin: directionsOrigin,
                        travelMode: google.maps.TravelMode.DRIVING,
                    }}
                    callback={directionsCallback}
                />
            )}

            {directions && tripStatus !== 'none' && (
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

            {currentPosition && partnerIcon && (
              <>
                <Marker position={currentPosition} icon={partnerIcon} />
                <Circle 
                  center={currentPosition}
                  radius={radius}
                  options={{
                    strokeColor: 'hsl(var(--primary))',
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: 'hsl(var(--primary))',
                    fillOpacity: 0.1,
                  }}
                />
              </>
            )}
            
          </GoogleMap>
        ) : (
          <Skeleton className="h-full w-full" />
        )}

        <div className="absolute top-4 right-4 z-10">
          <button
              onClick={handleToggleOnline}
              className={cn(
                  "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors shadow-lg",
                  isOnline ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
              )}
              aria-label={isOnline ? 'Go Offline' : 'Go Online'}
          >
              <Power className="h-6 w-6 text-white" />
          </button>
        </div>

        {isOnline && (
           <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
            <div className="bg-background rounded-full shadow-lg flex items-center p-1">
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => changeRadius(-500)}>
                    <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xs font-semibold tabular-nums w-12 text-center">{(radius/1000).toFixed(1)} km</span>
                 <Button size="icon" variant="ghost" className="rounded-full h-8 w-8" onClick={() => changeRadius(500)}>
                    <Plus className="h-4 w-4" />
                </Button>
            </div>
          </div>
        )}

        {isLoaded && isOnline && userInteracted && (
            <div className="absolute bottom-4 right-4 z-10">
              <Button
                size="icon"
                className="rounded-full shadow-lg"
                onClick={handleRecenter}
                aria-label="Recenter map"
              >
                <Crosshair className="h-5 w-5" />
              </Button>
            </div>
          )}
        
        {tripStatus !== 'none' && currentRideRequest && (
          <div className="absolute bottom-4 left-4 right-4 z-10 sm:left-auto sm:w-full sm:max-w-sm">
              <RideRequestCard 
                  ride={currentRideRequest}
                  status={tripStatus}
                  onAccept={handleAcceptRide}
                  onDecline={handleDeclineRide}
                  onStartTrip={handleStartTrip}
                  onComplete={handleCompleteRide}
                  isCompleting={isCompleting}
              />
          </div>
        )}
      </div>

      <div className="container py-8">
          <RideHistory key={historyKey} />
      </div>

    </div>
  );
}

    