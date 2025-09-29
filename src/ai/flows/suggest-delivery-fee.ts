
'use server';

/**
 * @fileOverview AI tool to suggest a delivery fee based on distance, package size, and urgency.
 *
 * - suggestDeliveryFee - A function that suggests a delivery fee.
 * - SuggestDeliveryFeeInput - The input type for the suggestDeliveryFee function.
 * - SuggestDeliveryFeeOutput - The return type for the suggestDeliveryFee function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDeliveryFeeInputSchema = z.object({
  distance: z.number().describe('The travel distance in kilometers.'),
  packageSize: z.enum(['small', 'medium', 'large']).describe('The size of the package.'),
  urgency: z.enum(['standard', 'express']).describe('The delivery urgency.'),
});
export type SuggestDeliveryFeeInput = z.infer<typeof SuggestDeliveryFeeInputSchema>;

const SuggestDeliveryFeeOutputSchema = z.object({
  suggestedFee: z.number().describe('The suggested delivery fee in GH₵.'),
  reasoning: z.string().describe('The reasoning behind the suggested fee.'),
});
export type SuggestDeliveryFeeOutput = z.infer<typeof SuggestDeliveryFeeOutputSchema>;

export async function suggestDeliveryFee(input: SuggestDeliveryFeeInput): Promise<SuggestDeliveryFeeOutput> {
  return suggestDeliveryFeeFlow(input);
}

const suggestDeliveryFeePrompt = ai.definePrompt({
  name: 'suggestDeliveryFeePrompt',
  input: {schema: SuggestDeliveryFeeInputSchema},
  output: {schema: SuggestDeliveryFeeOutputSchema},
  prompt: `You are an expert logistics pricer for Accra, Ghana. Your task is to suggest a delivery fee in Ghana Cedis (GH₵).

  Base your calculation on the following factors:
  - Base Fare: GH₵ 10
  - Per Kilometer: GH₵ 2.5 per km
  - Package Size Surcharge:
    - small: + GH₵ 0
    - medium: + GH₵ 5
    - large: + GH₵ 15
  - Urgency Surcharge:
    - standard: + GH₵ 0
    - express: + 50% of total fee

  Distance: {{{distance}}} km
  Package Size: {{{packageSize}}}
  Urgency: {{{urgency}}}

  Calculate the suggested fee and provide a brief reasoning. For example: "Based on a 5km trip for a medium package..."
  `,
});

const suggestDeliveryFeeFlow = ai.defineFlow(
  {
    name: 'suggestDeliveryFeeFlow',
    inputSchema: SuggestDeliveryFeeInputSchema,
    outputSchema: SuggestDeliveryFeeOutputSchema,
  },
  async input => {
    const {output} = await suggestDeliveryFeePrompt(input);
    return output!;
  }
);
