
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export function createSupabaseClient() {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }
  
  return createClient(supabaseUrl, supabaseKey);
}

export async function getOpenAIApiKey() {
  // First try to get from secure database storage
  try {
    const supabase = createSupabaseClient();
    const { data: apiKeyData, error } = await supabase
      .from('encrypted_api_keys')
      .select('encrypted_value')
      .eq('key_name', 'openai_api_key')
      .single();
    
    if (!error && apiKeyData) {
      return apiKeyData.encrypted_value;
    }
  } catch (error) {
    console.log('No API key found in database, using environment variable');
  }

  // Fallback to environment variable
  const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  return openaiApiKey;
}
