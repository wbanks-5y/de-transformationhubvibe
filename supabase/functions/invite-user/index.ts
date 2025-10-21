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
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`[${correlationId}] FUNCTION START`, {
    timestamp,
    method: req.method,
    origin: req.headers.get('origin') || 'none',
  });

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${correlationId}] FUNCTION END: OPTIONS (CORS preflight)`);
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${correlationId}] Missing required environment variables`);
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

    // Create admin client with service role key (tenant DB)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // ========== GET: Fetch pending invitations ==========
    if (req.method === "GET") {
      console.log(`[${correlationId}] GET: Fetching pending invitations`);

      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

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

        // Add debugging to see what fields are actually present
        if (authData?.users && authData.users.length > 0) {
          const sampleUser = authData.users[0];
          console.log(`[${correlationId}] GET: Sample user fields:`, {
            hasInvitedAt: !!sampleUser?.invited_at,
            hasConfirmationSentAt: !!sampleUser?.confirmation_sent_at,
            hasEmailConfirmedAt: !!sampleUser?.email_confirmed_at,
            hasLastSignInAt: !!sampleUser?.last_sign_in_at,
            totalUsers: authData.users.length
          });
        }

        // Filter for users who haven't confirmed their email (pending invitations)
        // Use multiple indicators since invited_at may not always be populated
        const pendingInvitations = (authData?.users || [])
          .filter((user) => {
            // User is pending if:
            // 1. Email not confirmed
            // 2. Never signed in
            // 3. Has one of: invited_at, confirmation_sent_at, or was created recently
            return (
              !user.email_confirmed_at && 
              !user.last_sign_in_at &&
              (user.invited_at || user.confirmation_sent_at || user.created_at)
            );
          })
          .map((user) => ({
            id: user.id,
            email: user.email,
            invited_at: user.invited_at,
            confirmation_sent_at: user.confirmation_sent_at,
            created_at: user.created_at,
            status: "pending",
          }));

        console.log(`[${correlationId}] GET: Found ${pendingInvitations.length} pending invitations`);

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
        console.error(`[${correlationId}] GET: Error in listUsers:`, listError);
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

    // ========== POST: Send invitation ==========
    if (req.method === "POST") {
      console.log(`[${correlationId}] POST: Invite request received`);
      
      let requestData;
      try {
        requestData = await req.json();
        console.log(`[${correlationId}] POST: Request payload`, {
          email: requestData.email ? `${requestData.email.substring(0, 3)}***` : 'missing',
          hasOrgSlug: !!requestData.organizationSlug,
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

      const emailNormalized = email.trim().toLowerCase();

      console.log(`[${correlationId}] POST: Inviting user`, {
        email: `${emailNormalized.substring(0, 3)}***`,
        organizationSlug: organizationSlug || 'default',
      });

      try {
        // Check if user already exists
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000,
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

        if (existingUser?.email_confirmed_at) {
          console.log(`[${correlationId}] POST: User already exists and is confirmed`);
          return new Response(
            JSON.stringify({
              success: false,
              error: "User already exists in this organization",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        // Build redirect URL
        const origin = req.headers.get("origin") || supabaseUrl.replace('//', '//app.');
        const redirectTo = `${origin}/auth/callback`;

        console.log(`[${correlationId}] POST: Calling inviteUserByEmail with redirectTo: ${redirectTo}`);

        // Invite user via Supabase Auth
        const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
          emailNormalized,
          {
            redirectTo,
            data: {
              organization_slug: organizationSlug || 'default',
            },
          }
        );

        if (inviteError) {
          console.error(`[${correlationId}] POST: Error inviting user:`, inviteError);
          return new Response(
            JSON.stringify({
              success: false,
              error: inviteError.message || "Failed to send invitation",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            },
          );
        }

        console.log(`[${correlationId}] POST: Invitation created successfully`);

        // Optional: Send custom email via Resend
        if (resendApiKey) {
          try {
            console.log(`[${correlationId}] POST: Sending invitation email via Resend`);
            
            const resendResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                from: "noreply@yourdomain.com", // Update this with your verified domain
                to: [emailNormalized],
                subject: `You're invited to join ${organizationSlug || 'the organization'}`,
                html: `
                  <h1>Welcome!</h1>
                  <p>You've been invited to join ${organizationSlug || 'our organization'}.</p>
                  <p>Click the button below to accept your invitation and create your account:</p>
                  <p><a href="${redirectTo}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Accept Invitation</a></p>
                  <p>If the button doesn't work, copy and paste this link into your browser:</p>
                  <p>${redirectTo}</p>
                `,
              }),
            });

            if (!resendResponse.ok) {
              console.warn(`[${correlationId}] POST: Resend email failed:`, await resendResponse.text());
            } else {
              console.log(`[${correlationId}] POST: Resend email sent successfully`);
            }
          } catch (emailError) {
            console.warn(`[${correlationId}] POST: Error sending email via Resend:`, emailError);
            // Don't fail the request if email fails
          }
        }

        console.log(`[${correlationId}] FUNCTION END: Success (${Date.now() - startTime}ms)`);

        return new Response(
          JSON.stringify({
            success: true,
            message: "Invitation sent successfully",
            correlationId,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      } catch (inviteError) {
        console.error(`[${correlationId}] POST: Unexpected error:`, inviteError);
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

    // ========== DELETE: Cancel invitation ==========
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

      console.log(`[${correlationId}] DELETE: Cancelling invitation for ${emailNormalized.substring(0, 3)}***`);

      try {
        // Find the user by email
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();

        if (authError) {
          console.error(`[${correlationId}] DELETE: Error fetching users:`, authError);
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
            console.error(`[${correlationId}] DELETE: Error deleting user:`, deleteError);
            return new Response(
              JSON.stringify({
                success: false,
                error: "Failed to cancel invitation",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              },
            );
          }

          console.log(`[${correlationId}] DELETE: User deleted successfully`);
        } else {
          console.log(`[${correlationId}] DELETE: User not found or already confirmed`);
        }

        console.log(`[${correlationId}] FUNCTION END: Success (${Date.now() - startTime}ms)`);

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
        console.error(`[${correlationId}] DELETE: Error:`, deleteError);
        return new Response(
          JSON.stringify({
            success: false,
            error: "Error cancelling invitation",
          }),
          {
            status: 500,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          },
        );
      }
    }

    // Method not allowed
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
  } catch (error) {
    console.error(`[${correlationId}] FUNCTION ERROR:`, error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      },
    );
  }
};

serve(handler);
