
import { ChatRequest, OpenAIOptions } from "./types.ts";
import { corsHeaders, createSupabaseClient, getOpenAIApiKey } from "./utils.ts";
import { fetchRelevantBusinessData } from "./businessData.ts";
import { generateConversationalPrompt } from "./conversationalPrompt.ts";
import { prepareConversationHistory, ConversationMessage } from "./conversationManager.ts";
import { createOpenAIConfig } from "./openaiConfig.ts";

// Rate limiting storage (in-memory for this example - in production use Redis)
const rateLimits = new Map<string, { count: number; resetTime: number }>();

export async function handleChatRequest(req: Request) {
  const startTime = Date.now();
  
  try {
    // Parse and validate request body with size limits
    const rawBody = await req.text();
    if (rawBody.length > 50000) { // 50KB limit
      throw new Error('Request body too large');
    }
    
    const body = JSON.parse(rawBody);
    const { prompt, userId, moduleContext, conversationHistory }: ChatRequest = body;
    
    // Input validation and sanitization
    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      throw new Error('Valid prompt is required');
    }
    
    if (prompt.length > 5000) { // 5KB prompt limit
      throw new Error('Prompt too long');
    }
    
    // Sanitize prompt to prevent injection attacks
    const sanitizedPrompt = prompt.replace(/[<>]/g, '').trim();
    
    // Rate limiting by IP or user ID
    const clientId = userId || req.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const maxRequests = 10; // Max 10 requests per minute
    
    const rateLimit = rateLimits.get(clientId);
    if (rateLimit) {
      if (now < rateLimit.resetTime) {
        if (rateLimit.count >= maxRequests) {
          return new Response(
            JSON.stringify({ 
              error: 'Rate limit exceeded. Please wait before making another request.',
              retryAfter: Math.ceil((rateLimit.resetTime - now) / 1000)
            }),
            { 
              status: 429,
              headers: { 
                'Content-Type': 'application/json',
                'Retry-After': Math.ceil((rateLimit.resetTime - now) / 1000).toString(),
                ...corsHeaders
              }
            }
          );
        }
        rateLimit.count++;
      } else {
        // Reset window
        rateLimit.count = 1;
        rateLimit.resetTime = now + windowMs;
      }
    } else {
      rateLimits.set(clientId, { count: 1, resetTime: now + windowMs });
    }
    
    // Log security event for monitoring
    console.log(`Chat request from ${clientId}, prompt length: ${sanitizedPrompt.length}, module: ${moduleContext || 'none'}`);
    
    if (!sanitizedPrompt) {
      throw new Error('Valid prompt is required after sanitization');
    }

    // Initialize Supabase client
    const supabase = createSupabaseClient();
    const openaiApiKey = await getOpenAIApiKey();
    
    if (!openaiApiKey) {
      console.error('OpenAI API key is missing');
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          content: 'Sorry, the AI assistant is not properly configured. Please contact the administrator.' 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    // Log conversation context
    console.log(`Processing query with conversation history: ${conversationHistory?.length || 0} messages`);
    console.log(`Detected module context: ${moduleContext || 'none'}`);
    
    // Fetch relevant business data with priority on the mentioned module
    console.log(`Fetching business data...`);
    const dataFetchStart = Date.now();
    const appData = await fetchRelevantBusinessData(supabase, userId, moduleContext);
    console.log(`Business data fetched in ${Date.now() - dataFetchStart}ms`);
    
    // Prepare conversation history for OpenAI
    const conversationMessages: ConversationMessage[] = (conversationHistory || []).map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      module: msg.module
    }));
    
    // Create a conversational system prompt with full conversation awareness and enhanced intelligence
    const conversationalPrompt = generateConversationalPrompt(appData, sanitizedPrompt, conversationMessages, supabase);
    
    // Prepare the conversation history for OpenAI
    const historyForOpenAI = prepareConversationHistory(conversationMessages, 8);
    
    // Configure the conversation with history - use sanitized prompt
    const options: OpenAIOptions = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: conversationalPrompt
        },
        ...historyForOpenAI,
        {
          role: "user",
          content: sanitizedPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    };

    console.log(`Sending request to OpenAI with ${historyForOpenAI.length} conversation messages...`);
    
    // Set up an abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.error('OpenAI request timed out after 30 seconds');
    }, 30000);
    
    const openAiStart = Date.now();
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify(options),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      console.log(`OpenAI response received in ${Date.now() - openAiStart}ms with status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      console.log(`Received conversational response from OpenAI: ${aiResponse.substring(0, 50)}...`);
      console.log(`Total request time: ${Date.now() - startTime}ms`);

      return new Response(
        JSON.stringify({ 
          content: aiResponse,
          model: data.model,
          usage: data.usage,
          responseTime: Date.now() - startTime
        }),
        { 
          headers: { 
            "Content-Type": "application/json",
            ...corsHeaders
          } 
        }
      );
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Error in Myles chatbot function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        content: `I'm sorry, I encountered an error while processing your request. ${errorMessage.includes('timed out') ? 'The request took too long to process. Please try a simpler question.' : 'Please try again or contact support if the problem persists.'}`,
        error: errorMessage,
        responseTime: Date.now() - startTime
      }),
      { 
        headers: { 
          "Content-Type": "application/json",
          ...corsHeaders
        } 
      }
    );
  }
}
