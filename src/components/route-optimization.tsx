
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
  submitButtonText?: string;
}

export default function RouteOptimization({ 
    startLocation,
    endLocation,
    onRouteUpdate, 
    onPinLocation,
    onSubmit, 
    isLoading,
    submitButtonText = 'Find Ride'
}: RouteOptimizationProps) {
  
  const form = useForm<RouteOptimizationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
    },
  });

  const { watch, setValue } = form;

  // Update form fields when props change from the parent (e.g., after pinning on map)
  useEffect(() => {
    if (startLocation !== form.getValues('startLocation')) {
      setValue('startLocation', startLocation);
    }
    if (endLocation !== form.getValues('endLocation')) {
      setValue('endLocation', endLocation);
    }
  }, [startLocation, endLocation, setValue, form]);

  // Notify parent component when form fields change due to user typing
  useEffect(() => {
    const subscription = watch((value) => {
      onRouteUpdate(value.startLocation || '', value.endLocation || '');
    });
    return () => subscription.unsubscribe();
  }, [watch, onRouteUpdate]);

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
                         <Button variant="ghost" size="sm" type="button" onClick={() => onPinLocation('start')} className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs px-2">
                             Pin on map
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
          { onSubmit &&
          <div className="mt-4">
            <Button type="submit" disabled={isLoading} className="w-full h-11" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
              {submitButtonText}
            </Button>
          </div>
          }
        </form>
      </Form>
    </div>
  );
}
