
// Re-export everything from the new modular structure
export { supabase } from '@/integrations/supabase/client';
export { getCurrentUser, getCurrentSession } from './supabase/client';
export { ensureUserProfile } from './supabase/profiles';
export { assignAdminRoleByEmail, isUserAdmin } from './supabase/auth';
export {
  type Role,
  getRoles,
  getUsersWithRoles,
  assignRoleToUser,
  removeRoleFromUser,
  createRole,
  updateRole,
  deleteRole
} from './supabase/roles';

// Keep type imports
import { Database } from '@/integrations/supabase/types';
import { Json } from '@/integrations/supabase/types';
