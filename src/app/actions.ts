"use server";

import { optimizeRouteWithAI, OptimizeRouteWithAIInput } from '@/ai/flows/optimize-route-with-ai';
import { suggestListingFee, SuggestListingFeeInput } from '@/ai/flows/suggest-listing-fee';
import { summarizeReviews, SummarizeReviewsInput } from '@/ai/flows/summarize-reviews';
import { checkImageQuality, CheckImageQualityInput } from '@/ai/flows/check-image-quality';

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

export async function getReviewSummary(input: SummarizeReviewsInput) {
  try {
    const result = await summarizeReviews(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to summarize reviews." };
  }
}

export async function checkImage(input: CheckImageQualityInput) {
  try {
    const result = await checkImageQuality(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to check image quality." };
  }
}
