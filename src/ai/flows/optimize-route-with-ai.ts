// OptimizeRouteWithAI.ts
'use server';

/**
 * @fileOverview A route optimization AI agent.
 *
 * - optimizeRouteWithAI - A function that handles the route optimization process.
 * - OptimizeRouteWithAIInput - The input type for the optimizeRouteWithAI function.
 * - OptimizeRouteWithAIOutput - The return type for the optimizeRouteWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeRouteWithAIInputSchema = z.object({
  startLocation: z.string().describe('The starting location for the route.'),
  endLocation: z.string().describe('The destination location for the route.'),
  currentTrafficConditions: z
    .string()
    .describe('Real-time traffic conditions along the route.'),
  shortestPathAlgorithm: z
    .string()
    .describe('The shortest path algorithm to use (e.g., Dijkstra, A*).'),
});
export type OptimizeRouteWithAIInput = z.infer<typeof OptimizeRouteWithAIInputSchema>;

const OptimizeRouteWithAIOutputSchema = z.object({
  optimizedRoute: z
    .string()
    .describe('The AI-optimized route considering traffic and shortest path.'),
  estimatedTravelTime: z
    .string()
    .describe('The estimated travel time for the optimized route.'),
  fuelSavingsEstimate: z
    .string()
    .describe('An estimate of fuel savings compared to a non-optimized route.'),
});
export type OptimizeRouteWithAIOutput = z.infer<typeof OptimizeRouteWithAIOutputSchema>;

export async function optimizeRouteWithAI(input: OptimizeRouteWithAIInput): Promise<OptimizeRouteWithAIOutput> {
  return optimizeRouteWithAIFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeRouteWithAIPrompt',
  input: {schema: OptimizeRouteWithAIInputSchema},
  output: {schema: OptimizeRouteWithAIOutputSchema},
  prompt: `You are an AI route optimization expert. Given the start and end locations, current traffic conditions, and the shortest path algorithm, provide the optimal route, estimated travel time, and estimated fuel savings.

Start Location: {{{startLocation}}}
End Location: {{{endLocation}}}
Current Traffic Conditions: {{{currentTrafficConditions}}}
Shortest Path Algorithm: {{{shortestPathAlgorithm}}}

Consider all factors to provide the best route.`,
});

const optimizeRouteWithAIFlow = ai.defineFlow(
  {
    name: 'optimizeRouteWithAIFlow',
    inputSchema: OptimizeRouteWithAIInputSchema,
    outputSchema: OptimizeRouteWithAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
