
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Power, Crosshair } from 'lucide-react';
import { useAuth } from '@/context/app-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Accra, Ghana coordinates
const center = {
  lat: 5.6037,
  lng: -0.1870
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  const [isOnline, setIsOnline] = useState(false);
  const [currentPosition, setCurrentPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [userInteracted, setUserInteracted] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

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


  useEffect(() => {
    if (!user || (user.role !== 'biker' && user.role !== 'driver')) {
      router.push('/login');
    }
  }, [user, router]);
  
  useEffect(() => {
    let watchId: number;

    if (isOnline && navigator.geolocation) {
      // Get initial position and center the map
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = { lat: latitude, lng: longitude };
          setCurrentPosition(newPos);
          if (mapRef.current) {
            mapRef.current.panTo(newPos);
            mapRef.current.setZoom(15);
          }
        },
        (error) => {
          console.error("Error getting initial position:", error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );

      // Watch for position changes
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = { lat: latitude, lng: longitude };
          setCurrentPosition(newPos);
          // Smoothly pan the map to the new position only if user has not interacted
          if (mapRef.current && !userInteracted) {
            mapRef.current.panTo(newPos);
          }
        },
        (error) => {
          console.error("Geolocation watch error:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setCurrentPosition(null);
      setUserInteracted(false);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline, userInteracted]);

  const partnerIcon = useMemo(() => {
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

  if (!user || (user.role !== 'biker' && user.role !== 'driver')) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full">
      <div className="absolute inset-0">
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
                  {
                      featureType: "poi",
                      stylers: [{ visibility: "off" }],
                  },
                  {
                      featureType: "transit",
                      stylers: [{ visibility: "off" }],
                  },
              ]
            }}
            onLoad={onMapLoad}
            onUnmount={onMapUnmount}
            onDragStart={onUserInteraction}
            onZoomChanged={onUserInteraction}
          >
            {currentPosition && partnerIcon && isOnline && (
              <>
                <Marker position={currentPosition} icon={partnerIcon} />
                <Circle
                    center={currentPosition}
                    radius={2000} // 2km radius
                    options={{
                        strokeColor: 'hsl(var(--primary))',
                        strokeOpacity: 0.8,
                        strokeWeight: 1,
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
      </div>

      <div className="absolute top-4 right-4 z-10">
        <button
            onClick={() => {
                setIsOnline(!isOnline);
                if(isOnline) setUserInteracted(true); // if going offline, disable auto-pan
                else setUserInteracted(false); // if going online, enable auto-pan
            }}
            className={cn(
                "relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors shadow-lg",
                isOnline ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"
            )}
            aria-label={isOnline ? 'Go Offline' : 'Go Online'}
        >
            <Power className="h-6 w-6 text-white" />
        </button>
      </div>

       {isLoaded && isOnline && userInteracted && (
          <div className="absolute bottom-28 right-4">
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
    </div>
  );
}
