'use server';

/**
 * @fileOverview AI tool to suggest a listing fee for items based on market trends, item value, and competition.
 *
 * - suggestListingFee - A function that suggests a listing fee.
 * - SuggestListingFeeInput - The input type for the suggestListingFee function.
 * - SuggestListingFeeOutput - The return type for the suggestListingFee function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestListingFeeInputSchema = z.object({
  itemDescription: z.string().describe('Description of the item being listed.'),
  itemValue: z.number().describe('Estimated value of the item in USD.'),
  marketTrends: z.string().describe('Current market trends for similar items.'),
  competition: z.string().describe('Information about competing listings.'),
});
export type SuggestListingFeeInput = z.infer<typeof SuggestListingFeeInputSchema>;

const SuggestListingFeeOutputSchema = z.object({
  suggestedFee: z.number().describe('The suggested listing fee in USD.'),
  reasoning: z.string().describe('The reasoning behind the suggested fee.'),
});
export type SuggestListingFeeOutput = z.infer<typeof SuggestListingFeeOutputSchema>;

export async function suggestListingFee(input: SuggestListingFeeInput): Promise<SuggestListingFeeOutput> {
  return suggestListingFeeFlow(input);
}

const suggestListingFeePrompt = ai.definePrompt({
  name: 'suggestListingFeePrompt',
  input: {schema: SuggestListingFeeInputSchema},
  output: {schema: SuggestListingFeeOutputSchema},
  prompt: `You are an expert marketplace listing fee advisor.

  Based on the item description, its value, current market trends, and the competition, suggest a listing fee that maximizes revenue while remaining competitive.

  Item Description: {{{itemDescription}}}
  Item Value: {{{itemValue}}}
  Market Trends: {{{marketTrends}}}
  Competition: {{{competition}}}

  Consider all these factors and suggest a listing fee.
  Include the reasoning for your suggested fee.
  `,
});

const suggestListingFeeFlow = ai.defineFlow(
  {
    name: 'suggestListingFeeFlow',
    inputSchema: SuggestListingFeeInputSchema,
    outputSchema: SuggestListingFeeOutputSchema,
  },
  async input => {
    const {output} = await suggestListingFeePrompt(input);
    return output!;
  }
);
