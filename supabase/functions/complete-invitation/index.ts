import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CompleteInvitationRequest {
  email: string;
  password: string;
  organizationSlug: string;
  invitationToken: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, organizationSlug, invitationToken }: CompleteInvitationRequest = await req.json();

    console.log("[complete-invitation] Starting invitation completion", {
      email: email.substring(0, 3) + "***@" + email.split("@")[1],
      orgSlug: organizationSlug,
    });

    // Validate input
    if (!email || !password || !organizationSlug || !invitationToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Step 1: Connect to Management Database to validate token
    const managementUrl = Deno.env.get("MANAGEMENT_SUPABASE_URL");
    const managementKey = Deno.env.get("MANAGEMENT_SUPABASE_ANON_KEY");

    if (!managementUrl || !managementKey) {
      console.error("[complete-invitation] Missing management DB credentials");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const managementClient = createClient(managementUrl, managementKey);

    // Step 2: Validate invitation token
    const { data: tokenData, error: tokenError } = await managementClient
      .from("invitation_tokens")
      .select("*, organizations!inner(supabase_service_role_key)")
      .eq("token", invitationToken)
      .eq("email", email.toLowerCase())
      .is("used_at", null)
      .single();

    if (tokenError || !tokenData) {
      console.error("[complete-invitation] Invalid or expired token", tokenError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invalid or expired invitation",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Check token expiration
    if (new Date(tokenData.expires_at) < new Date()) {
      console.error("[complete-invitation] Token expired");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Invitation has expired",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Step 3: Get organization's service role key
    const serviceRoleKey = tokenData.organizations?.supabase_service_role_key;

    if (!serviceRoleKey) {
      console.error("[complete-invitation] Missing service role key for organization");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Organization configuration error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Step 4: Create admin client for target organization
    const orgAdminClient = createClient(
      tokenData.organization_supabase_url,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    console.log("[complete-invitation] Created admin client for organization");

    // Step 5: Check if user exists in target organization
    const { data: existingUsers } = await orgAdminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
    );

    let userId: string;

    if (existingUser) {
      // Update existing user's password
      console.log("[complete-invitation] Updating existing user password");
      
      const { data: updateData, error: updateError } = await orgAdminClient.auth.admin.updateUserById(
        existingUser.id,
        {
          password: password,
          email_confirm: true,
        }
      );

      if (updateError) {
        console.error("[complete-invitation] Failed to update user", updateError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to set password",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      userId = existingUser.id;
    } else {
      // Create new user
      console.log("[complete-invitation] Creating new user");
      
      const { data: createData, error: createError } = await orgAdminClient.auth.admin.createUser({
        email: email.toLowerCase(),
        password: password,
        email_confirm: true,
        user_metadata: {
          invited_at: new Date().toISOString(),
          organization_slug: organizationSlug,
        },
      });

      if (createError) {
        console.error("[complete-invitation] Failed to create user", createError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Failed to create user account",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      userId = createData.user.id;
    }

    // Step 6: Create profile if it doesn't exist and set status to approved
    const { error: profileError } = await orgAdminClient
      .from("profiles")
      .upsert({
        id: userId,
        email: email.toLowerCase(),
        status: "approved",
        updated_at: new Date().toISOString(),
      });

    if (profileError) {
      console.error("[complete-invitation] Failed to update profile", profileError);
      // Continue anyway - profile might be created by trigger
    }

    // Step 7: Sign in the user to get session tokens
    console.log("[complete-invitation] Signing in user");
    
    const { data: signInData, error: signInError } = await orgAdminClient.auth.signInWithPassword({
      email: email.toLowerCase(),
      password: password,
    });

    if (signInError || !signInData.session) {
      console.error("[complete-invitation] Failed to sign in", signInError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create session",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Step 8: Mark invitation token as used
    await managementClient
      .from("invitation_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token", invitationToken);

    console.log("[complete-invitation] Invitation completed successfully");

    // Step 9: Return session information
    return new Response(
      JSON.stringify({
        success: true,
        accessToken: signInData.session.access_token,
        refreshToken: signInData.session.refresh_token,
        orgUrl: tokenData.organization_supabase_url,
        orgAnonKey: tokenData.organization_supabase_anon_key,
        userId: userId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    console.error("[complete-invitation] Unexpected error:", error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({
        success: false,
        error: "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
