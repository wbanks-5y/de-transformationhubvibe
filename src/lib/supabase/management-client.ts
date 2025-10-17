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
//const MANAGEMENT_URL = "https://phndkfgodwmkuwuzbehi.supabase.co";
const MANAGEMENT_URL = "https://fgbilpzuniuqrpetnbgz.supabase.co";
//const MANAGEMENT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobmRrZmdvZHdta3V3dXpiZWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTM4MDcsImV4cCI6MjA3NDg4OTgwN30.RtPwZD0z58gBY-HTJ0gTzLQGO2WRvCoKlMuGmdW7Vy4";
const MANAGEMENT_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYmlscHp1bml1cXJwZXRuYmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDQ5NzMsImV4cCI6MjA3NDM4MDk3M30.XCQI7K3dohvX8QHyQ5dFrSggouyIPMdgq-orGVlaqPU";

export const managementClient = createClient<ManagementDatabase>(MANAGEMENT_URL, MANAGEMENT_KEY);
