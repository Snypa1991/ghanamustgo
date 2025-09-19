"use server";

import { optimizeRouteWithAI, OptimizeRouteWithAIInput } from '@/ai/flows/optimize-route-with-ai';
import { suggestListingFee, SuggestListingFeeInput } from '@/ai/flows/suggest-listing-fee';

export async function getOptimizedRoute(input: OptimizeRouteWithAIInput) {
  try {
    const result = await optimizeRouteWithAI(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to optimize route." };
  }
}

export async function getSuggestedFee(input: SuggestListingFeeInput) {
  try {
    const result = await suggestListingFee(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to suggest a fee." };
  }
}
