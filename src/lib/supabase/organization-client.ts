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
  organizationSlug: string
): SupabaseClient<Database> => {
  // Create unique cache key combining org slug and URL to avoid client reuse across different databases
  const cacheKey = `${organizationSlug}-${supabaseUrl}`;
  
  // Check if we already have a client for this organization
  if (clientCache.has(cacheKey)) {
    return clientCache.get(cacheKey)!;
  }

  // Ensure URL has https:// protocol
  const fullUrl = supabaseUrl.startsWith('http') 
    ? supabaseUrl 
    : `https://${supabaseUrl}`;

  // Create new client for this organization's database
  const client = createClient<Database>(fullUrl, supabaseAnonKey);
  
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
