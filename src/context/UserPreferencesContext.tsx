import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useOrganization } from './OrganizationContext';

type Theme = 'light' | 'dark' | 'system';

interface UserPreferences {
  theme: Theme;
  dashboardLayout: string;
  favoriteMetrics: string[];
  hiddenCategories: string[];
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  dashboardLayout: 'standard',
  favoriteMetrics: [],
  hiddenCategories: [],
};

interface UserPreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const { organizationClient } = useOrganization();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPreferences = async () => {
      if (!user || !organizationClient) {
        // If not logged in, load from localStorage
        const savedPrefs = localStorage.getItem('userPreferences');
        if (savedPrefs) {
          try {
            setPreferences(JSON.parse(savedPrefs));
          } catch (e) {
            console.error('Error parsing saved preferences:', e);
            setPreferences(defaultPreferences);
          }
        }
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Try to load from organization's Supabase
        const { data, error } = await organizationClient
          .from('user_preferences')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          // Table might not exist in this org's database - use defaults
          console.log('user_preferences table not available, using defaults');
          setPreferences(defaultPreferences);
        } else if (data) {
          // Parse the JSON preferences from Supabase
          const userPrefs = data.preferences as unknown;
          setPreferences((userPrefs as UserPreferences) || defaultPreferences);
        } else {
          // No preferences yet for this user
          setPreferences(defaultPreferences);
        }
      } catch (error) {
        console.log('Error loading preferences, using defaults:', error);
        // Fallback to defaults if there's an error
        setPreferences(defaultPreferences);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [user, organizationClient]);

  const updatePreference = async <K extends keyof UserPreferences>(
    key: K, 
    value: UserPreferences[K]
  ) => {
    // Update local state
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    // Save to localStorage as backup
    localStorage.setItem('userPreferences', JSON.stringify(newPreferences));

    // If logged in, save to database
    if (user && organizationClient) {
      try {
        const { error } = await organizationClient
          .from('user_preferences')
          .upsert({ 
            user_id: user.id, 
            preferences: newPreferences as Record<string, any>,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id' 
          });

        if (error) console.error('Error saving preferences to organization database:', error);
      } catch (error) {
        console.error('Error saving preferences:', error);
      }
    }
  };

  const resetPreferences = async () => {
    setPreferences(defaultPreferences);
    localStorage.setItem('userPreferences', JSON.stringify(defaultPreferences));

    if (user && organizationClient) {
      try {
        const { error } = await organizationClient
          .from('user_preferences')
          .upsert({ 
            user_id: user.id, 
            preferences: defaultPreferences as Record<string, any>,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'user_id' 
          });

        if (error) console.error('Error resetting preferences in organization database:', error);
      } catch (error) {
        console.error('Error resetting preferences:', error);
      }
    }
  };

  return (
    <UserPreferencesContext.Provider 
      value={{ preferences, isLoading, updatePreference, resetPreferences }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
