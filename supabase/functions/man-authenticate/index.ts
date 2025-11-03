import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { corsHeaders } from '../_shared/cors.ts';

const MANAGEMENT_URL = Deno.env.get('MANAGEMENT_SUPABASE_URL')!;
const MANAGEMENT_SERVICE_KEY = Deno.env.get('MANAGEMENT_SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, password, organizationSlug } = await req.json();

    // Validate input
    if (!email || !password || !organizationSlug) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields: email, password, organizationSlug' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[man-authenticate] Authentication request for ${email} at ${organizationSlug}`);

    // Create management client
    const managementClient = createClient(MANAGEMENT_URL, MANAGEMENT_SERVICE_KEY);

    // Get organization credentials from management database
    const { data: org, error: orgError } = await managementClient
      .from('organizations')
      .select('id, name, slug, supabase_url, supabase_anon_key, supabase_service_role_key')
      .eq('slug', organizationSlug)
      .single();

    if (orgError || !org) {
      console.error('[man-authenticate] Organization not found:', orgError);
      return new Response(
        JSON.stringify({ 
          error: 'Organization not found' 
        }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Verify user is mapped to this organization
    const { data: userOrg, error: userOrgError } = await managementClient
      .from('user_organizations')
      .select('id')
      .eq('email', email.toLowerCase())
      .eq('organization_id', org.id)
      .single();

    if (userOrgError || !userOrg) {
      console.error('[man-authenticate] User not authorized for this organization:', userOrgError);
      return new Response(
        JSON.stringify({ 
          error: 'User not authorized for this organization' 
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[man-authenticate] User ${email} verified for organization ${organizationSlug}`);

    // Create client for target organization database
    const orgClient = createClient(org.supabase_url, org.supabase_service_role_key);

    // Attempt authentication on target organization database
    const { data: authData, error: authError } = await orgClient.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.session) {
      console.error('[man-authenticate] Authentication failed:', authError);
      return new Response(
        JSON.stringify({ 
          error: authError?.message || 'Authentication failed' 
        }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`[man-authenticate] Authentication successful for ${email}`);

    // Return session data AND credentials for direct client connection
    return new Response(
      JSON.stringify({
        success: true,
        session: authData.session,
        user: authData.user,
        organization: {
          id: org.id,
          name: org.name,
          slug: org.slug,
          supabase_url: org.supabase_url,
          supabase_anon_key: org.supabase_anon_key,
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('[man-authenticate] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
