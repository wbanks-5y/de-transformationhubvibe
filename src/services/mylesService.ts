
import { supabase } from '@/integrations/supabase/client';

interface MylesResponse {
  content: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  responseTime?: number;
  error?: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  module?: string;
}

export const mylesService = {
  /**
   * Send a message to Myles AI assistant via Supabase Edge Function
   * Now includes full conversation history for contextual awareness
   */
  sendMessage: async (
    prompt: string, 
    userId?: string, 
    moduleContext?: string, 
    conversationHistory?: ConversationMessage[]
  ): Promise<string> => {
    if (!prompt || prompt.trim() === '') {
      throw new Error('Prompt is required');
    }

    try {
      console.log(`Sending request to Myles Edge Function with conversation history: ${conversationHistory?.length || 0} messages`);
      console.log(`Prompt: ${prompt.substring(0, 50)}...`);
      
      const startTime = Date.now();
      const { data, error } = await supabase.functions.invoke('myles-chat', {
        body: { 
          prompt, 
          userId,
          moduleContext,
          conversationHistory
        }
      });
      const elapsed = Date.now() - startTime;
      console.log(`Edge function responded in ${elapsed}ms`);

      if (error) {
        console.error('Error calling Myles Edge Function:', error);
        throw new Error(`Failed to get response: ${error.message}`);
      }

      if (!data) {
        console.error('No data returned from Myles Edge Function');
        throw new Error('No response received from assistant');
      }

      const response = data as MylesResponse;
      
      if (!response.content) {
        console.error('Invalid response format:', response);
        if (response.error) {
          throw new Error(`Assistant error: ${response.error}`);
        }
        throw new Error('Received invalid response format from assistant');
      }
      
      // Log performance metrics if available
      if (response.responseTime) {
        console.log(`Total Myles processing time: ${response.responseTime}ms`);
      }
      if (response.usage) {
        console.log(`Token usage: ${response.usage.total_tokens} (${response.usage.prompt_tokens} prompt, ${response.usage.completion_tokens} completion)`);
      }
      
      return response.content;
    } catch (error) {
      console.error('Error calling Myles Edge Function:', error);
      throw error;
    }
  }
};
