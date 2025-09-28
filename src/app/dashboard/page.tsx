
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker, Circle } from '@react-google-maps/api';
import { Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/app-context';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

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

  const mapRef = useRef<google.maps.Map | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);


  useEffect(() => {
    if (!user || (user.role !== 'biker' && user.role !== 'driver')) {
      router.push('/login');
    }
  }, [user, router]);
  
  useEffect(() => {
    let watchId: number;
    if (isOnline && navigator.geolocation) {
      // Get initial position
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      });
      // Watch for position changes
      watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentPosition({ lat: latitude, lng: longitude });
      }, 
      (error) => {
        console.error("Geolocation error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    } else {
        setCurrentPosition(null);
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline]);

  const partnerIcon = useMemo(() => {
    if (user && isLoaded) {
      const imageUrl = `https://picsum.photos/seed/${user.email}/60/60`;
      const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
          <defs>
            <clipPath id="circle-clip">
              <circle cx="30" cy="30" r="26" />
            </clipPath>
          </defs>
          <circle cx="30" cy="30" r="28" fill="white" stroke="hsl(var(--primary))" stroke-width="2"/>
          <image href="${imageUrl}" x="4" y="4" width="52" height="52" clip-path="url(#circle-clip)" />
        </svg>`;
      
      return {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
        scaledSize: new window.google.maps.Size(60, 60),
        anchor: new window.google.maps.Point(30, 30),
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
            center={currentPosition || center}
            zoom={15}
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

      <div className="absolute top-0 left-0 right-0 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              <span>{user.name}</span>
              <div className="flex items-center space-x-2">
                <span className={cn("text-sm font-semibold", isOnline ? 'text-green-600' : 'text-red-600')}>
                    {isOnline ? 'Online' : 'Offline'}
                </span>
                <button
                    onClick={() => setIsOnline(!isOnline)}
                    className={cn(
                        "relative inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                        isOnline ? "bg-green-600" : "bg-red-600"
                    )}
                    aria-label={isOnline ? 'Go Offline' : 'Go Online'}
                >
                    <Power className="h-5 w-5 text-white" />
                </button>
               </div>
            </CardTitle>
          </CardHeader>
           {isOnline && (
             <CardContent>
                <div className="p-3 rounded-md bg-green-50 border border-green-200 text-center text-sm text-green-800">
                    You are online and visible for new requests within a 2km radius.
                </div>
             </CardContent>
           )}
        </Card>
      </div>
    </div>
  );
}
