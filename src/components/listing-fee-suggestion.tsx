
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, Tag, DollarSign, BrainCircuit, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getSuggestedFee } from '@/app/actions';
import type { SuggestListingFeeOutput } from '@/ai/flows/suggest-listing-fee';

const formSchema = z.object({
  itemDescription: z.string().min(10, 'Please provide a detailed description.'),
  itemValue: z.coerce.number().min(1, 'Item value must be at least $1.'),
  marketTrends: z.string().min(1, 'Market trends are required.'),
  competition: z.string().min(1, 'Competition info is required.'),
});

type ListingFeeFormValues = z.infer<typeof formSchema>;

export default function ListingFeeSuggestion() {
  const [result, setResult] = useState<SuggestListingFeeOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ListingFeeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemDescription: 'Hand-woven Kente cloth, vibrant colors, 12 yards, authentic from the Ashanti region.',
      itemValue: 150,
      marketTrends: 'High demand for handmade and authentic African textiles, especially for cultural events.',
      competition: 'Few similar items listed. Other Kente cloths are priced between $120 and $200 depending on complexity.',
    },
  });

  async function onSubmit(values: ListingFeeFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const response = await getSuggestedFee(values);
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
        <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            <CardTitle className="font-headline">Smart Fee Suggestion</CardTitle>
        </div>
        <CardDescription>Get a fee recommendation to sell your item quickly and profitably.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="itemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Hand-woven Kente cloth, vibrant colors, 12 yards..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estimated Value (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Trends</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., High demand for traditional textiles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="competition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Competition</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Similar items priced at $150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading} style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Suggest Fee
            </Button>
          </CardFooter>
        </form>
      </Form>

      {isLoading && (
         <div className="p-6 pt-0">
             <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-4 text-muted-foreground">Calculating...</p>
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
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Tag className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                             <CardTitle className="font-headline text-primary">Suggested Listing Fee</CardTitle>
                             <p className="text-3xl font-bold">${result.suggestedFee.toFixed(2)}</p>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Alert variant="default">
              <BrainCircuit className="h-4 w-4" />
              <AlertTitle className="font-headline">Reasoning</AlertTitle>
              <AlertDescription>{result.reasoning}</AlertDescription>
            </Alert>
        </div>
      )}
    </Card>
  );
}
