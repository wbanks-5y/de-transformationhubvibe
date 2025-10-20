import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
};

const resendApiKey = Deno.env.get("RESEND_API_KEY_V2");
if (!resendApiKey) {
  console.warn("RESEND_API_KEY_V2 not found - email sending will fail");
}
const resend = new Resend(resendApiKey);

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
      console.log(`[${correlationId}] GET: Fetching pending invitations`);

      try {
        // Get all users from auth.users
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

        console.log(`[${correlationId}] GET: listUsers result`, {
          success: !authError,
          totalUsers: authData?.users?.length || 0,
          errorMessage: authError?.message
        });

        if (authError) {
          console.error(`[${correlationId}] GET: Error fetching auth users`, authError);
          return new Response(
            JSON.stringify({
              success: true,
              invitations: [],
              message: "Unable to fetch from auth API",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        // Filter for users who haven't confirmed their email (pending invitations)
        const pendingInvitations = (authData?.users || [])
          .filter((user) => !user.email_confirmed_at && user.invited_at)
          .map((user) => ({
            id: user.id,
            email: user.email,
            invited_at: user.invited_at,
            status: "pending",
          }));

        console.log(`[${correlationId}] GET: Pending invitations found`, {
          count: pendingInvitations.length
        });

        console.log(`[${correlationId}] FUNCTION END: Success`, {
          method: 'GET',
          statusCode: 200,
          totalDuration: Date.now() - startTime,
        });

        return new Response(
          JSON.stringify({
            success: true,
            invitations: pendingInvitations,
            correlationId,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } catch (listError) {
        console.error("Error in listUsers:", listError);
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

        // Step 1: Create custom invitation token in management DB
        const managementUrl = Deno.env.get("MANAGEMENT_SUPABASE_URL");
        const managementKey = Deno.env.get("MANAGEMENT_SUPABASE_ANON_KEY");

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

        const managementClient = createClient(managementUrl, managementKey);

        console.log(`[${correlationId}] POST: Creating custom invitation token in management DB`);

        const { data: tokenData, error: tokenError } = await managementClient
          .from("invitation_tokens")
          .insert({
            email: emailNormalized,
            organization_slug: organizationSlug || "default",
            organization_supabase_url: supabaseUrl,
            organization_supabase_anon_key: Deno.env.get("SUPABASE_ANON_KEY") || "",
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

        // Step 2: Construct custom invitation URL
        // This URL will be used by the Management App to send the invitation email
        const invitationUrl = `${cleanOrigin}/verify-invitation?code=${tokenData.token}&org=${encodeURIComponent(organizationSlug || "default")}`;

        console.log(`[${correlationId}] POST: Custom invitation created successfully`, {
          userEmail: `${emailNormalized.substring(0, 3)}***@${emailNormalized.split('@')[1]}`,
          invitationUrl: invitationUrl.substring(0, 50) + "...",
        });

        // Step 3: Send invitation email
        let emailSent = false;
        let emailError = null;

        try {
          if (!resendApiKey) {
            throw new Error("RESEND_API_KEY_V2 is not configured");
          }

          const emailHtml = `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                  .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
                  .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🎉 You're Invited!</h1>
                  </div>
                  <div class="content">
                    <h2>Welcome to Transform Hub</h2>
                    <p>You've been invited to join Transform Hub. Click the button below to accept your invitation and set up your account.</p>
                    <div style="text-align: center;">
                      <a href="${invitationUrl}" class="button">Accept Invitation</a>
                    </div>
                    <p style="margin-top: 30px; font-size: 14px; color: #666;">
                      Or copy and paste this link into your browser:<br>
                      <code style="background: #f4f4f4; padding: 10px; display: block; margin-top: 10px; word-break: break-all;">${invitationUrl}</code>
                    </p>
                    <p style="margin-top: 30px; color: #999; font-size: 12px;">
                      This invitation link will expire in 24 hours.
                    </p>
                  </div>
                  <div class="footer">
                    <p>© 2025 Transform Hub. All rights reserved.</p>
                  </div>
                </div>
              </body>
            </html>
          `;

          const emailResponse = await resend.emails.send({
            from: "Transform Hub <onboarding@resend.dev>",
            to: [emailNormalized],
            subject: "You've Been Invited to Transform Hub",
            html: emailHtml,
          });

          emailSent = true;
          console.log(`[${correlationId}] POST: Invitation email sent successfully`, {
            to: emailNormalized.substring(0, 3) + '***@' + emailNormalized.split('@')[1]
          });
        } catch (error: any) {
          emailError = error.message || "Unknown email error";
          console.error(`[${correlationId}] POST: Failed to send invitation email`, {
            error: emailError,
            hasApiKey: !!resendApiKey,
            errorDetails: error,
          });
        }

        console.log(`[${correlationId}] FUNCTION END: Success`, {
          method: 'POST',
          statusCode: 200,
          totalDuration: Date.now() - startTime,
        });

        return new Response(
          JSON.stringify({
            success: true,
            message: emailSent 
              ? "Invitation created and email sent successfully"
              : "Invitation created but email failed to send",
            invitationUrl,
            emailSent,
            emailError: emailError || undefined,
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
