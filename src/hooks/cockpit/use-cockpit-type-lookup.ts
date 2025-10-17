
import { SupabaseClient } from '@supabase/supabase-js';
import { CockpitType } from '@/types/cockpit';
import type { Database } from '@/integrations/supabase/types';

export const useCockpitTypeLookup = () => {
  const findCockpitType = async (
    cockpitIdOrName: string,
    client: SupabaseClient<Database>
  ): Promise<CockpitType | null> => {
    console.log('Looking up cockpit type:', cockpitIdOrName);
    
    if (!cockpitIdOrName) {
      console.error('Cockpit identifier is required');
      return null;
    }
    
    try {
      // Check if it's a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cockpitIdOrName);
      
      let query = client
        .from('cockpit_types')
        .select('*')
        .eq('is_active', true);
      
      let data, error;
      
      if (isUUID) {
        query = query.eq('id', cockpitIdOrName);
        const result = await query.maybeSingle();
        data = result.data;
        error = result.error;
      } else {
        // Try exact name match first
        query = query.ilike('name', cockpitIdOrName);
        let result = await query.maybeSingle();
        data = result.data;
        error = result.error;
        
        // If not found and the identifier contains hyphens, try converting to underscores
        if (!data && !error && cockpitIdOrName.includes('-')) {
          const underscoreName = cockpitIdOrName.replace(/-/g, '_');
          console.log('Trying underscore version:', underscoreName);
          
          query = client
            .from('cockpit_types')
            .select('*')
            .eq('is_active', true)
            .ilike('name', underscoreName);
          
          result = await query.maybeSingle();
          data = result.data;
          error = result.error;
        }
        
        // If still not found, try route_path lookup as fallback
        if (!data && !error) {
          console.log('Trying route_path lookup for:', `/cockpit/${cockpitIdOrName}`);
          
          query = client
            .from('cockpit_types')
            .select('*')
            .eq('is_active', true)
            .eq('route_path', `/cockpit/${cockpitIdOrName}`);
          
          result = await query.maybeSingle();
          data = result.data;
          error = result.error;
        }
      }
      
      if (error) {
        console.error('Error looking up cockpit type:', error);
        return null;
      }
      
      if (!data) {
        console.warn(`Cockpit type '${cockpitIdOrName}' not found`);
        return null;
      }
      
      console.log('Found cockpit type:', data);
      return data as CockpitType;
    } catch (error) {
      console.error('Error in cockpit type lookup:', error);
      return null;
    }
  };

  return { findCockpitType };
};
