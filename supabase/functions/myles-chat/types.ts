
export interface ChatRequest {
  prompt: string;
  userId?: string;
  moduleContext?: string;
  conversationHistory?: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
    module?: string;
  }>;
}

export interface OpenAIOptions {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}
