import React, { createContext, useContext, useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { Organization } from '@/types/management';
import { getOrganizationClient, clearOrganizationClient } from '@/lib/supabase/organization-client';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizationClient: SupabaseClient<Database> | null;
  setOrganization: (org: Organization) => void;
  clearOrganization: () => void;
  updateOrganizationAuth: (accessToken?: string | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizationClient, setOrganizationClient] = useState<SupabaseClient<Database> | null>(null);

  const setOrganization = useCallback((org: Organization) => {
    setCurrentOrganization(org);
    
    // Don't create client here - wait for updateOrganizationAuth to be called with token
    // This prevents caching an unauthenticated client
    
    // Store organization info in localStorage for persistence
    localStorage.setItem('current_organization', JSON.stringify(org));
  }, []);

  const updateOrganizationAuth = useCallback((accessToken?: string | null) => {
    if (!currentOrganization) return;
    
    console.log('[OrganizationContext] Creating client with auth token:', {
      hasToken: !!accessToken,
      orgSlug: currentOrganization.slug
    });
    
    const client = getOrganizationClient(
      currentOrganization.supabase_url,
      currentOrganization.supabase_anon_key,
      currentOrganization.slug,
      accessToken || undefined
    );
    setOrganizationClient(client);
  }, [currentOrganization]);

  const clearOrganization = useCallback(() => {
    if (currentOrganization) {
      clearOrganizationClient(currentOrganization.slug);
    }
    setCurrentOrganization(null);
    setOrganizationClient(null);
    localStorage.removeItem('current_organization');
  }, [currentOrganization]);

  // On mount, try to restore organization from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem('current_organization');
    if (stored) {
      try {
        const org = JSON.parse(stored) as Organization;
        console.log('[OrganizationContext] Restoring organization from storage (no client yet):', org.slug);
        setOrganization(org);
        // Note: Client will be created when AuthContext calls updateOrganizationAuth with token
      } catch (error) {
        console.error('Failed to restore organization from storage:', error);
        localStorage.removeItem('current_organization');
      }
    }
  }, [setOrganization]);

  const value = {
    currentOrganization,
    organizationClient,
    setOrganization,
    clearOrganization,
    updateOrganizationAuth,
  };

  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
};

export const useOrganization = () => {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
};
