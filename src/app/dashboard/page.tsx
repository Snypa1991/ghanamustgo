
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { LayoutDashboard, Power } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/app-context';
import { Skeleton } from '@/components/ui/skeleton';

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
    if (isOnline) {
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
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [isOnline]);

  const partnerIcon = useMemo(() => {
    if (user && isLoaded) {
      return {
        url: `https://picsum.photos/seed/${user.email}/60/60`,
        scaledSize: new google.maps.Size(60, 60),
        anchor: new google.maps.Point(30, 30),
      };
    }
    return undefined;
  }, [user, isLoaded]);

  if (!user || (user.role !== 'biker' && user.role !== 'driver')) {
    return <div className="flex items-center justify-center min-h-screen">Redirecting...</div>;
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition || center}
          zoom={15}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
          }}
          onLoad={onMapLoad}
          onUnmount={onMapUnmount}
          className="absolute inset-0"
        >
          {currentPosition && partnerIcon && <Marker position={currentPosition} icon={partnerIcon} />}
        </GoogleMap>
      ) : (
        <Skeleton className="absolute inset-0" />
      )}

      <div className="absolute top-0 left-0 right-0 p-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-headline flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboard />
                {user.name}'s Dashboard
              </div>
              <div className="flex items-center space-x-2">
                <Switch 
                    id="online-status"
                    checked={isOnline}
                    onCheckedChange={setIsOnline} 
                    aria-label={isOnline ? 'Go Offline' : 'Go Online'}
                />
                <Label htmlFor="online-status" className={`font-bold transition-colors ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                    <Power className="inline-block mr-1 h-4 w-4" />
                    {isOnline ? 'Online' : 'Offline'}
                </Label>
               </div>
            </CardTitle>
          </CardHeader>
           {isOnline && (
             <CardContent>
                <div className="p-3 rounded-md bg-green-50 border border-green-200 text-center text-sm text-green-800">
                    You are online and visible for new requests. Your location is being tracked.
                </div>
             </CardContent>
           )}
        </Card>
      </div>
    </div>
  );
}
