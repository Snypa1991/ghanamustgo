
"use client";

import { useState, useMemo, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Loader2, Package, Bot, CheckCircle, Navigation } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/app-context';
import { getSuggestedDeliveryFee } from '@/app/actions';
import type { SuggestDeliveryFeeOutput } from '@/ai/flows/suggest-delivery-fee';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RouteOptimization from '@/components/route-optimization';

type DispatchStep = 'details' | 'confirming' | 'confirmed';
type PinningLocation = 'start' | 'end' | null;

const formSchema = z.object({
  startLocation: z.string().min(1, 'Pickup location is required'),
  endLocation: z.string().min(1, 'Delivery location is required'),
  recipientName: z.string().min(1, "Recipient's name is required"),
  recipientPhone: z.string().min(1, "Recipient's phone is required"),
  packageSize: z.enum(['small', 'medium', 'large']),
  packageDescription: z.string().min(3, "Please describe the package"),
});

type DispatchFormValues = z.infer<typeof formSchema>;

const containerStyle = {
  width: '100%',
  height: '100%'
};

// Accra, Ghana coordinates
const center = {
  lat: 5.6037,
  lng: -0.1870
};

export default function DispatchPage() {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ['places']
  });
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<DispatchStep>('details');
  const [pinningLocation, setPinningLocation] = useState<PinningLocation>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [feeResult, setFeeResult] = useState<SuggestDeliveryFeeOutput | null>(null);
  const [formValues, setFormValues] = useState<DispatchFormValues | null>(null);
  
  const [markers, setMarkers] = useState<{ start: google.maps.LatLng | null, end: google.maps.LatLng | null }>({ start: null, end: null });

  const mapRef = useRef<google.maps.Map | null>(null);

  const form = useForm<DispatchFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: '',
      endLocation: '',
      recipientName: '',
      recipientPhone: '',
      packageSize: 'small',
      packageDescription: '',
    },
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (!pinningLocation || !e.latLng) return;

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: e.latLng }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
            const address = results[0].formatted_address;
            const newLatLng = e.latLng!;
            if (pinningLocation === 'start') {
                form.setValue('startLocation', address);
                setMarkers(prev => ({...prev, start: newLatLng}));
            } else {
                form.setValue('endLocation', address);
                setMarkers(prev => ({...prev, end: newLatLng}));
            }
        } else {
            toast({
                variant: 'destructive',
                title: 'Could not get address',
                description: 'Failed to reverse geocode the selected location.'
            })
        }
        setPinningLocation(null); 
    });
  }, [pinningLocation, toast, form]);
  
  async function handleGetFee(values: DispatchFormValues) {
    setIsLoading(true);
    setFeeResult(null);
    setFormValues(values);
    
    // Simulate getting distance from map markers or an API
    let distanceInKm = 10;
     if (markers.start && markers.end && window.google) {
        distanceInKm = google.maps.geometry.spherical.computeDistanceBetween(markers.start, markers.end) / 1000;
    }

    const response = await getSuggestedDeliveryFee({
      distance: distanceInKm,
      packageSize: values.packageSize,
      urgency: 'standard' // Could be an option in the form
    });

    if (response.success && response.data) {
      setFeeResult(response.data);
      setStep('confirming');
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error || "Could not calculate delivery fee."
      })
    }
    
    setIsLoading(false);
  }

  const handleConfirmDispatch = () => {
    // In a real app, this would submit the dispatch request to the backend
    setStep('confirmed');
  }
  
  const handleNewDispatch = () => {
    setStep('details');
    setFeeResult(null);
    form.reset();
    setMarkers({ start: null, end: null });
  }

  const handleRouteUpdate = async (start: string, end: string) => {
    const geocoder = new window.google.maps.Geocoder();
    const newMarkers = { ...markers };

    if (start && start !== form.getValues('startLocation')) {
      try {
        const results = await geocoder.geocode({ address: start });
        newMarkers.start = results.results[0].geometry.location;
      } catch (e) {
        console.warn("Could not geocode start location from text input");
        newMarkers.start = null;
      }
    }
    if (end && end !== form.getValues('endLocation')) {
      try {
        const results = await geocoder.geocode({ address: end });
        newMarkers.end = results.results[0].geometry.location;
      } catch(e) {
        console.warn("Could not geocode end location from text input");
        newMarkers.end = null;
      }
    }
    
    form.setValue('startLocation', start);
    form.setValue('endLocation', end);
    setMarkers(newMarkers);
  };
  
  useEffect(() => {
    if (markers.start && markers.end && mapRef.current) {
        const bounds = new window.google.maps.LatLngBounds();
        bounds.extend(markers.start);
        bounds.extend(markers.end);
        mapRef.current.fitBounds(bounds);
    }
  }, [markers]);


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
            zoomControl: true,
            gestureHandling: 'cooperative'
          }}
          onLoad={onMapLoad}
          onClick={onMapClick}
        >
            {markers.start && <Marker position={markers.start} label="P" />}
            {markers.end && <Marker position={markers.end} label="D" />}
        </GoogleMap>
      ) : (
        <Skeleton className="absolute inset-0" />
      )}

      <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-auto sm:right-8 sm:w-full sm:max-w-sm">
        
        {step === 'details' && (
          <Card className="shadow-2xl">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Send a Package</CardTitle>
                <CardDescription>Fill in the details to get a dispatch rider.</CardDescription>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleGetFee)}>
                  <CardContent className="space-y-4 max-h-[50vh] overflow-y-auto pr-3">
                     <RouteOptimization 
                        startLocation={form.getValues('startLocation')}
                        endLocation={form.getValues('endLocation')}
                        onRouteUpdate={handleRouteUpdate} 
                        onPinLocation={setPinningLocation}
                        onSubmit={() => {}} 
                        isLoading={false}
                    />
                    <FormField
                      control={form.control}
                      name="recipientName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Name</FormLabel>
                          <FormControl><Input placeholder="Ama Mensah" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="recipientPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recipient Phone</FormLabel>
                          <FormControl><Input placeholder="024 123 4567" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="packageSize"
                      render={({ field }) => (
                        <FormItem>
                           <FormLabel>Package Size</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger><SelectValue placeholder="Select package size" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="small">Small (Envelope, food pack)</SelectItem>
                              <SelectItem value="medium">Medium (Shoe box, laptop bag)</SelectItem>
                              <SelectItem value="large">Large (Small suitcase, box)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="packageDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Package Description</FormLabel>
                          <FormControl><Textarea placeholder="e.g., A gift-wrapped shoe box" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                     <Button type="submit" disabled={isLoading} className="w-full h-11" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Package className="mr-2 h-4 w-4" />}
                        Get Delivery Fee
                     </Button>
                  </CardFooter>
                </form>
              </Form>
          </Card>
        )}

        {step === 'confirming' && feeResult && formValues && (
             <Card className="shadow-2xl">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl">Confirm Dispatch</CardTitle>
                    <CardDescription>Review the details and confirm your request.</CardDescription>
                </CardHeader>
                 <CardContent className="space-y-4">
                     <Alert className="text-center text-sm bg-primary/5 border-primary/20">
                        <Bot className="h-4 w-4" />
                        <AlertTitle className="font-semibold">AI Suggested Fee</AlertTitle>
                        <AlertDescription>{feeResult.reasoning}</AlertDescription>
                    </Alert>

                     <div className="text-center p-4 rounded-lg bg-muted">
                        <p className="text-sm text-muted-foreground">Delivery Fee</p>
                        <p className="text-4xl font-bold text-primary">GH₵ {feeResult.suggestedFee.toFixed(2)}</p>
                    </div>

                    <div className="text-sm space-y-2">
                        <p><strong className="font-medium">From:</strong> {formValues.startLocation}</p>
                        <p><strong className="font-medium">To:</strong> {formValues.endLocation}</p>
                        <p><strong className="font-medium">Recipient:</strong> {formValues.recipientName} ({formValues.recipientPhone})</p>
                    </div>

                 </CardContent>
                 <CardFooter className="grid grid-cols-2 gap-4">
                    <Button variant="outline" onClick={() => setStep('details')}>Back</Button>
                    <Button onClick={handleConfirmDispatch}>
                        <CheckCircle className="mr-2 h-4 w-4" /> Confirm & Find Rider
                    </Button>
                 </CardFooter>
            </Card>
        )}

        {step === 'confirmed' && (
             <Card className="shadow-2xl">
                <CardHeader className="text-center">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                    <CardTitle className="font-headline mt-4">Dispatch Requested</CardTitle>
                    <CardDescription>We are finding a nearby rider for your package. You will be notified shortly.</CardDescription>
                </CardHeader>
                 <CardContent className="flex justify-center">
                    <Loader2 className="h-8 w-8 text-primary animate-spin" />
                 </CardContent>
                 <CardFooter>
                    <Button variant="outline" className="w-full" onClick={handleNewDispatch}>Start a New Dispatch</Button>
                 </CardFooter>
             </Card>
        )}

      </div>
    </div>
  );
}
