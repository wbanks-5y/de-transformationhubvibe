
/**
 * OpenAI configuration for the Myles AI assistant
 */
import { OpenAIOptions } from "./types.ts";

/**
 * Creates the OpenAI API configuration for the chat completion request
 * 
 * @param conversationalPrompt - The formatted conversational prompt
 * @returns OpenAI configuration options
 */
export function createOpenAIConfig(conversationalPrompt: string): OpenAIOptions {
  return {
    model: "gpt-4o-mini", // Using the fastest model available
    messages: [
      {
        role: "system",
        content: "You are Myles, a friendly, conversational business analyst who provides actionable insights on all cockpit dashboards and business analytics in a warm, approachable way. Keep responses concise and conversational - aim for 2-3 paragraphs maximum. IMPORTANT: Use British English spelling and terminology throughout all responses (e.g., 'optimise' not 'optimize', 'analyse' not 'analyze', 'colour' not 'color', 'realise' not 'realize')."
      },
      {
        role: "user",
        content: conversationalPrompt
      }
    ],
    temperature: 0.7, // Slightly higher for more conversational tone
    max_tokens: 400 // Reduced significantly for more concise responses
  };
}
