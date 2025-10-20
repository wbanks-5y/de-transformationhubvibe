import { createClient } from "@supabase/supabase-js";
import type { Organization, UserOrganization, InvitationToken } from "@/types/management";

// Management Database Schema
export interface ManagementDatabase {
  public: {
    Tables: {
      organizations: {
        Row: Organization & { supabase_service_role_key?: string };
        Insert: Omit<Organization, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Organization, "id" | "created_at" | "updated_at">>;
      };
      user_organizations: {
        Row: UserOrganization;
        Insert: Omit<UserOrganization, "id" | "created_at">;
        Update: Partial<Omit<UserOrganization, "id" | "created_at">>;
      };
      invitation_tokens: {
        Row: InvitationToken;
        Insert: Omit<InvitationToken, "id" | "token" | "created_at" | "updated_at">;
        Update: Partial<Omit<InvitationToken, "id" | "token">>;
      };
    };
    Views: {};
    Functions: {};
    Enums: {};
  };
}

// Management Database Connection
const MANAGEMENT_URL = (import.meta.env.VITE_MANAGEMENT_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL) as string;
const MANAGEMENT_KEY = (import.meta.env.VITE_MANAGEMENT_SUPABASE_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY) as string;

export const managementClient = createClient<ManagementDatabase>(MANAGEMENT_URL, MANAGEMENT_KEY);
