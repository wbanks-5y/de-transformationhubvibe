import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS"
};
const handler = async (req)=>{
  const correlationId = crypto.randomUUID();
  const startTime = Date.now();
  const timestamp = new Date().toISOString();
  console.log(`[${correlationId}] FUNCTION START`, {
    timestamp,
    method: req.method,
    origin: req.headers.get('origin') || 'none'
  });
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${correlationId}] FUNCTION END: OPTIONS (CORS preflight)`);
    return new Response(null, {
      headers: corsHeaders
    });
  }
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY") || Deno.env.get("RESEND_API_KEY_V2");
    // Management DB credentials
    const MANAGEMENT_URL = "https://fgbilpzuniuqrpetnbgz.supabase.co";
    const MANAGEMENT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYmlscHp1bml1cXJwZXRuYmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MDQ5NzMsImV4cCI6MjA3NDM4MDk3M30.XCQI7K3dohvX8QHyQ5dFrSggouyIPMdgq-orGVlaqPU";
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error(`[${correlationId}] Missing required environment variables`);
      return new Response(JSON.stringify({
        success: false,
        error: "Server configuration error"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders
        }
      });
    }
    // Create admin client with service role key (tenant DB - MasterDB)
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // Create Management DB client
    const managementClient = createClient(MANAGEMENT_URL, MANAGEMENT_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
    // ========== GET: Fetch pending invitations ==========
    if (req.method === "GET") {
      console.log(`[${correlationId}] GET: Fetching pending invitations`);
      try {
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) {
          console.error(`[${correlationId}] GET: Error fetching auth users`, authError);
          return new Response(JSON.stringify({
            success: true,
            invitations: [],
            message: "Unable to fetch from auth API"
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
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
        const pendingInvitations = (authData?.users || []).filter((user)=>{
          return !user.email_confirmed_at && !user.last_sign_in_at && (user.invited_at || user.confirmation_sent_at || user.created_at);
        }).map((user)=>({
            id: user.id,
            email: user.email,
            invited_at: user.invited_at,
            confirmation_sent_at: user.confirmation_sent_at,
            created_at: user.created_at,
            status: "pending"
          }));
        console.log(`[${correlationId}] GET: Found ${pendingInvitations.length} pending invitations`);
        return new Response(JSON.stringify({
          success: true,
          invitations: pendingInvitations,
          correlationId
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (listError) {
        console.error(`[${correlationId}] GET: Error in listUsers:`, listError);
        return new Response(JSON.stringify({
          success: true,
          invitations: [],
          message: "Error fetching invitations"
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
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
          hasOrgSlug: !!requestData.organizationSlug
        });
      } catch (parseError) {
        console.error(`[${correlationId}] POST: JSON parse error`, parseError);
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid JSON in request body"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const { email, organizationSlug, forceFallback = false, cc = [] } = requestData;
      if (!email || typeof email !== "string") {
        return new Response(JSON.stringify({
          success: false,
          error: "Valid email is required"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const emailNormalized = email.trim().toLowerCase();
      console.log(`[${correlationId}] POST: Inviting user`, {
        email: `${emailNormalized.substring(0, 3)}***`,
        organizationSlug: organizationSlug || 'default'
      });
      try {
        // Check if user already exists in MasterDB
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers({
          page: 1,
          perPage: 1000
        });
        if (authError) {
          console.error(`[${correlationId}] POST: Error checking existing users:`, authError);
          return new Response(JSON.stringify({
            success: false,
            error: "Unable to verify user status"
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const existingUser = authData?.users?.find((u)=>(u.email || '').toLowerCase() === emailNormalized);
        if (existingUser?.email_confirmed_at) {
          console.log(`[${correlationId}] POST: User already exists and is confirmed`);
          return new Response(JSON.stringify({
            success: true,
            message: "User is already a member of this organization",
            alreadyExists: true
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        // Fetch organization details from Management DB
        const { data: orgData, error: orgError } = await managementClient.from("organizations").select("*").eq("slug", organizationSlug || "default").maybeSingle();
        if (orgError || !orgData) {
          console.error(`[${correlationId}] POST: Error fetching organization from Management DB:`, orgError);
          return new Response(JSON.stringify({
            success: false,
            error: "Organization not found in Management Database"
          }), {
            status: 404,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        console.log(`[${correlationId}] POST: Organization found in Management DB`, {
          id: orgData.id,
          name: orgData.name,
          slug: orgData.slug
        });
        // Generate unique invitation token
        const invitationToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days
        // Insert invitation token into Management DB
        const { error: tokenError } = await managementClient.from("invitation_tokens").insert({
          token: invitationToken,
          email: emailNormalized,
          organization_id: orgData.id,
          organization_slug: orgData.slug,
          organization_supabase_url: orgData.supabase_url,
          organization_supabase_anon_key: orgData.supabase_anon_key,
          expires_at: expiresAt
        });
        if (tokenError) {
          console.error(`[${correlationId}] POST: Error creating invitation token in Management DB:`, tokenError);
          return new Response(JSON.stringify({
            success: false,
            error: "Failed to create invitation token"
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        console.log(`[${correlationId}] POST: Invitation token created in Management DB`, {
          token: `${invitationToken.substring(0, 8)}...`,
          expiresAt
        });
        // Build redirect URL with token
        const origin = req.headers.get("origin") || supabaseUrl.replace('//', '//app.');
        const invitationLink = `${origin}/set-password?email=${encodeURIComponent(emailNormalized)}&org=${encodeURIComponent(orgData.slug)}&token=${invitationToken}`;
        console.log(`[${correlationId}] POST: Invitation link created:`, invitationLink);
        // ============ CRITICAL CHANGE: Use createUser instead of inviteUserByEmail ============
        // This creates the user WITHOUT sending Supabase's automatic email
        const { data: createData, error: createError } = await supabase.auth.admin.createUser({
          email: emailNormalized,
          email_confirm: false,
          user_metadata: {
            organization_slug: orgData.slug,
            invited_at: new Date().toISOString()
          }
        });
        if (createError) {
          console.error(`[${correlationId}] POST: Error creating user in MasterDB:`, createError);
          return new Response(JSON.stringify({
            success: false,
            error: createError.message || "Failed to create user invitation"
          }), {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        console.log(`[${correlationId}] POST: User created in MasterDB (unconfirmed)`, {
          userId: createData?.user?.id
        });
        // Optional: Send custom email via Resend
        console.log(`[${correlationId}] POST: RESEND_API_KEY || RESEND_API_KEY_V2 ${resendApiKey ? 'FOUND' : 'NOT FOUND'} - ${resendApiKey ? 'Will send email via Resend' : 'Skipping custom email'}`);
        let resendEmailId = null;
        if (resendApiKey) {
          try {
            console.log(`[${correlationId}] POST: Sending invitation email via Resend`, {
              forceFallback,
              hasCc: cc.length > 0
            });
            const emailSubject = `You're invited to join ${orgData.name || orgData.slug}`;
            const emailTextContent = `You've been invited to join ${orgData.name || orgData.slug}. Open this link to accept your invitation and create your account: ${invitationLink}`;
            const emailHtmlContent = `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background-color: #f8f9fa; border-radius: 8px; padding: 40px; margin-bottom: 30px;">
                  <h1 style="color: #1a1a1a; margin: 0 0 20px 0; font-size: 28px; font-weight: 600;">Welcome!</h1>
                  <p style="font-size: 16px; margin-bottom: 20px; color: #4a5568;">You've been invited to join <strong>${orgData.name || orgData.slug}</strong>.</p>
                  <p style="font-size: 16px; margin-bottom: 30px; color: #4a5568;">Click the button below to accept your invitation and create your account:</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${invitationLink}" style="background-color: #4F46E5; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px;">Accept Invitation</a>
                  </div>
                  <p style="font-size: 14px; color: #718096; margin-top: 30px;">If the button doesn't work, copy and paste this link into your browser:</p>
                  <p style="font-size: 14px; color: #4F46E5; word-break: break-all;">${invitationLink}</p>
                </div>
                <div style="text-align: center; color: #a0aec0; font-size: 12px;">
                  <p>This invitation was sent to ${emailNormalized}</p>
                </div>
              </body>
              </html>
            `;
            const primaryFrom = "5Y Technology <noreply@5ytest.com>";
            const fallbackFrom = "Transformation Suite <onboarding@resend.dev>";
            const fromAddress = forceFallback ? fallbackFrom : primaryFrom;
            let sendPath = forceFallback ? 'fallback' : 'primary';
            console.log(`[${correlationId}] POST: Using ${sendPath} sender: ${fromAddress}`);
            const emailPayload = {
              from: fromAddress,
              to: [
                emailNormalized
              ],
              subject: emailSubject,
              text: emailTextContent,
              html: emailHtmlContent
            };
            if (forceFallback) {
              emailPayload.reply_to = "noreply@5ytest.com";
            }
            if (cc.length > 0) {
              emailPayload.cc = cc;
              console.log(`[${correlationId}] POST: Adding CC recipients:`, cc);
            }
            let resendResponse = await fetch("https://api.resend.com/emails", {
              method: "POST",
              headers: {
                "Authorization": `Bearer ${resendApiKey}`,
                "Content-Type": "application/json"
              },
              body: JSON.stringify(emailPayload)
            });
            let resendBody = await resendResponse.json().catch(()=>null);
            console.log(`[${correlationId}] POST: ${sendPath} Resend response (${resendResponse.status}):`, resendBody);
            // If primary domain fails with 4xx and we didn't force fallback, try fallback
            if (!forceFallback && !resendResponse.ok && resendResponse.status >= 400 && resendResponse.status < 500) {
              console.log(`[${correlationId}] POST: Primary send failed (${resendResponse.status}). Attempting automatic fallback...`);
              sendPath = 'fallback';
              const fallbackPayload = {
                from: fallbackFrom,
                reply_to: "noreply@5ytest.com",
                to: [
                  emailNormalized
                ],
                subject: emailSubject,
                text: emailTextContent,
                html: emailHtmlContent
              };
              if (cc.length > 0) {
                fallbackPayload.cc = cc;
              }
              resendResponse = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${resendApiKey}`,
                  "Content-Type": "application/json"
                },
                body: JSON.stringify(fallbackPayload)
              });
              resendBody = await resendResponse.json().catch(()=>null);
              console.log(`[${correlationId}] POST: Fallback Resend response (${resendResponse.status}):`, resendBody);
            }
            if (!resendResponse.ok) {
              console.error(`[${correlationId}] POST: Resend email failed with status ${resendResponse.status}. Body:`, resendBody);
            } else {
              resendEmailId = resendBody?.id || null;
              console.log(`[${correlationId}] POST: Resend email sent successfully via ${sendPath}. Email ID: ${resendEmailId}`);
            }
          } catch (resendError) {
            console.error(`[${correlationId}] POST: Error sending email via Resend:`, resendError);
          // Continue even if email sending fails
          }
        }
        console.log(`[${correlationId}] FUNCTION END: Success (${Date.now() - startTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Invitation sent successfully",
          token: invitationToken,
          invitationLink,
          resendEmailId,
          correlationId,
          sendPath: resendEmailId ? forceFallback ? 'fallback' : 'primary' : undefined
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (inviteError) {
        console.error(`[${correlationId}] POST: Unexpected error:`, inviteError);
        return new Response(JSON.stringify({
          success: false,
          error: "Unexpected error occurred while sending invitation"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
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
        return new Response(JSON.stringify({
          success: false,
          error: "Invalid JSON in request body"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const { email } = requestData;
      if (!email || typeof email !== "string") {
        return new Response(JSON.stringify({
          success: false,
          error: "Valid email is required"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
      const emailNormalized = email.trim().toLowerCase();
      console.log(`[${correlationId}] DELETE: Cancelling invitation for ${emailNormalized.substring(0, 3)}***`);
      try {
        // Find the user by email in MasterDB
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        if (authError) {
          console.error(`[${correlationId}] DELETE: Error fetching users:`, authError);
          return new Response(JSON.stringify({
            success: true,
            message: "Invitation cancelled (unable to verify auth status)"
          }), {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...corsHeaders
            }
          });
        }
        const user = authData?.users?.find((u)=>(u.email || '').toLowerCase() === emailNormalized && !u.email_confirmed_at);
        if (user) {
          // Delete the user from auth
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
          if (deleteError) {
            console.error(`[${correlationId}] DELETE: Error deleting user:`, deleteError);
            return new Response(JSON.stringify({
              success: false,
              error: "Failed to cancel invitation"
            }), {
              status: 500,
              headers: {
                "Content-Type": "application/json",
                ...corsHeaders
              }
            });
          }
          console.log(`[${correlationId}] DELETE: User deleted from MasterDB auth`);
        } else {
          console.log(`[${correlationId}] DELETE: User not found or already confirmed`);
        }
        // Delete invitation token(s) from Management DB
        const { error: tokenDeleteError } = await managementClient.from("invitation_tokens").delete().eq("email", emailNormalized).is("used_at", null);
        if (tokenDeleteError) {
          console.error(`[${correlationId}] DELETE: Error deleting tokens from Management DB:`, tokenDeleteError);
        } else {
          console.log(`[${correlationId}] DELETE: Invitation tokens deleted from Management DB`);
        }
        console.log(`[${correlationId}] FUNCTION END: Success (${Date.now() - startTime}ms)`);
        return new Response(JSON.stringify({
          success: true,
          message: "Invitation cancelled successfully",
          correlationId
        }), {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      } catch (deleteError) {
        console.error(`[${correlationId}] DELETE: Error:`, deleteError);
        return new Response(JSON.stringify({
          success: false,
          error: "Error cancelling invitation"
        }), {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders
          }
        });
      }
    }
    // Method not allowed
    return new Response(JSON.stringify({
      success: false,
      error: "Method not allowed"
    }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error(`[${correlationId}] FUNCTION ERROR:`, error);
    return new Response(JSON.stringify({
      success: false,
      error: "Internal server error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders
      }
    });
  }
};
serve(handler);
