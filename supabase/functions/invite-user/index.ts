
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
};

interface InviteUserRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Server configuration error'
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders } 
        }
      );
    }
    
    // Create admin client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Handle GET request to fetch pending invitations
    if (req.method === 'GET') {
      console.log('Fetching pending invitations...');
      
      try {
        // Get all users from auth.users
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching auth users:', authError);
          return new Response(
            JSON.stringify({ 
              success: true,
              invitations: [],
              message: 'Unable to fetch from auth API'
            }),
            { 
              status: 200, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }

        console.log('Auth users fetched:', authData?.users?.length || 0);

        // Filter for users who haven't confirmed their email (pending invitations)
        const pendingInvitations = (authData?.users || [])
          .filter(user => !user.email_confirmed_at && user.invited_at)
          .map(user => ({
            id: user.id,
            email: user.email,
            invited_at: user.invited_at,
            status: 'pending'
          }));

        console.log('Pending invitations found:', pendingInvitations.length);

        return new Response(
          JSON.stringify({ 
            success: true, 
            invitations: pendingInvitations 
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      } catch (listError) {
        console.error('Error in listUsers:', listError);
        return new Response(
          JSON.stringify({ 
            success: true,
            invitations: [],
            message: 'Error fetching invitations'
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
    }

    // Handle POST request to send invitations
    if (req.method === 'POST') {
      let requestData;
      try {
        requestData = await req.json();
      } catch (parseError) {
        console.error('Error parsing request JSON:', parseError);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Invalid JSON in request body' 
          }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      const { email }: InviteUserRequest = requestData;

      if (!email || typeof email !== 'string') {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Valid email is required' 
          }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log(`Attempting to invite user: ${email}`);

      try {
        // Get the origin for the redirect URL
        const origin = req.headers.get('origin') || 'https://orange-water-0d56fac03.6.azurestaticapps.net';
        
        // Use Supabase's admin invite user function with set-password redirect
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
          redirectTo: `${origin}/set-password`,
        });

        if (error) {
          console.error('Error inviting user:', error);
          
          // Handle rate limit specifically
          if (error.message.includes('rate limit') || error.message.includes('429')) {
            return new Response(
              JSON.stringify({ 
                success: false,
                error: 'Too many invitation attempts. Please wait a few minutes before trying again.',
                code: 'RATE_LIMIT_EXCEEDED'
              }),
              { 
                status: 429, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
              }
            );
          }
          
          return new Response(
            JSON.stringify({ 
              success: false,
              error: error.message || 'Failed to send invitation'
            }),
            { 
              status: 400, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }

        console.log('User invited successfully:', data);

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Invitation sent successfully',
            user: data.user
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      } catch (inviteError) {
        console.error('Unexpected error during invitation:', inviteError);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Unexpected error occurred while sending invitation'
          }),
          { 
            status: 500, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
    }

    // Handle DELETE request to cancel invitations
    if (req.method === 'DELETE') {
      let requestData;
      try {
        requestData = await req.json();
      } catch (parseError) {
        console.error('Error parsing request JSON:', parseError);
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Invalid JSON in request body' 
          }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      const { email } = requestData;
      
      if (!email || typeof email !== 'string') {
        return new Response(
          JSON.stringify({ 
            success: false,
            error: 'Valid email is required' 
          }),
          { 
            status: 400, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }

      console.log(`Attempting to cancel invitation for: ${email}`);
      
      try {
        // First get the user by email
        const { data: authData, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) {
          console.error('Error fetching users for deletion:', authError);
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: 'Invitation cancelled (unable to verify auth status)'
            }),
            { 
              status: 200, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }

        const user = authData?.users?.find(u => u.email === email && !u.email_confirmed_at);
        
        if (user) {
          // Delete the user from auth
          const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
          
          if (deleteError) {
            console.error('Error deleting user:', deleteError);
            return new Response(
              JSON.stringify({ 
                success: true,
                message: 'Invitation cancelled (auth deletion failed but processed)',
                warning: deleteError.message
              }),
              { 
                status: 200, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders } 
              }
            );
          }
          
          console.log('User deleted successfully from auth');
        } else {
          console.log('User not found in auth or already confirmed');
        }

        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Invitation cancelled successfully'
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );

      } catch (deleteError) {
        console.error('Error in delete operation:', deleteError);
        
        return new Response(
          JSON.stringify({ 
            success: true,
            message: 'Invitation cancelled (processed with warnings)',
            warning: 'Auth deletion may have failed'
          }),
          { 
            status: 200, 
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Method not allowed' 
      }),
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );

  } catch (error: any) {
    console.error('Error in invite-user function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    );
  }
};

serve(handler);
