import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RateLimitRequest {
  action: string;
  identifier?: string;
  maxAttempts?: number;
  windowMinutes?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get user from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const jwt = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, identifier, maxAttempts = 5, windowMinutes = 15 }: RateLimitRequest = await req.json()

    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Action is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const rateIdentifier = identifier || user.id
    const windowStart = new Date(Date.now() - (windowMinutes * 60 * 1000))

    // Check current attempts in the time window
    const { data: attempts, error: fetchError } = await supabase
      .from('rate_limit_attempts')
      .select('*')
      .eq('identifier', rateIdentifier)
      .eq('action', action)
      .gte('created_at', windowStart.toISOString())

    if (fetchError) {
      console.error('Rate limit check error:', fetchError)
      return new Response(
        JSON.stringify({ error: 'Rate limit check failed' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const currentAttempts = attempts?.length || 0

    if (currentAttempts >= maxAttempts) {
      // Log the rate limit violation
      await supabase.rpc('log_security_event_enhanced', {
        p_action: 'rate_limit_exceeded',
        p_resource_type: 'rate_limiting',
        p_resource_id: action,
        p_details: {
          identifier: rateIdentifier,
          action,
          attempts: currentAttempts,
          max_attempts: maxAttempts,
          window_minutes: windowMinutes
        },
        p_success: false,
        p_severity: 'warning'
      })

      return new Response(
        JSON.stringify({ 
          allowed: false, 
          error: 'Rate limit exceeded', 
          retryAfter: windowMinutes * 60,
          attempts: currentAttempts,
          maxAttempts
        }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Record the attempt
    const { error: insertError } = await supabase
      .from('rate_limit_attempts')
      .insert({
        identifier: rateIdentifier,
        action,
        user_id: user.id,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      })

    if (insertError) {
      console.error('Rate limit recording error:', insertError)
    }

    return new Response(
      JSON.stringify({ 
        allowed: true, 
        attempts: currentAttempts + 1,
        maxAttempts,
        remaining: maxAttempts - (currentAttempts + 1)
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Rate limit function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})