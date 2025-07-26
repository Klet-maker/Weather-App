'use server';

/**
 * @fileOverview AI-powered weather alert generator.
 * 
 * - generateWeatherAlert - A function that generates a weather alert based on weather conditions.
 * - WeatherAlertInput - The input type for the generateWeatherAlert function.
 * - WeatherAlertOutput - The return type for the generateWeatherAlert function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherAlertInputSchema = z.object({
  city: z.string().describe('The city to generate a weather alert for.'),
  weatherDescription: z.string().describe('The current weather description for the city.'),
  temperature: z.number().describe('The current temperature in Celsius.'),
  humidity: z.number().describe('The current humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in kilometers per hour.'),
  language: z.string().describe('The language for the response (e.g., "en", "es", "fr").'),
});
export type WeatherAlertInput = z.infer<typeof WeatherAlertInputSchema>;

const WeatherAlertOutputSchema = z.object({
  alert: z.string().describe('The generated weather commentary and friendly recommendations.'),
});
export type WeatherAlertOutput = z.infer<typeof WeatherAlertOutputSchema>;

export async function generateWeatherAlert(input: WeatherAlertInput): Promise<WeatherAlertOutput> {
  return weatherAlertFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherAlertPrompt',
  input: {schema: WeatherAlertInputSchema},
  output: {schema: WeatherAlertOutputSchema},
  prompt: `You are a friendly and helpful weather assistant. Generate a short, conversational commentary for the city of {{city}} based on the following conditions:\n\nWeather Description: {{weatherDescription}}\nTemperature: {{temperature}}°C\nHumidity: {{humidity}}%\nWind Speed: {{windSpeed}} km/h\n\nProvide a general comment on what the weather is like (e.g., "It's a beautiful sunny day!" or "It's a bit chilly, so bundle up!"). Offer a practical recommendation, like whether it's a good day to be outside or if one should carry an umbrella. If the weather is dangerous, you must include a clear safety warning. Respond in the following language: {{language}}.`,
});

const weatherAlertFlow = ai.defineFlow(
  {
    name: 'weatherAlertFlow',
    inputSchema: WeatherAlertInputSchema,
    outputSchema: WeatherAlertOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
