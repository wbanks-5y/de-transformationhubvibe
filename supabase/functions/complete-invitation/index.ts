import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};
serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const { email, password, organizationSlug, invitationToken } = await req.json();
    // Normalize email to lowercase
    const safeEmail = email?.toLowerCase?.() || "";
    console.log("[complete-invitation] Starting invitation completion", {
      email: safeEmail ? `${safeEmail.substring(0, 3)}***@${safeEmail.split("@")[1]}` : "missing",
      orgSlug: organizationSlug,
      hasToken: !!invitationToken
    });
    // Validate input
    if (!safeEmail || !password || !organizationSlug || !invitationToken) {
      return new Response(JSON.stringify({
        success: false,
        error: "Missing required fields"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // Step 1: Connect to Management Database (hardcoded like invite-user)
    const MANAGEMENT_URL = "https://fgbilpzuniuqrpetnbgz.supabase.co";
    const MANAGEMENT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYmlscHp1bml1cXJwZXRuYmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDQ5NzMsImV4cCI6MjA3NDM4MDk3M30.XCQI7K3dohvX8QHyQ5dFrSggouyIPMdgq-orGVlaqPU";
    const managementClient = createClient(MANAGEMENT_URL, MANAGEMENT_KEY);
    console.log("[complete-invitation] Connected to Management DB");
    // Step 2: Validate invitation token (WITHOUT FK join to avoid errors)
    const { data: tokenRow, error: tokenErr } = await managementClient.from("invitation_tokens").select("id, token, email, organization_id, organization_slug, " + "organization_supabase_url, organization_supabase_anon_key, expires_at, used_at").eq("token", invitationToken).eq("email", safeEmail).is("used_at", null).maybeSingle() as { 
      data: {
        id: string;
        token: string;
        email: string;
        organization_id: string;
        organization_slug: string;
        organization_supabase_url: string;
        organization_supabase_anon_key: string;
        expires_at: string;
        used_at: string | null;
      } | null;
      error: any;
    };
    if (tokenErr || !tokenRow) {
      console.error("[complete-invitation] Token lookup failed or not found", tokenErr);
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid or expired invitation"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    console.log("[complete-invitation] Token validated successfully");
    // Validate org slug matches
    if (tokenRow.organization_slug && tokenRow.organization_slug !== organizationSlug) {
      console.error("[complete-invitation] Org slug mismatch", {
        fromLink: organizationSlug,
        fromToken: tokenRow.organization_slug
      });
      return new Response(JSON.stringify({
        success: false,
        error: "Invalid or expired invitation"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // Check token expiration
    if (new Date(tokenRow.expires_at) < new Date()) {
      console.error("[complete-invitation] Token expired");
      return new Response(JSON.stringify({
        success: false,
        error: "Invitation has expired"
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // Step 3: Fetch organization for service role key (separate query, no FK)
    const { data: orgRow, error: orgErr } = await managementClient.from("organizations").select("id, slug, supabase_service_role_key").eq("id", tokenRow.organization_id).maybeSingle();
    if (orgErr || !orgRow || !orgRow.supabase_service_role_key) {
      console.error("[complete-invitation] Org lookup failed or missing service role key", orgErr);
      return new Response(JSON.stringify({
        success: false,
        error: "Organization configuration error"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    console.log("[complete-invitation] Organization fetched from Management DB", {
      orgId: orgRow.id,
      orgSlug: orgRow.slug
    });
    // Step 4: Normalize organization URL (database stores URLs without protocol)
    const orgUrl = tokenRow.organization_supabase_url?.startsWith("http") ? tokenRow.organization_supabase_url : `https://${tokenRow.organization_supabase_url}`;
    console.log("[complete-invitation] Using normalized org URL:", orgUrl);
    // Step 5: Create admin client for target organization
    const orgAdminClient = createClient(orgUrl, orgRow.supabase_service_role_key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    console.log("[complete-invitation] Created admin client for organization");
    // Step 6: Check if user exists in target organization
    const { data: existingUsers } = await orgAdminClient.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u)=>(u.email || "").toLowerCase() === safeEmail);
    let userId;
    if (existingUser) {
      // Update existing user's password
      console.log("[complete-invitation] Updating existing user password");
      const { error: updateError } = await orgAdminClient.auth.admin.updateUserById(existingUser.id, {
        password: password,
        email_confirm: true
      });
      if (updateError) {
        console.error("[complete-invitation] Failed to update user", updateError);
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to set password"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      userId = existingUser.id;
      console.log("[complete-invitation] User password updated successfully");
    } else {
      // Create new user
      console.log("[complete-invitation] Creating new user");
      const { data: createData, error: createError } = await orgAdminClient.auth.admin.createUser({
        email: safeEmail,
        password: password,
        email_confirm: true,
        user_metadata: {
          invited_at: new Date().toISOString(),
          organization_slug: organizationSlug
        }
      });
      if (createError || !createData?.user?.id) {
        console.error("[complete-invitation] Failed to create user", createError);
        return new Response(JSON.stringify({
          success: false,
          error: "Failed to create user account"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      userId = createData.user.id;
      console.log("[complete-invitation] User created successfully with ID:", userId);
    }
    // Step 7: Upsert profile with correct schema fields
    console.log("[complete-invitation] Creating/updating profile");
    // Extract user's name from email for better UX
    const fullName = safeEmail.split("@")[0].replace(/[._-]/g, " ").split(" ").map((word: string)=>word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    const { error: profileError } = await orgAdminClient.from("profiles").upsert({
      id: userId,
      email: safeEmail,
      full_name: fullName,
      status: "approved",
      tier: "essential",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, {
      onConflict: "id"
    });
    if (profileError) {
      console.error("[complete-invitation] CRITICAL: Failed to create profile", profileError);
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to create user profile",
        details: profileError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    console.log("[complete-invitation] Profile created successfully");
    // Step 8: Add user to user_organizations table in Management DB
    console.log("[complete-invitation] Adding user to user_organizations", {
      email: `${safeEmail.substring(0, 3)}***`,
      orgId: tokenRow.organization_id
    });
    const { data: insertData, error: userOrgError } = await managementClient.from("user_organizations").insert({
      email: safeEmail,
      organization_id: tokenRow.organization_id
    }).select();
    if (userOrgError) {
      // This is CRITICAL - without this, the home page lookup will fail
      console.error("[complete-invitation] CRITICAL: Failed to add to user_organizations", {
        error: userOrgError,
        code: userOrgError.code,
        message: userOrgError.message,
        details: userOrgError.details,
        hint: userOrgError.hint
      });
      // Return error since this breaks the home page flow
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to register user organization",
        details: userOrgError.message
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    } else {
      console.log("[complete-invitation] User successfully added to user_organizations", {
        insertedData: insertData
      });
    }
    // Step 9: Create a real session by signing in with the new password
    console.log("[complete-invitation] Creating user session");
    const orgPublicClient = createClient(orgUrl, tokenRow.organization_supabase_anon_key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    const { data: signInData, error: signInErr } = await orgPublicClient.auth.signInWithPassword({
      email: safeEmail,
      password: password
    });
    if (signInErr || !signInData?.session) {
      console.error("[complete-invitation] Sign-in failed after setting password", signInErr);
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to create session"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    console.log("[complete-invitation] Session created successfully");
    // Step 10: Mark invitation token as used
    await managementClient.from("invitation_tokens").update({
      used_at: new Date().toISOString()
    }).eq("token", invitationToken);
    console.log("[complete-invitation] Invitation token marked as used");
    console.log("[complete-invitation] Invitation completed successfully");
    // Step 11: Return session information
    return new Response(JSON.stringify({
      success: true,
      accessToken: signInData.session.access_token,
      refreshToken: signInData.session.refresh_token,
      orgUrl: orgUrl,
      orgAnonKey: tokenRow.organization_supabase_anon_key,
      userId: userId
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error("[complete-invitation] Unexpected error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: "An unexpected error occurred"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
});
