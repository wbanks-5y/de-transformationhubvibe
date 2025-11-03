import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Environment variables - all operations use the organization's database
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || Deno.env.get("RESEND_API_KEY_V2");

const handler = async (req: Request): Promise<Response> => {
  console.log("[INVITE-USER] Function started");
  
  if (req.method === "OPTIONS") {
    console.log("[INVITE-USER] Handling OPTIONS request");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client for the organization database (using service role for admin operations)
    console.log("[INVITE-USER] Initializing Supabase client...");
    
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // GET: List pending invitations
    if (req.method === "GET") {
      console.log("[INVITE-USER] Fetching pending invitations...");
      
      // Get unconfirmed users (pending invites) from auth
      const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error("[INVITE-USER] Error listing users:", listError);
        throw listError;
      }

      // Filter for unconfirmed users
      const pendingInvites = authUsers.users
        .filter(user => !user.email_confirmed_at)
        .map(user => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          invited_at: user.user_metadata?.invited_at,
        }));

      console.log(`[INVITE-USER] Found ${pendingInvites.length} pending invitations`);
      
      return new Response(
        JSON.stringify({ 
          pendingInvitations: pendingInvites,
          count: pendingInvites.length 
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // POST: Create and send invitation
    if (req.method === "POST") {
      const { email } = await req.json();
      console.log(`[INVITE-USER] POST received - Email: ${email}`);

      if (!email) {
        console.error("[INVITE-USER] Missing email in request");
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();
      console.log(`[INVITE-USER] Normalized email: ${normalizedEmail}`);

      // Check if user already exists in the organization database
      console.log("[INVITE-USER] Checking if user exists in organization database...");
      const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error("[INVITE-USER] Error listing users:", listError);
        throw listError;
      }

      const existingUser = authUsers.users.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );

      if (existingUser) {
        console.log(`[INVITE-USER] User already exists: ${existingUser.id}, confirmed: ${!!existingUser.email_confirmed_at}`);
        
        if (existingUser.email_confirmed_at) {
          console.log("[INVITE-USER] User already confirmed");
          return new Response(
            JSON.stringify({
              message: "User already exists and is active",
              userId: existingUser.id,
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        } else {
          console.log("[INVITE-USER] User exists but unconfirmed - will resend");
        }
      }

      // Generate invitation token
      const token = crypto.randomUUID();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      console.log(`[INVITE-USER] Generated token: ${token.substring(0, 8)}...`);

      let userId = existingUser?.id;

      // Create user in organization Supabase if doesn't exist
      if (!existingUser) {
        console.log("[INVITE-USER] Creating new user in organization database...");
        const { data: newUserData, error: createError } = await supabase.auth.admin.createUser({
          email: normalizedEmail,
          email_confirm: false,
          user_metadata: {
            invited_at: new Date().toISOString(),
          },
        });

        if (createError) {
          console.error("[INVITE-USER] Error creating user:", createError);
          throw createError;
        }

        userId = newUserData.user.id;
        console.log(`[INVITE-USER] User created successfully: ${userId}`);
      }

      // Store invitation token in organization database
      const { error: tokenError } = await supabase
        .from("invitation_tokens")
        .insert({
          token,
          email: normalizedEmail,
          user_id: userId,
          expires_at: expiresAt.toISOString(),
          invited_by: req.headers.get("x-user-id") || null, // Optional: track who sent invite
        });

      if (tokenError) {
        console.error("[INVITE-USER] Error creating invitation token:", tokenError);
        throw tokenError;
      }

      console.log("[INVITE-USER] Token stored in organization database");

      // Send invitation email
      console.log("[INVITE-USER] Preparing to send email...");
      
      if (!RESEND_API_KEY) {
        console.error("[INVITE-USER] RESEND_API_KEY not configured");
        return new Response(
          JSON.stringify({ error: "Email service not configured" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const resend = new Resend(RESEND_API_KEY);
      
      // Build invitation link with organization credentials included
      const origin = req.headers.get("origin") || "https://preview--transformationhubvibe.lovable.app";
      const invitationLink = `${origin}/set-password?token=${token}&email=${encodeURIComponent(normalizedEmail)}&orgUrl=${encodeURIComponent(SUPABASE_URL)}&orgAnonKey=${encodeURIComponent(SUPABASE_ANON_KEY)}`;

      console.log(`[INVITE-USER] Invitation link created for: ${normalizedEmail}`);

      try {
        const emailResponse = await resend.emails.send({
          from: "5Y Technology <joe@5ytechnology.com>",
          to: [normalizedEmail],
          subject: `You're invited to join the platform`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #333;">You're Invited!</h1>
              <p>You've been invited to join the platform.</p>
              <p>Click the button below to set your password and get started:</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationLink}" 
                   style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Set Your Password
                </a>
              </div>
              <p style="color: #666; font-size: 14px;">
                This invitation will expire in 7 days.<br>
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
          `,
        });

        console.log("[INVITE-USER] Email sent successfully:", emailResponse);

        return new Response(
          JSON.stringify({
            message: "Invitation sent successfully",
            token,
            invitationLink,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      } catch (emailError: any) {
        console.error("[INVITE-USER] Error sending email:", emailError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to send invitation email", 
            details: emailError.message 
          }),
          { 
            status: 500, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
    }

    // DELETE: Cancel invitation
    if (req.method === "DELETE") {
      const { email } = await req.json();
      console.log(`[INVITE-USER] DELETE received - Email: ${email}`);

      if (!email) {
        console.error("[INVITE-USER] Missing email in request");
        return new Response(
          JSON.stringify({ error: "Email is required" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Delete user from organization database if unconfirmed
      console.log("[INVITE-USER] Looking up user to delete...");
      const { data: authUsers, error: listError } = await supabase.auth.admin.listUsers();
      
      if (listError) {
        console.error("[INVITE-USER] Error listing users:", listError);
        throw listError;
      }

      const user = authUsers.users.find(
        (u) => u.email?.toLowerCase() === normalizedEmail && !u.email_confirmed_at
      );

      if (user) {
        console.log(`[INVITE-USER] Deleting user ${user.id} from organization database...`);
        const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
        if (deleteError) {
          console.error("[INVITE-USER] Error deleting user:", deleteError);
          throw deleteError;
        }
        console.log("[INVITE-USER] User deleted from organization database");
      } else {
        console.log("[INVITE-USER] No unconfirmed user found to delete");
      }

      // Delete invitation tokens from organization database
      console.log("[INVITE-USER] Deleting invitation tokens from organization database...");
      const { error: tokenDeleteError } = await supabase
        .from("invitation_tokens")
        .delete()
        .eq("email", normalizedEmail)
        .is("used_at", null);

      if (tokenDeleteError) {
        console.error("[INVITE-USER] Error deleting tokens:", tokenDeleteError);
        throw tokenDeleteError;
      }

      console.log("[INVITE-USER] Invitation cancelled successfully");

      return new Response(
        JSON.stringify({
          message: "Invitation cancelled successfully",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("[INVITE-USER] Unexpected error:", error);
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