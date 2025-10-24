import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Helper to call Supabase Edge Functions with proper HTTP method support.
 * 
 * The Supabase JS client's invoke() method only supports POST requests.
 * For GET and DELETE, we need to use fetch directly with proper authentication.
 */
export const callEdgeFunction = async (
  organizationClient: SupabaseClient,
  functionName: string,
  options: {
    method?: 'GET' | 'POST' | 'DELETE';
    body?: any;
  } = {}
) => {
  const { method = 'POST', body } = options;
  
  // For POST, use native invoke (works correctly)
  if (method === 'POST') {
    return await organizationClient.functions.invoke(functionName, { body });
  }
  
  // For GET and DELETE, use fetch directly
  const { data: { session } } = await organizationClient.auth.getSession();
  const token = session?.access_token;
  
  // Extract base URL and anon key from the client
  const supabaseUrl = (organizationClient as any).supabaseUrl;
  const supabaseKey = (organizationClient as any).supabaseKey;
  
  const url = `${supabaseUrl}/functions/v1/${functionName}`;
  
  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Bearer ${token || supabaseKey}`,
      'apikey': supabaseKey,
      'Content-Type': 'application/json',
    },
    body: method === 'DELETE' ? JSON.stringify(body) : undefined,
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Edge function ${functionName} failed: ${response.status} ${errorText}`);
  }
  
  const data = await response.json();
  return { data, error: null };
};
