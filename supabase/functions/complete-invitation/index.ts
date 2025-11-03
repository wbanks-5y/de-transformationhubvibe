import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Organization database configuration
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const { email, password, invitationToken } = await req.json();
    console.log("[COMPLETE-INVITATION] Starting invitation completion for:", { email });

    // Validate required fields
    if (!email || !password || !invitationToken) {
      console.error("[COMPLETE-INVITATION] Missing required fields:", { email: !!email, password: !!password, token: !!invitationToken });
      return new Response(
        JSON.stringify({ error: "Email, password, and invitation token are required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log("[COMPLETE-INVITATION] Normalized email:", normalizedEmail);

    // Initialize organization's Supabase clients
    console.log("[COMPLETE-INVITATION] Connecting to organization database...");
    const orgAdminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Validate invitation token from organization database
    console.log("[COMPLETE-INVITATION] Validating invitation token...");
    const { data: tokenData, error: tokenError } = await orgAdminClient
      .from("invitation_tokens")
      .select("*")
      .eq("token", invitationToken)
      .eq("email", normalizedEmail)
      .is("used_at", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      console.error("[COMPLETE-INVITATION] Invalid or expired token:", tokenError);
      return new Response(
        JSON.stringify({ error: "Invalid or expired invitation token" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("[COMPLETE-INVITATION] Token validated for user:", tokenData.user_id);

    // Update user's password and confirm email
    console.log("[COMPLETE-INVITATION] Updating user password and confirming email...");
    const userId = tokenData.user_id;
    
    const { data: updatedUser, error: updateError } = await orgAdminClient.auth.admin.updateUserById(
      userId,
      {
        password,
        email_confirm: true,
      }
    );

    if (updateError) {
      console.error("[COMPLETE-INVITATION] Error updating user:", updateError);
      throw updateError;
    }

    console.log("[COMPLETE-INVITATION] User updated successfully:", updatedUser.user.id);

    // Ensure profile exists in organization database
    console.log("[COMPLETE-INVITATION] Ensuring profile exists in organization database...");
    const { error: profileError } = await orgAdminClient
      .from("profiles")
      .upsert(
        {
          id: userId,
          email: normalizedEmail,
          full_name: normalizedEmail.split("@")[0],
          status: "approved",
          tier: "essential",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (profileError) {
      console.error("[COMPLETE-INVITATION] Error creating/updating profile:", profileError);
      // Continue anyway - profile might have been created by trigger
    } else {
      console.log("[COMPLETE-INVITATION] Profile created/updated successfully");
    }

    // Sign in to create a session
    console.log("[COMPLETE-INVITATION] Creating session for user...");
    const orgPublicClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const { data: sessionData, error: signInError } = await orgPublicClient.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (signInError) {
      console.error("[COMPLETE-INVITATION] Error creating session:", signInError);
      throw signInError;
    }

    console.log("[COMPLETE-INVITATION] Session created successfully");

    // Mark token as used
    console.log("[COMPLETE-INVITATION] Marking token as used...");
    const { error: markUsedError } = await orgAdminClient
      .from("invitation_tokens")
      .update({ used_at: new Date().toISOString() })
      .eq("token", invitationToken);

    if (markUsedError) {
      console.error("[COMPLETE-INVITATION] Error marking token as used:", markUsedError);
      // Continue anyway
    }

    console.log("[COMPLETE-INVITATION] Invitation completed successfully");

    // Return session information
    return new Response(
      JSON.stringify({
        message: "Invitation completed successfully",
        accessToken: sessionData.session.access_token,
        refreshToken: sessionData.session.refresh_token,
        userId,
        orgUrl: SUPABASE_URL,
        orgAnonKey: SUPABASE_ANON_KEY,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[COMPLETE-INVITATION] Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "An unexpected error occurred",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);