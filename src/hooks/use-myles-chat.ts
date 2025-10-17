
import { useState, useEffect, useCallback } from 'react';
import { mylesService, ConversationMessage } from '@/services/mylesService';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  module?: string;
  responseTime?: number;
};

export const useMylesChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseStartTime, setResponseStartTime] = useState<number | null>(null);
  const { user } = useAuth();
  
  // Load saved conversation from localStorage on initial render only for authenticated users
  useEffect(() => {
    if (user?.id) {
      const savedMessages = localStorage.getItem(`myles_chat_${user.id}`);
      if (savedMessages) {
        try {
          const parsedMessages = JSON.parse(savedMessages);
          // Convert string timestamps back to Date objects
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } catch (error) {
          console.error('Error parsing saved messages:', error);
        }
      }
    }
  }, [user?.id]);
  
  // Save conversation to localStorage whenever it changes for authenticated users
  useEffect(() => {
    if (user?.id && messages.length > 0) {
      localStorage.setItem(`myles_chat_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user?.id]);

  // Effect to show a toast for very long response times
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (isLoading && responseStartTime) {
      // If response takes more than 10 seconds, show a toast
      timeoutId = setTimeout(() => {
        toast.info("Myles is working on a detailed response. This might take a moment.");
      }, 10000);
    }
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoading, responseStartTime]);

  // Helper function to convert messages to conversation history format
  const prepareConversationHistory = useCallback((messages: Message[]): ConversationMessage[] => {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: msg.timestamp.toISOString(),
      module: msg.module
    }));
  }, []);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setResponseStartTime(Date.now());

    try {
      console.log('Sending message to Myles with conversation history:', content.substring(0, 50) + '...');
      
      // Prepare conversation history (exclude the current message)
      const conversationHistory = prepareConversationHistory(messages);
      
      // Updated module keywords to remove projects since that cockpit was deleted
      const moduleKeywords = {
        warehouse: ['warehouse', 'inventory', 'stock', 'storage', 'picking'],
        credit: ['credit control', 'accounts receivable', 'collection', 'ageing', 'receivables'],
        supply_chain: ['supply chain', 'supplier', 'distribution', 'logistics flow'],
        sales: ['sales', 'revenue', 'customer', 'pipeline', 'deal', 'opportunity', 'market'],
        manufacturing: ['manufacturing', 'production', 'assembly', 'quality', 'yield', 'equipment'],
        logistics: ['logistics', 'shipping', 'transportation', 'delivery', 'freight', 'warehouse'],
        cash_bank: ['cash', 'bank', 'liquidity', 'working capital', 'treasury'],
        finance: ['finance', 'financial', 'profit', 'margin', 'budget', 'forecast', 'accounting'],
        procurement: ['procurement', 'purchasing', 'vendor', 'supplier', 'sourcing', 'spend'],
        field_service: ['field service', 'maintenance', 'repair', 'technician', 'service call']
      };
      
      const lowerContent = content.toLowerCase();
      
      // Try to detect which module(s) the query is about
      let detectedModule = null;
      
      for (const [module, keywords] of Object.entries(moduleKeywords)) {
        for (const keyword of keywords) {
          if (lowerContent.includes(keyword.toLowerCase())) {
            detectedModule = module;
            break;
          }
        }
        if (detectedModule) break;
      }
      
      // If analytics, insights, or process intelligence are mentioned, add that context
      if (!detectedModule) {
        if (lowerContent.includes('analytic') || 
            lowerContent.includes('analysis') ||
            lowerContent.includes('insight') ||
            lowerContent.includes('report') ||
            lowerContent.includes('trend') ||
            lowerContent.includes('dashboard') ||
            lowerContent.includes('kpi') ||
            lowerContent.includes('metric')) {
          detectedModule = 'insights';
        } else if (lowerContent.includes('process') || 
                   lowerContent.includes('intelligence') ||
                   lowerContent.includes('bottleneck') ||
                   lowerContent.includes('efficiency')) {
          detectedModule = 'process';
        }
      }
      
      // Debug the detected module 
      console.log('Detected module for Myles context:', detectedModule);
      console.log('Sending conversation history with', conversationHistory.length, 'messages');
      
      // Send the message along with full conversation history
      const responseData = await mylesService.sendMessage(
        content, 
        user?.id, 
        detectedModule, 
        conversationHistory
      );
      const responseTime = responseStartTime ? Date.now() - responseStartTime : undefined;
      console.log(`Received conversational response from Myles in ${responseTime}ms:`, responseData.substring(0, 50) + '...');
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseData,
        role: 'assistant',
        timestamp: new Date(),
        module: detectedModule,
        responseTime: responseTime
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message to chat instead of just showing toast
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Failed to get a response'}. Please try again later.`,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, errorMessage]);
      
      toast.error('Failed to get response from Myles');
    } finally {
      setIsLoading(false);
      setResponseStartTime(null);
    }
  };

  const clearMessages = useCallback(() => {
    setMessages([]);
    if (user?.id) {
      localStorage.removeItem(`myles_chat_${user.id}`);
    }
  }, [user?.id]);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
};
