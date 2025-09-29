
"use client";

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  startLocation: z.string().min(1, 'Start location is required'),
  endLocation: z.string().min(1, 'End location is required'),
});

type RouteOptimizationFormValues = z.infer<typeof formSchema>;

interface RouteOptimizationProps {
  startLocation: string;
  endLocation: string;
  onRouteUpdate: (startLocation: string, endLocation: string) => void;
  onPinLocation: (locationType: 'start' | 'end') => void;
  onSubmit: (values: RouteOptimizationFormValues) => void;
  isLoading: boolean;
}

export default function RouteOptimization({ 
    startLocation,
    endLocation,
    onRouteUpdate, 
    onPinLocation,
    onSubmit, 
    isLoading 
}: RouteOptimizationProps) {
  
  const form = useForm<RouteOptimizationFormValues>({
    resolver: zodResolver(formSchema),
    values: {
      startLocation,
      endLocation
    }
  });

  const { watch, setValue } = form;
  const watchedStart = watch('startLocation');
  const watchedEnd = watch('endLocation');

  useEffect(() => {
    onRouteUpdate(watchedStart, watchedEnd);
  }, [watchedStart, watchedEnd, onRouteUpdate]);

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // In a real app, you'd use a geocoding service to convert coords to address
                setValue('startLocation', `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
            },
            () => {
                alert('Could not get current location. Please enable location services.');
            }
        );
    } else {
        alert('Geolocation is not supported by this browser.');
    }
  };


  return (
    <div className="w-full">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4">
             <div className="grid grid-cols-1 gap-4">
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
                        <Button variant="ghost" size="sm" type="button" onClick={handleGetCurrentLocation} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2">
                             Use Current
                        </Button>
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
                         <Button variant="ghost" size="sm" type="button" onClick={() => onPinLocation('end')} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2">
                             Pin on map
                        </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" disabled={isLoading} className="w-full h-11" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
              Find Ride
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
