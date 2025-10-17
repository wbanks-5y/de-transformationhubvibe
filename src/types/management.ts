// Management Database Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  supabase_url: string;
  supabase_anon_key: string;
  created_at: string;
  updated_at: string;
}

export interface UserOrganization {
  id: string;
  email: string;
  organization_id: string;
  created_at: string;
}

export interface OrganizationWithMapping extends Organization {
  user_email?: string;
}

export interface InvitationToken {
  id: string;
  token: string;
  email: string;
  organization_id: string;
  organization_slug: string;
  organization_supabase_url: string;
  organization_supabase_anon_key: string;
  expires_at: string;
  used_at: string | null;
  created_at: string;
  updated_at: string;
}
