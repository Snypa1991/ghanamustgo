
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bot, ThumbsUp, ThumbsDown, Star, Loader2, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getReviewSummary } from '@/app/actions';
import type { SummarizeReviewsOutput } from '@/ai/flows/summarize-reviews';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  reviews: z.string().min(10, 'Please provide some reviews, separated by new lines.'),
  topic: z.string().min(1, 'Topic is required.'),
});

type ReviewSummarizerFormValues = z.infer<typeof formSchema>;

const sampleReviews = [
    "Jollof King is the best! The smokey flavor is authentic and the chicken was perfectly grilled. A bit pricey but worth it.",
    "Waited 45 minutes for my order, and it was cold. Very disappointed with the service at Jollof King.",
    "Incredible food, amazing atmosphere. I recommend the banku with tilapia. Will be back for sure!",
    "The delivery rider was rude. The food was okay, but the experience was ruined.",
    "A solid 4/5. The jollof is great, but parking is a nightmare. Better to order for delivery.",
].join('\n');

export default function ReviewSummarizer() {
  const [result, setResult] = useState<SummarizeReviewsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ReviewSummarizerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: 'Jollof King Restaurant',
      reviews: sampleReviews,
    },
  });

  async function onSubmit(values: ReviewSummarizerFormValues) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    const reviewList = values.reviews.split('\n').filter(review => review.trim() !== '');
    const response = await getReviewSummary({ reviews: reviewList, topic: values.topic });

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
        <CardTitle className="font-headline flex items-center gap-2"><Bot /> Smart Review Summarizer</CardTitle>
        <CardDescription>Paste raw customer reviews to get a structured summary, sentiment analysis, and key takeaways.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product/Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jollof King Restaurant" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
             <FormField
                control={form.control}
                name="reviews"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Reviews (one per line)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Paste reviews here..." {...field} rows={8} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Star className="mr-2 h-4 w-4" />}
              Summarize Reviews
            </Button>
          </CardFooter>
        </form>
      </Form>

      {isLoading && (
         <div className="p-6 pt-0">
             <div className="flex items-center justify-center rounded-md border border-dashed p-8">
                 <Loader2 className="h-8 w-8 animate-spin text-primary" />
                 <p className="ml-4 text-muted-foreground">Analyzing reviews...</p>
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
              <Star className="h-5 w-5 text-primary" />
              <AlertTitle className="font-headline text-primary">Summary</AlertTitle>
              <AlertDescription>{result.summary}</AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg font-headline flex items-center gap-2"><Gauge/> Overall Sentiment</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={(result.sentimentScore + 1) * 50} className="h-4" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>Very Negative</span>
                        <span>Neutral</span>
                        <span>Very Positive</span>
                    </div>
                     <p className="text-center text-xl font-bold mt-3 text-primary">{result.sentimentScore.toFixed(2)}</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="bg-green-50 dark:bg-green-900/20">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center gap-2 text-green-700 dark:text-green-400"><ThumbsUp /> Positive Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="list-disc pl-5 space-y-2">
                           {result.positivePoints.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </CardContent>
                </Card>
                 <Card className="bg-red-50 dark:bg-red-900/20">
                    <CardHeader>
                        <CardTitle className="text-lg font-headline flex items-center gap-2 text-red-700 dark:text-red-400"><ThumbsDown /> Negative Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                       <ul className="list-disc pl-5 space-y-2">
                           {result.negativePoints.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </Card>
  );
}
