"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Map, Clock, Fuel, Loader2, Navigation } from 'lucide-react';
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

export default function AdminRouteOptimization() {
  const [result, setResult] = useState<OptimizeRouteWithAIOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RouteOptimizationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      startLocation: 'Accra Mall',
      endLocation: 'Labadi Beach',
    },
  });

  async function onSubmit(values: RouteOptimizationFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const response = await getOptimizedRoute(values);
    if (response.success && response.data) {
      setResult(response.data);
    } else {
      setError(response.error || 'An unknown error occurred.');
    }
    setIsLoading(false);
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2"><Bot /> AI Route Optimizer</CardTitle>
        <CardDescription>Find the most efficient route between two points using AI analysis of traffic patterns.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Accra Mall" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Labadi Beach" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Navigation className="mr-2 h-4 w-4" />}
              Optimize Route
            </Button>
          </CardFooter>
        </form>
      </Form>

      {isLoading && (
         <div className="p-6 pt-0">
             <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-4 text-muted-foreground">AI is optimizing...</p>
             </div>
         </div>
      )}

      {error && (
        <div className="p-6 pt-0">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        </div>
      )}
      
      {result && (
        <div className="p-6 pt-0 space-y-4">
            <Alert className="bg-primary/5">
              <Map className="h-5 w-5 text-primary" />
              <AlertTitle className="font-headline text-primary">Optimized Route</AlertTitle>
              <AlertDescription className="whitespace-pre-wrap">{result.optimizedRoute}</AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Travel Time</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{result.estimatedTravelTime}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Fuel Savings</CardTitle>
                        <Fuel className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{result.fuelSavingsEstimate}</div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </Card>
  );
}
