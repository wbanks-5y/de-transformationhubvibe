
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Starting deletion process for user: ${userId}`)

    // Create a service role client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    })

    // Get user info before deletion for cleanup
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId)
    const userEmail = userData?.user?.email

    console.log(`User email for cleanup: ${userEmail}`)

    // Delete from profiles table first (due to foreign key constraints)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (profileError) {
      console.warn('Error deleting profile:', profileError)
    }

    // Delete from user_roles table
    const { error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', userId)

    if (rolesError) {
      console.warn('Error deleting user roles:', rolesError)
    }

    // Delete any pending invitations by email
    if (userEmail) {
      const { error: invitationError } = await supabaseAdmin
        .from('user_invitations')
        .delete()
        .eq('email', userEmail)

      if (invitationError) {
        console.warn('Error deleting invitation:', invitationError)
      }
    }

    // Finally, delete the user from auth using service role
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      console.error('Auth deletion error:', authError)
      return new Response(
        JSON.stringify({ error: `Failed to delete user from auth: ${authError.message}` }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`User ${userId} deleted successfully`)

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Delete user error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
