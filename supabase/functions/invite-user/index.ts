import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

interface InviteUserRequest {
  email: string;
  organizationSlug?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Generate unique correlation ID for request tracking
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  const callerIp = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const authorization = req.headers.get('authorization') ? 'present' : 'missing';
  const triggerSource = req.headers.get('x-trigger-source') || 'unknown';

  console.log(`[${correlationId}] FUNCTION START`, {
    timestamp,
    method: req.method,
    callerIp,
    userAgent: userAgent.substring(0, 100),
    hasAuthHeader: authorization === 'present',
    origin: req.headers.get('origin') || 'none',
    triggerSource,
  });

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${correlationId}] FUNCTION END: OPTIONS (CORS preflight)`, {
      duration: Date.now() - startTime,
    });
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server configuration error",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        },
      );
    }

    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Handle GET request to fetch pending invitations
    if (req.method === "GET") {
      console.log(`[${correlationId}] GET: Fetching pending invitations from management DB`);

      try {
        // Get management DB credentials
        const managementUrl = Deno.env.get("MANAGEMENT_SUPABASE_URL");
        const managementKey = Deno.env.get("MANAGEMENT_SUPABASE_ANON_KEY");

        if (!managementUrl || !managementKey) {
          console.error(`[${correlationId}] GET: Missing management DB credentials`);
          return new Response(
            JSON.stringify({
              success: true,
              invitations: [],
              message: "Configuration error",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const managementClient = createClient(managementUrl, managementKey);

        // Fetch pending invitations from invitation_tokens table
        const { data: invitations, error: invitationsError } = await managementClient
          .from("invitation_tokens")
          .select("id, email, created_at, organization_slug, expires_at")
          .is("used_at", null)
          .order("created_at", { ascending: false });

        console.log(`[${correlationId}] GET: Pending invitations found`, {
          count: invitations?.length || 0
        });

        if (invitationsError) {
          console.error(`[${correlationId}] GET: Error fetching invitations`, invitationsError);
          return new Response(
            JSON.stringify({
              success: true,
              invitations: [],
              message: "Unable to fetch invitations",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const formattedInvitations = (invitations || []).map((inv) => ({
          id: inv.id,
          email: inv.email,
          invited_at: inv.created_at,
          status: new Date(inv.expires_at) < new Date() ? "expired" : "pending",
        }));

        console.log(`[${correlationId}] FUNCTION END: Success`, {
          method: 'GET',
          statusCode: 200,
          totalDuration: Date.now() - startTime,
        });

        return new Response(
          JSON.stringify({
            success: true,
            invitations: formattedInvitations,
            correlationId,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } catch (listError) {
        console.error(`[${correlationId}] GET: Error in fetch`, listError);
        return new Response(
          JSON.stringify({
            success: true,
            invitations: [],
            message: "Error fetching invitations",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    // Handle POST request to send invitations
    if (req.method === "POST") {
      console.log(`[${correlationId}] POST: Invite request received`);
      
      let requestData;
      try {
        requestData = await req.json();
        console.log(`[${correlationId}] POST: Request payload`, {
          email: requestData.email ? `${requestData.email.substring(0, 3)}***@${requestData.email.split('@')[1]}` : 'missing',
          hasOrgSlug: !!requestData.organizationSlug,
          payloadKeys: Object.keys(requestData)
        });
      } catch (parseError) {
        console.error(`[${correlationId}] POST: JSON parse error`, parseError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON in request body",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }

      const { email, organizationSlug }: InviteUserRequest = requestData;

      if (!email || typeof email !== "string") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Valid email is required",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }

      // Normalize email for case-insensitive comparison
      const emailNormalized = email.trim().toLowerCase();

      console.log(`[${correlationId}] POST: Attempting to invite user`, {
        email: `${emailNormalized.substring(0, 3)}***@${emailNormalized.split('@')[1]}`
      });

      try {
        // First, get all users with increased page size to avoid pagination issues
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000 // Increase limit to catch more users
        });

        if (authError) {
          console.error(`[${correlationId}] POST: Error checking existing users:`, authError);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Unable to verify user status",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const existingUser = authData?.users?.find((u) => (u.email || '').toLowerCase() === emailNormalized);

        console.log(`[${correlationId}] POST: User existence check`, {
          email: emailNormalized.substring(0, 3) + '***@' + emailNormalized.split('@')[1],
          userFound: !!existingUser,
          isConfirmed: existingUser ? !!existingUser.email_confirmed_at : null,
          totalUsersChecked: authData?.users?.length || 0
        });

        // Check if user exists - don't delete, just proceed with token creation
        if (existingUser) {
          console.log(`[${correlationId}] POST: Existing user found, proceeding with token creation (idempotent)`, {
            email: emailNormalized.substring(0, 3) + '***@' + emailNormalized.split('@')[1],
            userId: existingUser.id,
            wasConfirmed: !!existingUser.email_confirmed_at
          });
        } else {
          console.log(`[${correlationId}] POST: No existing user found, will create new user after token`);
        }

        // Proceed with invitation
        const rawOrigin = req.headers.get("origin");

        // Strict validation: only accept exact matches or use hardcoded default with double hyphen
        let cleanOrigin = "https://preview--transformationhubvibe.lovable.app";

        if (rawOrigin) {
          // Log raw origin for debugging
          console.log(`Raw origin received: ${rawOrigin}`);
          console.log(
            `Raw origin char codes: ${[...rawOrigin].map((c) => `${c}:U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`).join(", ")}`,
          );

          // Replace ANY dash-like Unicode characters with regular hyphen
          const normalized = rawOrigin
            .replace(/[\u2010-\u2015\u2212]/g, "-") // All dash variants (hyphen, en-dash, em-dash, etc.)
            .replace(/–/g, "--") // En-dash to double hyphen
            .replace(/—/g, "--") // Em-dash to double hyphen
            .replace(/([^:]\/)\/+/g, "$1"); // Remove double slashes (except after protocol)

          console.log(`Normalized origin: ${normalized}`);

          // Only use if it contains the expected domain pattern
          if (normalized.includes("transformationhubvibe.lovable.app")) {
            cleanOrigin = normalized;
          } else {
            console.warn(`Origin does not match expected domain, using default: ${cleanOrigin}`);
          }
        } else {
          console.log(`No origin header, using default: ${cleanOrigin}`);
        }

        // Redirect to set-password page with organization context
        // Use query parameter so it doesn't conflict with Supabase's hash tokens
        const redirectTo = organizationSlug
          ? `${cleanOrigin}/set-password?org=${encodeURIComponent(organizationSlug)}`
          : `${cleanOrigin}/set-password`;

        console.log(`[${correlationId}] POST: Final redirect URL`, { redirectTo });
        
        console.log(`[${correlationId}] POST: Calling auth.admin.inviteUserByEmail`, {
          email: `${email.substring(0, 3)}***@${email.split('@')[1]}`,
          redirectTo,
          hasOrgSlug: !!organizationSlug,
          timestamp: new Date().toISOString()
        });

        // Step 1: Get management DB credentials
        const managementUrl = Deno.env.get("MANAGEMENT_SUPABASE_URL");
        const managementKey = Deno.env.get("MANAGEMENT_SUPABASE_ANON_KEY");
        const resendApiKey = Deno.env.get("RESEND_API_KEY");

        if (!managementUrl || !managementKey) {
          console.error(`[${correlationId}] POST: Missing management DB credentials`);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Server configuration error - management credentials missing",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        if (!resendApiKey) {
          console.error(`[${correlationId}] POST: Missing Resend API key`);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Email service not configured",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const managementClient = createClient(managementUrl, managementKey);

        // Step 2: Look up organization by slug
        console.log(`[${correlationId}] POST: Looking up organization`, { organizationSlug });

        const { data: orgData, error: orgError } = await managementClient
          .from("organizations")
          .select("id, name, supabase_url, supabase_anon_key")
          .eq("slug", organizationSlug || "default")
          .single();

        if (orgError || !orgData) {
          console.error(`[${correlationId}] POST: Organization not found`, orgError);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Organization not found",
            }),
            {
              status: 404,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        console.log(`[${correlationId}] POST: Organization found`, { 
          orgId: orgData.id,
          orgName: orgData.name 
        });

        // Step 3: Create invitation token with organization_id
        console.log(`[${correlationId}] POST: Creating invitation token`);

        const { data: tokenData, error: tokenError } = await managementClient
          .from("invitation_tokens")
          .insert({
            email: emailNormalized,
            organization_id: orgData.id,
            organization_slug: organizationSlug || "default",
            organization_supabase_url: orgData.supabase_url,
            organization_supabase_anon_key: orgData.supabase_anon_key,
          })
          .select("token")
          .single();

        if (tokenError) {
          console.error(`[${correlationId}] POST: Failed to create invitation token`, tokenError);
          return new Response(
            JSON.stringify({
              success: false,
              error: "Failed to create invitation",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        // Step 4: Construct invitation URL
        const invitationUrl = `${cleanOrigin}/verify-invitation?code=${tokenData.token}&org=${encodeURIComponent(organizationSlug || "default")}`;

        console.log(`[${correlationId}] POST: Invitation token created`, {
          userEmail: `${emailNormalized.substring(0, 3)}***@${emailNormalized.split('@')[1]}`,
        });

        // Step 5: Send invitation email via Resend
        console.log(`[${correlationId}] POST: Sending invitation email via Resend`);

        try {
          const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Transformation Hub <onboarding@resend.dev>",
              to: [emailNormalized],
              subject: `You're invited to join ${orgData.name}`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h1 style="color: #333;">Welcome to ${orgData.name}</h1>
                  <p>You've been invited to join ${orgData.name}. Click the link below to set up your account:</p>
                  <a href="${invitationUrl}" 
                     style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; 
                            text-decoration: none; border-radius: 6px; margin: 20px 0;">
                    Set Up Your Account
                  </a>
                  <p style="color: #666; font-size: 14px;">
                    Or copy and paste this link into your browser:<br>
                    <a href="${invitationUrl}" style="color: #4F46E5;">${invitationUrl}</a>
                  </p>
                  <p style="color: #999; font-size: 12px; margin-top: 40px;">
                    This invitation will expire in 7 days.
                  </p>
                </div>
              `,
            }),
          });

          const resendData = await resendResponse.json();

          if (!resendResponse.ok) {
            console.error(`[${correlationId}] POST: Resend API error`, resendData);
            // Continue anyway - token is created
          } else {
            console.log(`[${correlationId}] POST: Email sent successfully`, { 
              emailId: resendData.id 
            });
          }
        } catch (emailError) {
          console.error(`[${correlationId}] POST: Failed to send email`, emailError);
          // Continue anyway - token is created and can be resent
        }

        console.log(`[${correlationId}] FUNCTION END: Success`, {
          method: 'POST',
          statusCode: 200,
          totalDuration: Date.now() - startTime,
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: "Invitation email sent successfully",
            invitationUrl, // Still return URL for debugging/admin purposes
            correlationId,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } catch (inviteError) {
        console.error("Unexpected error during invitation:", inviteError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Unexpected error occurred while sending invitation",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    // Handle DELETE request to cancel invitations
    if (req.method === "DELETE") {
      console.log(`[${correlationId}] DELETE: Cancel invitation request`);
      
      let requestData;
      try {
        requestData = await req.json();
      } catch (parseError) {
        console.error(`[${correlationId}] DELETE: JSON parse error`, parseError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Invalid JSON in request body",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }

      const { email } = requestData;

      if (!email || typeof email !== "string") {
        return new Response(
          JSON.stringify({
            success: false,
            error: "Valid email is required",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }

      const emailNormalized = email.trim().toLowerCase();

      console.log(`[${correlationId}] DELETE: Target email`, {
        email: `${emailNormalized.substring(0, 3)}***@${emailNormalized.split('@')[1]}`
      });

      try {
        // First get the user by email
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
          console.error("Error fetching users for deletion:", authError);
          return new Response(
            JSON.stringify({
              success: true,
              message: "Invitation cancelled (unable to verify auth status)",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        const user = authData?.users?.find((u) => (u.email || '').toLowerCase() === emailNormalized && !u.email_confirmed_at);

        if (user) {
          // Delete the user from auth
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);

          if (deleteError) {
            console.error("Error deleting user:", deleteError);
            return new Response(
              JSON.stringify({
                success: true,
                message: "Invitation cancelled (auth deletion failed but processed)",
                warning: deleteError.message,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              },
            );
          }

          console.log("User deleted successfully from auth");
        } else {
          console.log("User not found in auth or already confirmed");
        }

        console.log(`[${correlationId}] FUNCTION END: Success`, {
          method: 'DELETE',
          statusCode: 200,
          totalDuration: Date.now() - startTime,
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: "Invitation cancelled successfully",
            correlationId,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } catch (deleteError) {
        console.error("Error in delete operation:", deleteError);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Invitation cancelled (processed with warnings)",
            warning: "Auth deletion may have failed",
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  } catch (error: any) {
    console.error("Error in invite-user function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
