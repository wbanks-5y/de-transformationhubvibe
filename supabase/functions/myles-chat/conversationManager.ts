
/**
 * Manages conversation history and context for Myles AI assistant
 */

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  module?: string;
}

export interface ConversationContext {
  messages: ConversationMessage[];
  currentModule?: string;
  discussedTopics: string[];
  keyInsights: string[];
}

/**
 * Prepares conversation history for OpenAI API
 * Takes recent messages and formats them for the AI context
 */
export function prepareConversationHistory(messages: ConversationMessage[], maxMessages: number = 10): Array<{role: 'user' | 'assistant', content: string}> {
  // Take the most recent messages, but ensure we don't exceed token limits
  const recentMessages = messages.slice(-maxMessages);
  
  return recentMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));
}

/**
 * Analyzes conversation to extract key topics and insights
 */
export function analyzeConversation(messages: ConversationMessage[]): {
  discussedTopics: string[];
  keyInsights: string[];
  currentModule?: string;
  hasRelevantHistory: boolean;
} {
  const discussedTopics: string[] = [];
  const keyInsights: string[] = [];
  let currentModule: string | undefined;

  // Extract topics and insights from recent messages
  const recentMessages = messages.slice(-5); // Last 5 messages for context
  
  // Business topic keywords to identify actual business discussions
  const businessKeywords = [
    'sales', 'revenue', 'kpi', 'performance', 'target', 'metric', 'process', 
    'efficiency', 'cost', 'profit', 'customer', 'strategy', 'objective',
    'finance', 'operations', 'manufacturing', 'supply', 'warehouse'
  ];
  
  for (const message of recentMessages) {
    if (message.module) {
      currentModule = message.module;
      if (!discussedTopics.includes(message.module)) {
        discussedTopics.push(message.module);
      }
    }
    
    // Extract topics from message content
    const contentLower = message.content.toLowerCase();
    for (const keyword of businessKeywords) {
      if (contentLower.includes(keyword) && !discussedTopics.includes(keyword)) {
        discussedTopics.push(keyword);
      }
    }
    
    // Extract key insights from assistant messages (more selective)
    if (message.role === 'assistant' && message.content.length > 150) {
      // Look for specific business insights or data points
      const sentences = message.content.split(/[.!?]+/).filter(s => {
        const sentence = s.trim();
        return sentence.length > 30 && 
               (sentence.includes('%') || 
                sentence.includes('performance') || 
                sentence.includes('trend') ||
                sentence.includes('increase') ||
                sentence.includes('decrease') ||
                businessKeywords.some(keyword => sentence.toLowerCase().includes(keyword)));
      });
      keyInsights.push(...sentences.slice(0, 2)); // Take first 2 relevant insights
    }
  }

  // Determine if there's actually relevant history to reference
  const hasRelevantHistory = discussedTopics.length > 0 || keyInsights.length > 0;

  return {
    discussedTopics: discussedTopics.slice(-3), // Keep last 3 topics
    keyInsights: keyInsights.slice(-3), // Keep last 3 insights (reduced)
    currentModule,
    hasRelevantHistory
  };
}

/**
 * Creates a conversation summary for very long chats
 */
export function createConversationSummary(messages: ConversationMessage[]): string {
  if (messages.length <= 10) return '';

  const analysis = analyzeConversation(messages);
  
  // Only create summary if there's actually relevant business content
  if (!analysis.hasRelevantHistory) {
    return '';
  }
  
  let summary = "Previous conversation highlights:\n";
  
  if (analysis.discussedTopics.length > 0) {
    summary += `- Topics covered: ${analysis.discussedTopics.join(', ')}\n`;
  }
  
  if (analysis.keyInsights.length > 0) {
    summary += `- Key points shared: ${analysis.keyInsights.slice(0, 2).join('; ')}\n`;
  }
  
  return summary;
}

/**
 * Check if a specific topic has been discussed in the conversation
 */
export function hasTopicBeenDiscussed(messages: ConversationMessage[], topic: string): boolean {
  const recentMessages = messages.slice(-8); // Check last 8 messages
  const topicLower = topic.toLowerCase();
  
  return recentMessages.some(message => 
    message.content.toLowerCase().includes(topicLower) ||
    message.module?.toLowerCase().includes(topicLower)
  );
}

/**
 * Find previous response about a specific topic
 */
export function findPreviousResponse(messages: ConversationMessage[], topic: string): string | null {
  const recentMessages = messages.slice(-8).reverse(); // Check recent messages, newest first
  const topicLower = topic.toLowerCase();
  
  for (const message of recentMessages) {
    if (message.role === 'assistant' && 
        message.content.toLowerCase().includes(topicLower) &&
        message.content.length > 50) {
      return message.content;
    }
  }
  
  return null;
}
