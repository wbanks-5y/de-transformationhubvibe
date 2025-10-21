import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Cache for organization-specific Supabase clients
const clientCache = new Map<string, SupabaseClient<Database>>();

/**
 * Creates or retrieves a cached Supabase client for a specific organization's database
 */
export const getOrganizationClient = (
  supabaseUrl: string,
  supabaseAnonKey: string,
  organizationSlug: string,
  accessToken?: string
): SupabaseClient<Database> => {
  // Create unique cache key combining org slug, URL, and token presence
  const hasToken = !!accessToken;
  const cacheKey = `${organizationSlug}-${supabaseUrl}-${hasToken}`;
  
  // Clear old cache entries without token if we now have a token (or vice versa)
  for (const key of clientCache.keys()) {
    if (key.startsWith(`${organizationSlug}-${supabaseUrl}-`) && key !== cacheKey) {
      clientCache.delete(key);
    }
  }
  
  // Check if we already have a client for this organization with current auth state
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }

  // Ensure URL has https:// protocol
  const fullUrl = supabaseUrl.startsWith('http') 
    ? supabaseUrl 
    : `https://${supabaseUrl}`;

  // Create new client for this organization's database with auth token
  const client = createClient<Database>(fullUrl, supabaseAnonKey, {
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : undefined
    }
  });
  
  // Cache it for future use
  clientCache.set(cacheKey, client);
  
  return client;
};

/**
 * Clears a specific organization's client from cache
 */
export const clearOrganizationClient = (organizationSlug: string) => {
  // Clear all entries that start with this organization slug
  for (const key of clientCache.keys()) {
    if (key.startsWith(`${organizationSlug}-`)) {
      clientCache.delete(key);
    }
  }
};

/**
 * Clears all cached organization clients
 */
export const clearAllOrganizationClients = () => {
  clientCache.clear();
};
