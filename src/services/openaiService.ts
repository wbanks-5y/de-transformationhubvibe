
/**
 * OpenAI Service - Provides functions for making API calls to OpenAI
 */

// Type for API options
interface OpenAIOptions {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

// OpenAI response type
interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    index: number;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const openaiService = {
  /**
   * Send a message to OpenAI's API
   */
  sendMessage: async (apiKey: string, prompt: string): Promise<string> => {
    if (!apiKey) {
      throw new Error("OpenAI API key is required");
    }

    const businessAnalystPrompt = `You are Myles, an experienced business analyst assisting with business transformation. 
    You provide analytical, data-driven perspectives on business challenges and opportunities.
    You should analyze questions carefully, consider multiple angles, and provide well-structured responses.
    Always include:
    - Business impact analysis
    - Data-backed insights when possible
    - Actionable recommendations
    - Potential risks and mitigation strategies
    
    Maintain a professional, consultative tone. When specific data is not provided, acknowledge this and explain what data would be helpful.
    
    User's question: ${prompt}`;

    const options: OpenAIOptions = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are Myles, a business analyst AI assistant that specializes in business transformation and process improvement."
        },
        {
          role: "user",
          content: businessAnalystPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    };

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(options)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      throw error;
    }
  }
};
