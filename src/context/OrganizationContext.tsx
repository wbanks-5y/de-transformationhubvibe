import React, { createContext, useContext, useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { Organization } from '@/types/management';
import { getOrganizationClient, clearOrganizationClient } from '@/lib/supabase/organization-client';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizationClient: SupabaseClient<Database> | null;
  setOrganizationBasic: (org: Partial<Organization>) => void;
  setOrganizationWithCredentials: (org: Organization, session: any) => void;
  clearOrganization: () => void;
  updateOrganizationAuth: (accessToken?: string | null) => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizationClient, setOrganizationClient] = useState<SupabaseClient<Database> | null>(null);

  // Set organization basic info (no credentials) - used during lookup phase
  const setOrganizationBasic = useCallback((org: Partial<Organization>) => {
    setCurrentOrganization(org as Organization);
    // No client created yet - credentials not available
    setOrganizationClient(null);
    
    // Store basic organization info in localStorage
    localStorage.setItem('current_organization_basic', JSON.stringify(org));
  }, []);

  // Set organization with full credentials after authentication
  const setOrganizationWithCredentials = useCallback((org: Organization, session: any) => {
    setCurrentOrganization(org);
    
    // Create client with authenticated session
    const client = getOrganizationClient(
      org.supabase_url,
      org.supabase_anon_key,
      org.slug,
      session.access_token
    );
    
    setOrganizationClient(client);
    
    // Store full organization info in localStorage for persistence
    localStorage.setItem('current_organization', JSON.stringify(org));
    localStorage.removeItem('current_organization_basic');
  }, []);

  const updateOrganizationAuth = useCallback((accessToken?: string | null) => {
    if (!currentOrganization) return;
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
        // Restore with credentials if available
        const client = getOrganizationClient(
          org.supabase_url,
          org.supabase_anon_key,
          org.slug
        );
        setCurrentOrganization(org);
        setOrganizationClient(client);
      } catch (error) {
        console.error('Failed to restore organization from storage:', error);
        localStorage.removeItem('current_organization');
      }
    }
  }, []);

  const value = {
    currentOrganization,
    organizationClient,
    setOrganizationBasic,
    setOrganizationWithCredentials,
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
