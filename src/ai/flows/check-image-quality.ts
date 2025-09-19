'use server';

/**
 * @fileOverview An AI tool to check the quality of an uploaded image.
 *
 * - checkImageQuality - A function that determines if an image is blurry or clear.
 * - CheckImageQualityInput - The input type for the checkImageQuality function.
 * - CheckImageQualityOutput - The return type for the checkImageQuality function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CheckImageQualityInputSchema = z.object({
  imageDataUri: z
    .string()
    .describe(
      "An image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type CheckImageQualityInput = z.infer<typeof CheckImageQualityInputSchema>;

const CheckImageQualityOutputSchema = z.object({
  isBlurry: z.boolean().describe('Whether the image is considered blurry or not.'),
  reasoning: z.string().describe('The reasoning behind the blurriness assessment.'),
});
export type CheckImageQualityOutput = z.infer<typeof CheckImageQualityOutputSchema>;

export async function checkImageQuality(input: CheckImageQualityInput): Promise<CheckImageQualityOutput> {
  return checkImageQualityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'checkImageQualityPrompt',
  input: {schema: CheckImageQualityInputSchema},
  output: {schema: CheckImageQualityOutputSchema},
  prompt: `You are an expert image analyst. Your task is to determine if the provided image is blurry or clear. The image is of an official document or a vehicle. It is critical that the text and details are readable.

Analyze the provided image and determine if it is sufficiently clear for a human to read the details.

Image: {{media url=imageDataUri}}

Set the isBlurry flag to true if the image is blurry, and provide a short reasoning.
`,
});

const checkImageQualityFlow = ai.defineFlow(
  {
    name: 'checkImageQualityFlow',
    inputSchema: CheckImageQualityInputSchema,
    outputSchema: CheckImageQualityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
