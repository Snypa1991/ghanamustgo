'use server';

/**
 * @fileOverview AI tool to summarize customer reviews.
 *
 * - summarizeReviews - A function that summarizes reviews.
 * - SummarizeReviewsInput - The input type for the summarizeReviews function.
 * - SummarizeReviewsOutput - The return type for the summarizeReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeReviewsInputSchema = z.object({
  reviews: z.array(z.string()).describe('A list of customer reviews.'),
  topic: z.string().describe('The topic of the reviews (e.g., a restaurant name, a product).'),
});
export type SummarizeReviewsInput = z.infer<typeof SummarizeReviewsInputSchema>;

const SummarizeReviewsOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the reviews.'),
  positivePoints: z.array(z.string()).describe('A list of key positive points mentioned in the reviews.'),
  negativePoints: z.array(z.string()).describe('A list of key negative points or areas for improvement.'),
  sentimentScore: z.number().describe('A score from -1 (very negative) to 1 (very positive) representing the overall sentiment.'),
});
export type SummarizeReviewsOutput = z.infer<typeof SummarizeReviewsOutputSchema>;

export async function summarizeReviews(input: SummarizeReviewsInput): Promise<SummarizeReviewsOutput> {
  return summarizeReviewsFlow(input);
}

const summarizeReviewsPrompt = ai.definePrompt({
  name: 'summarizeReviewsPrompt',
  input: {schema: SummarizeReviewsInputSchema},
  output: {schema: SummarizeReviewsOutputSchema},
  prompt: `You are an expert review analyst. You have been given a list of reviews for '{{{topic}}}'.

  Your task is to analyze these reviews and provide a summary.

  Reviews:
  {{#each reviews}}
  - "{{{this}}}"
  {{/each}}

  Based on the reviews, provide:
  1. A concise overall summary.
  2. A list of the main positive points.
  3. A list of the main negative points or areas for improvement.
  4. An overall sentiment score from -1 (very negative) to 1 (very positive).
  `,
});

const summarizeReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeReviewsFlow',
    inputSchema: SummarizeReviewsInputSchema,
    outputSchema: SummarizeReviewsOutputSchema,
  },
  async input => {
    if (input.reviews.length === 0) {
        return {
            summary: "No reviews provided to analyze.",
            positivePoints: [],
            negativePoints: [],
            sentimentScore: 0,
        }
    }
    const {output} = await summarizeReviewsPrompt(input);
    return output!;
  }
);
