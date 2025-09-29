
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Map, Clock, Fuel, Loader2, Navigation, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getOptimizedRoute } from '@/app/actions';
import type { OptimizeRouteWithAIOutput } from '@/ai/flows/optimize-route-with-ai';

const formSchema = z.object({
  startLocation: z.string().min(1, 'Start location is required'),
  endLocation: z.string().min(1, 'End location is required'),
});

type RouteOptimizationFormValues = z.infer<typeof formSchema>;

interface RouteOptimizationProps {
  onRouteUpdate?: (startLocation: string, endLocation: string) => void;
  onSubmit: (values: RouteOptimizationFormValues) => void;
  isLoading: boolean;
}

export default function RouteOptimization({ onRouteUpdate, onSubmit, isLoading }: RouteOptimizationProps) {
  const form = useForm<RouteOptimizationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: 'East Legon, American House',
      endLocation: 'Osu Oxford Street',
    },
  });

  const { watch } = form;
  const startLocation = watch('startLocation');
  const endLocation = watch('endLocation');

  useEffect(() => {
    if (onRouteUpdate) {
        onRouteUpdate(startLocation, endLocation);
    }
  }, [startLocation, endLocation, onRouteUpdate]);


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
                        <Button variant="ghost" size="sm" type="button" onClick={() => form.setValue('startLocation', 'East Legon, American House')} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2">
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
                         <Button variant="ghost" size="sm" type="button" onClick={() => form.setValue('endLocation', 'Osu Oxford Street')} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2">
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
