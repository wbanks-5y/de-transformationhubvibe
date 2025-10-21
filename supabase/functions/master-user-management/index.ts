import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ORGANIZATION_API_KEY = Deno.env.get("ORGANIZATION_API_KEY_V2");

// Helper Functions for User Creation with Email Notifications

// Generate secure random password (16 characters)
function generateSecurePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  let password = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomValues[i] % charset.length];
  }
  return password;
}

// Calculate invitation expiration (48 hours from now)
function getInvitationExpiration(): string {
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + 48);
  return expirationDate.toISOString();
}

// Send welcome email via Resend
// TEMPORARILY DISABLED: Build issue with npm:resend@2.0.0 type checking
async function sendWelcomeEmail(
  email: string, 
  temporaryPassword: string, 
  isAdmin: boolean = false
): Promise<{ sent: boolean; error: string | null }> {
  console.warn('Email sending temporarily disabled - will be re-enabled after resolving build issues');
  return { sent: false, error: 'Email sending temporarily disabled' };
  
  /* ORIGINAL CODE - TO BE RESTORED:
  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  
  if (!resendApiKey) {
    console.warn('RESEND_API_KEY not configured - skipping email notification');
    return { sent: false, error: 'RESEND_API_KEY not configured' };
  }

  try {
    const { Resend } = await import('npm:resend@2.0.0');
    const resend = new Resend(resendApiKey);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const appUrl = supabaseUrl.replace('.supabase.co', '.lovable.app') || 'https://your-app.com';
    const roleText = isAdmin ? 'Admin' : 'User';

    const emailResponse = await resend.emails.send({
      from: 'Admin <onboarding@resend.dev>',
      to: [email],
      subject: `Welcome to the ${roleText} Portal - Account Created`,
      html: `
        ... email template ...
      `,
    });

    console.log('Email sent successfully to:', email);
    return { sent: true, error: null };
  } catch (error) {
    console.error('Error sending email:', error);
    return { 
      sent: false, 
      error: error instanceof Error ? error.message : String(error) 
    };
  }
  */
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate HTTP method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate API Key
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("Missing or invalid Authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing or invalid API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const providedKey = authHeader.replace("Bearer ", "");
    if (providedKey !== ORGANIZATION_API_KEY) {
      console.error("Invalid API key provided");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Invalid API key" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const body = await req.json();
    const { action, data } = body;

    if (!action) {
      return new Response(
        JSON.stringify({ error: "Missing required field: action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    console.log(`Processing action: ${action}`);

    // Route to appropriate handler
    switch (action) {
      case "create_user":
        return await handleCreateUser(supabaseAdmin, data);
      
      case "create_admin_user":
        return await handleCreateAdminUser(supabaseAdmin, data);
      
      case "create_users_bulk":
        return await handleCreateUsersBulk(supabaseAdmin, data);
      
      case "update_user":
        return await handleUpdateUser(supabaseAdmin, data);
      
      case "update_organization":
        return await handleUpdateOrganization(supabaseAdmin, data);
      
      case "update_organization_tier":
        return await handleUpdateOrganizationTier(supabaseAdmin, data);
      
      case "delete_user":
        return await handleDeleteUser(supabaseAdmin, data);
      
      case "delete_bulk_users":
        return await handleDeleteBulkUsers(supabaseAdmin, data);
      
      default:
        return new Response(
          JSON.stringify({ 
            error: `Unknown action: ${action}`,
            available_actions: [
              "create_user",
              "create_admin_user",
              "create_users_bulk",
              "update_user",
              "update_organization",
              "update_organization_tier",
              "delete_user",
              "delete_bulk_users"
            ]
          }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

  } catch (error) {
    console.error("Error in master-user-management:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Handler: Create User with Role
async function handleCreateUser(supabaseAdmin: any, data: any) {
  const { email, userData } = data;

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Missing required field: email" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Generate temporary password server-side
    const temporaryPassword = generateSecurePassword();
    const invitationExpiration = getInvitationExpiration();
    const sendNotification = data.sendNotification !== false; // defaults to true
    const appRole = userData?.app_role || 'user';

    // Create user in Supabase Auth with metadata
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        password_change_required: true,
        invitation_expires_at: invitationExpiration,
        created_by_admin: true,
        temporary_password_set: true
      }
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return new Response(
        JSON.stringify({ error: `Failed to create user: ${authError.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authUser.user.id;
    const company = userData?.company;

    // Fetch organization if company provided
    let tier = 'essential';
    let organizationId = null;

    if (company) {
      const { data: org } = await supabaseAdmin
        .from('organizations')
        .select('id, tier')
        .ilike('name', company)
        .single();
      
      if (org) {
        organizationId = org.id;
        tier = org.tier || 'essential';
      }
    }

    // Upsert profile
    const profileData = {
      id: userId,
      full_name: userData?.full_name || '',
      email: email,
      company: company || '',
      job_title: userData?.job_title || '',
      phone: userData?.phone || '',
      app_role: appRole,
      tier: tier,
      organization_id: organizationId,
      status: 'approved',
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return new Response(
        JSON.stringify({ error: `Profile creation failed: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Assign role
    const { data: role } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', appRole)
      .single();

    if (role) {
      await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: userId, role_id: role.id });
    }

    // Send welcome email notification
    let emailResult = { sent: false, error: null };
    if (sendNotification) {
      emailResult = await sendWelcomeEmail(email, temporaryPassword, appRole === 'admin');
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: 'create_user',
        result: {
          user: {
            id: userId,
            email: email,
            role: appRole,
            tier: tier,
            organization_id: organizationId,
            status: 'approved'
          },
          temporaryPassword,
          invitationExpiresAt: invitationExpiration,
          emailSent: emailResult.sent,
          emailError: emailResult.error,
          message: emailResult.sent 
            ? 'User created successfully with email notification sent'
            : 'User created successfully (email notification failed - check logs)',
          securityNote: 'User must change password on first login. Invitation expires in 48 hours.'
        }
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Handler: Create Admin User
async function handleCreateAdminUser(supabaseAdmin: any, data: any) {
  const { email, userData } = data;

  if (!email) {
    return new Response(
      JSON.stringify({ error: "Missing required field: email" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Generate temporary password server-side
    const temporaryPassword = generateSecurePassword();
    const invitationExpiration = getInvitationExpiration();
    const sendNotification = data.sendNotification !== false; // defaults to true

    // Create user in Supabase Auth with metadata
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: temporaryPassword,
      email_confirm: true,
      user_metadata: {
        password_change_required: true,
        invitation_expires_at: invitationExpiration,
        created_by_admin: true,
        temporary_password_set: true
      }
    });

    if (authError) {
      console.error("Auth creation error:", authError);
      return new Response(
        JSON.stringify({ error: `Failed to create admin user: ${authError.message}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = authUser.user.id;
    const company = userData?.company;

    // Fetch organization if company provided
    let tier = 'admin';
    let organizationId = null;

    if (company) {
      const { data: org } = await supabaseAdmin
        .from('organizations')
        .select('id, tier')
        .ilike('name', company)
        .single();
      
      if (org) {
        organizationId = org.id;
        tier = org.tier || 'admin';
      }
    }

    // Upsert profile with admin role
    const profileData = {
      id: userId,
      full_name: userData?.full_name || '',
      email: email,
      company: company || '',
      job_title: userData?.job_title || '',
      phone: userData?.phone || '',
      app_role: 'admin',
      tier: tier,
      organization_id: organizationId,
      status: 'approved',
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert(profileData);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return new Response(
        JSON.stringify({ error: `Profile creation failed: ${profileError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Assign admin role
    const { data: adminRole } = await supabaseAdmin
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();

    if (adminRole) {
      await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: userId, role_id: adminRole.id });
    }

    // Send welcome email notification
    let emailResult = { sent: false, error: null };
    if (sendNotification) {
      emailResult = await sendWelcomeEmail(email, temporaryPassword, true);
    }

    return new Response(
      JSON.stringify({
        success: true,
        action: 'create_admin_user',
        result: {
          user: {
            id: userId,
            email: email,
            role: 'admin',
            tier: tier,
            organization_id: organizationId,
            status: 'approved'
          },
          temporaryPassword,
          invitationExpiresAt: invitationExpiration,
          emailSent: emailResult.sent,
          emailError: emailResult.error,
          message: emailResult.sent 
            ? 'Admin user created successfully with email notification sent'
            : 'Admin user created successfully (email notification failed - check logs)',
          securityNote: 'User must change password on first login. Invitation expires in 48 hours.'
        }
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error creating admin user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Handler: Create Users Bulk
async function handleCreateUsersBulk(supabaseAdmin: any, data: any) {
  const { users } = data;

  if (!users || !Array.isArray(users)) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'users' array" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (users.length === 0) {
    return new Response(
      JSON.stringify({ error: "Users array cannot be empty" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (users.length > 100) {
    return new Response(
      JSON.stringify({ error: "Cannot process more than 100 users at once" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate all users have required fields
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (!user.email) {
      return new Response(
        JSON.stringify({ error: `User at index ${i} missing required field: email` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const appRole = user.userData?.app_role;
    if (appRole && !['admin', 'user'].includes(appRole)) {
      return new Response(
        JSON.stringify({ error: `User at index ${i} has invalid app_role. Must be 'admin' or 'user'` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  // Optimization: Fetch all unique organizations upfront
  const uniqueCompanies = [...new Set(users.map(u => u.userData?.company).filter(Boolean))];
  const organizationsMap = new Map();

  if (uniqueCompanies.length > 0) {
    const { data: orgs } = await supabaseAdmin
      .from('organizations')
      .select('id, name, tier')
      .in('name', uniqueCompanies);
    
    if (orgs) {
      orgs.forEach((org: any) => {
        organizationsMap.set(org.name.toLowerCase(), org);
      });
    }
  }

  // Fetch roles upfront
  const { data: roles } = await supabaseAdmin
    .from('roles')
    .select('id, name')
    .in('name', ['admin', 'user']);
  
  const rolesMap = new Map();
  if (roles) {
    roles.forEach((role: any) => {
      rolesMap.set(role.name, role.id);
    });
  }

  // Process each user
  const results = [];
  let successCount = 0;
  let failureCount = 0;
  const sendNotification = data.sendNotification !== false; // defaults to true

  for (const userRequest of users) {
    const { email, userData } = userRequest;

    try {
      // Generate temporary password for this user
      const temporaryPassword = generateSecurePassword();
      const invitationExpiration = getInvitationExpiration();
      const appRole = userData?.app_role || 'user';

      // Create auth user with metadata
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password: temporaryPassword,
        email_confirm: true,
        user_metadata: {
          password_change_required: true,
          invitation_expires_at: invitationExpiration,
          created_by_admin: true,
          temporary_password_set: true
        }
      });

      if (authError) {
        console.error(`Failed to create auth user ${email}:`, authError);
        results.push({
          email,
          success: false,
          error: authError.message
        });
        failureCount++;
        continue;
      }

      const userId = authUser.user.id;
      const company = userData?.company;

      // Look up organization
      let tier = 'essential';
      let organizationId = null;

      if (company) {
        const org = organizationsMap.get(company.toLowerCase());
        if (org) {
          organizationId = org.id;
          tier = org.tier || 'essential';
        }
      }

      // Create profile
      const profileData = {
        id: userId,
        full_name: userData?.full_name || '',
        email: email,
        company: company || '',
        job_title: userData?.job_title || '',
        phone: userData?.phone || '',
        app_role: appRole,
        tier: tier,
        organization_id: organizationId,
        status: 'approved',
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert(profileData);

      if (profileError) {
        console.error(`Failed to create profile for ${email}:`, profileError);
        results.push({
          email,
          success: false,
          error: `Profile creation failed: ${profileError.message}`
        });
        failureCount++;
        continue;
      }

      // Assign role
      const roleId = rolesMap.get(appRole);
      if (roleId) {
        await supabaseAdmin
          .from('user_roles')
          .insert({ user_id: userId, role_id: roleId });
      }

      // Send welcome email notification
      let emailResult = { sent: false, error: null };
      if (sendNotification) {
        emailResult = await sendWelcomeEmail(email, temporaryPassword, appRole === 'admin');
      }

      results.push({
        email,
        success: true,
        user: {
          id: userId,
          email: email,
          role: appRole,
          tier: tier,
          status: 'approved'
        },
        temporaryPassword,
        invitationExpiresAt: invitationExpiration,
        emailSent: emailResult.sent,
        emailError: emailResult.error
      });
      successCount++;

    } catch (error) {
      console.error(`Error processing user ${email}:`, error);
      results.push({
        email,
        success: false,
        error: error.message
      });
      failureCount++;
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      summary: {
        total: users.length,
        successful: successCount,
        failed: failureCount
      },
      results
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// Handler: Update User
async function handleUpdateUser(supabaseAdmin: any, data: any) {
  const { target_user_id, updates } = data;

  if (!target_user_id) {
    return new Response(
      JSON.stringify({ error: "Missing required field: target_user_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!updates || typeof updates !== 'object') {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'updates' object" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(target_user_id)) {
    return new Response(
      JSON.stringify({ error: "Invalid target_user_id format. Must be a valid UUID." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Check if user exists
    const { data: existingProfile, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', target_user_id)
      .single();

    if (fetchError || !existingProfile) {
      return new Response(
        JSON.stringify({ error: `User not found with id: ${target_user_id}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and build update object
    const validatedUpdates: any = { updated_at: new Date().toISOString() };
    const allowedFields = ['full_name', 'company', 'job_title', 'phone', 'status', 'tier', 'organization_id', 'email', 'app_role'];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        validatedUpdates[field] = updates[field];
      }
    }

    // Validate organization_id if provided
    if (updates.organization_id) {
      const { data: org } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('id', updates.organization_id)
        .single();
      
      if (!org) {
        return new Response(
          JSON.stringify({ error: `Organization not found with id: ${updates.organization_id}` }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate email if provided
    if (updates.email !== undefined) {
      // Basic email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.email)) {
        return new Response(
          JSON.stringify({ error: "Invalid email format" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Check if email is already in use by another user
      const { data: existingEmail } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', updates.email)
        .neq('id', target_user_id)
        .maybeSingle();
      
      if (existingEmail) {
        return new Response(
          JSON.stringify({ error: `Email ${updates.email} is already in use by another user` }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate app_role if provided
    if (updates.app_role !== undefined) {
      const validRoles = ['admin', 'moderator', 'user'];
      if (!validRoles.includes(updates.app_role)) {
        return new Response(
          JSON.stringify({ error: `Invalid app_role. Must be one of: ${validRoles.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Log security event for role changes
      console.log(`Role change requested for user ${target_user_id} to ${updates.app_role}`);
    }

    if (Object.keys(validatedUpdates).length === 1) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update profile
    const { data: updatedProfile, error: updateError } = await supabaseAdmin
      .from('profiles')
      .update(validatedUpdates)
      .eq('id', target_user_id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update user: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Log to security audit with enhanced details for sensitive fields
    const sensitiveFields = ['app_role', 'tier', 'status'];
    const updatedSensitiveFields = Object.keys(validatedUpdates).filter(f => sensitiveFields.includes(f));
    
    await supabaseAdmin
      .from('security_audit_log')
      .insert({
        user_id: target_user_id,
        action: 'user_profile_updated',
        resource_type: 'profile',
        resource_id: target_user_id,
        details: { 
          updated_fields: Object.keys(validatedUpdates),
          sensitive_fields_updated: updatedSensitiveFields,
          previous_values: updatedSensitiveFields.length > 0 ? {
            app_role: existingProfile.app_role,
            tier: existingProfile.tier,
            status: existingProfile.status
          } : {}
        },
        success: true
      });

    return new Response(
      JSON.stringify({
        success: true,
        message: "User profile updated successfully",
        profile: updatedProfile
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Helper: Generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Handler: Update Organization
async function handleUpdateOrganization(supabaseAdmin: any, data: any) {
  const { organization_id, updates } = data;

  if (!organization_id) {
    return new Response(
      JSON.stringify({ error: "Missing required field: organization_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!updates || typeof updates !== 'object') {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'updates' object" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Check if organization exists
    const { data: existingOrg, error: fetchError } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', organization_id)
      .single();

    if (fetchError || !existingOrg) {
      return new Response(
        JSON.stringify({ error: `Organization not found with id: ${organization_id}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and build update object
    const validatedUpdates: any = { updated_at: new Date().toISOString() };
    const allowedFields = [
      'name', 
      'slug',
      'description',
      'logo_url',
      'website', 
      'contact_email', 
      'contact_phone', 
      'address',
      'tier',
      'status',
      'max_users',
      'settings',
      'features',
      'brand_colors',
      'custom_domain',
      'subscription_starts_at',
      'subscription_ends_at'
    ];

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        validatedUpdates[field] = updates[field];
      }
    }

    // Auto-generate slug if name is updated and slug is not explicitly provided
    if (updates.name !== undefined && updates.slug === undefined) {
      validatedUpdates.slug = generateSlug(updates.name);
    }

    // Validate tier if provided
    if (updates.tier !== undefined) {
      const validTiers = ['essential', 'professional', 'enterprise'];
      if (!validTiers.includes(updates.tier)) {
        return new Response(
          JSON.stringify({ error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate status if provided
    if (updates.status !== undefined) {
      const validStatuses = ['active', 'inactive', 'suspended'];
      if (!validStatuses.includes(updates.status)) {
        return new Response(
          JSON.stringify({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate contact_email if provided
    if (updates.contact_email !== undefined && updates.contact_email !== null && updates.contact_email !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updates.contact_email)) {
        return new Response(
          JSON.stringify({ error: 'Invalid contact_email format' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate website if provided
    if (updates.website !== undefined && updates.website !== null && updates.website !== '') {
      const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
      if (!urlRegex.test(updates.website)) {
        return new Response(
          JSON.stringify({ error: 'Invalid website URL format' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate max_users if provided
    if (updates.max_users !== undefined) {
      if (typeof updates.max_users !== 'number' || updates.max_users < 1) {
        return new Response(
          JSON.stringify({ error: 'max_users must be a positive integer' }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Validate slug uniqueness if explicitly provided or auto-generated
    if (validatedUpdates.slug !== undefined) {
      const { data: existingSlug } = await supabaseAdmin
        .from('organizations')
        .select('id')
        .eq('slug', validatedUpdates.slug)
        .neq('id', organization_id)
        .maybeSingle();
      
      if (existingSlug) {
        return new Response(
          JSON.stringify({ error: `Slug '${validatedUpdates.slug}' is already in use by another organization` }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    if (Object.keys(validatedUpdates).length === 1) {
      return new Response(
        JSON.stringify({ error: "No valid fields to update" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update organization
    const { data: updatedOrg, error: updateError } = await supabaseAdmin
      .from('organizations')
      .update(validatedUpdates)
      .eq('id', organization_id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update organization: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Organization updated successfully",
        organization: updatedOrg,
        updated_fields: Object.keys(validatedUpdates).filter(k => k !== 'updated_at')
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error updating organization:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Handler: Update Organization Tier
async function handleUpdateOrganizationTier(supabaseAdmin: any, data: any) {
  const { organization_id, tier } = data;

  if (!organization_id) {
    return new Response(
      JSON.stringify({ error: "Missing required field: organization_id" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (!tier) {
    return new Response(
      JSON.stringify({ error: "Missing required field: tier" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const validTiers = ['essential', 'professional', 'enterprise', 'admin'];
  if (!validTiers.includes(tier)) {
    return new Response(
      JSON.stringify({ error: `Invalid tier. Must be one of: ${validTiers.join(', ')}` }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Check if organization exists
    const { data: existingOrg, error: fetchError } = await supabaseAdmin
      .from('organizations')
      .select('*')
      .eq('id', organization_id)
      .single();

    if (fetchError || !existingOrg) {
      return new Response(
        JSON.stringify({ error: `Organization not found with id: ${organization_id}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update tier
    const { data: updatedOrg, error: updateError } = await supabaseAdmin
      .from('organizations')
      .update({ tier, updated_at: new Date().toISOString() })
      .eq('id', organization_id)
      .select()
      .single();

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ error: `Failed to update tier: ${updateError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Organization tier updated successfully",
        organization: updatedOrg
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error updating organization tier:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Handler: Delete User
async function handleDeleteUser(supabaseAdmin: any, data: any) {
  const { userId } = data;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing required field: userId" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate UUID format
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    return new Response(
      JSON.stringify({ error: "Invalid userId format. Must be a valid UUID." }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // Verify user exists
    const { data: userData, error: userFetchError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userFetchError || !userData.user) {
      return new Response(
        JSON.stringify({ error: `User not found with id: ${userId}` }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Anonymize security audit logs
    await supabaseAdmin
      .from('security_audit_log')
      .update({ user_id: null })
      .eq('user_id', userId);

    // Delete user roles
    await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId);

    // Delete profile
    await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    // Delete from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Auth deletion error:", deleteError);
      return new Response(
        JSON.stringify({ error: `Failed to delete user from authentication: ${deleteError.message}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `User ${userId} deleted successfully`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error deleting user:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

// Handler: Delete Bulk Users
async function handleDeleteBulkUsers(supabaseAdmin: any, data: any) {
  const { userIds } = data;

  if (!userIds || !Array.isArray(userIds)) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid 'userIds' array" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (userIds.length === 0) {
    return new Response(
      JSON.stringify({ error: "userIds array cannot be empty" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  if (userIds.length > 100) {
    return new Response(
      JSON.stringify({ error: "Cannot delete more than 100 users at once" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // Validate all are UUIDs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  for (let i = 0; i < userIds.length; i++) {
    if (!uuidRegex.test(userIds[i])) {
      return new Response(
        JSON.stringify({ error: `Invalid UUID at index ${i}: ${userIds[i]}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  }

  const results = [];
  let successCount = 0;
  let failureCount = 0;

  for (const userId of userIds) {
    try {
      // Verify user exists
      const { data: userData, error: userFetchError } = await supabaseAdmin.auth.admin.getUserById(userId);

      if (userFetchError || !userData.user) {
        results.push({
          userId,
          success: false,
          error: "User not found"
        });
        failureCount++;
        continue;
      }

      // Anonymize security audit logs
      await supabaseAdmin
        .from('security_audit_log')
        .update({ user_id: null })
        .eq('user_id', userId);

      // Delete user roles
      await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Delete profile
      await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      // Delete from auth
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

      if (deleteError) {
        console.error(`Failed to delete user ${userId}:`, deleteError);
        results.push({
          userId,
          success: false,
          error: deleteError.message
        });
        failureCount++;
        continue;
      }

      results.push({
        userId,
        success: true,
        message: "User deleted successfully"
      });
      successCount++;

    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      results.push({
        userId,
        success: false,
        error: error.message
      });
      failureCount++;
    }
  }

  return new Response(
    JSON.stringify({
      success: true,
      summary: {
        total: userIds.length,
        successful: successCount,
        failed: failureCount
      },
      results
    }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
