import React, { createContext, useContext, useState, useCallback } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import type { Organization } from '@/types/management';
import { getOrganizationClient, clearOrganizationClient } from '@/lib/supabase/organization-client';
import { useAuth } from '@/context/AuthContext';

interface OrganizationContextType {
  currentOrganization: Organization | null;
  organizationClient: SupabaseClient<Database> | null;
  setOrganization: (org: Organization) => void;
  clearOrganization: () => void;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export const OrganizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session } = useAuth();
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null);
  const [organizationClient, setOrganizationClient] = useState<SupabaseClient<Database> | null>(null);

  const setOrganization = useCallback((org: Organization, accessToken?: string) => {
    setCurrentOrganization(org);
    
    // Create/retrieve client for this organization's database with auth token
    const client = getOrganizationClient(
      org.supabase_url,
      org.supabase_anon_key,
      org.slug,
      accessToken
    );
    
    setOrganizationClient(client);
    
    // Store organization info in localStorage for persistence
    localStorage.setItem('current_organization', JSON.stringify(org));
  }, []);

  const clearOrganization = useCallback(() => {
    if (currentOrganization) {
      clearOrganizationClient(currentOrganization.slug);
    }
    setCurrentOrganization(null);
    setOrganizationClient(null);
    localStorage.removeItem('current_organization');
  }, [currentOrganization]);

  // On mount or session change, restore organization from localStorage with current auth token
  React.useEffect(() => {
    const stored = localStorage.getItem('current_organization');
    if (stored) {
      try {
        const org = JSON.parse(stored) as Organization;
        // Pass the current session's access token when restoring
        setOrganization(org, session?.access_token);
      } catch (error) {
        console.error('Failed to restore organization from storage:', error);
        localStorage.removeItem('current_organization');
      }
    }
  }, [setOrganization, session]);

  const value = {
    currentOrganization,
    organizationClient,
    setOrganization,
    clearOrganization,
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
