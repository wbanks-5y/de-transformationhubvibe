import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header provided" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify the JWT token from the authorization header
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Use the secure admin check function instead of custom logic
    const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin_secure');
    
    if (adminError || !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Unauthorized. Admin access required." }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Get the new API key from the request body
    const { key } = await req.json();
    if (!key || typeof key !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid or missing API key in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate API key format (OpenAI keys start with sk-)
    if (!key.startsWith('sk-') || key.length < 20) {
      return new Response(
        JSON.stringify({ error: "Invalid OpenAI API key format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Encrypt the API key before storing
    const encryptedKey = await supabase.rpc('encrypt_api_key', { api_key: key });
    
    if (!encryptedKey.data) {
      console.error("Failed to encrypt API key");
      return new Response(
        JSON.stringify({ error: "Failed to encrypt API key" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Store the encrypted API key using secure function
    const { data: updateResult, error: insertError } = await supabase.rpc('update_encrypted_api_key_secure', {
      p_key_name: 'openai_api_key',
      p_encrypted_value: encryptedKey.data,
      p_created_by: user.id
    });

    if (insertError) {
      console.error("Error storing API key:", insertError);
      return new Response(
        JSON.stringify({ error: "Failed to store API key securely" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Log the security event
    await supabase.rpc('log_security_event_enhanced', {
      p_action: 'api_key_updated',
      p_resource_type: 'openai_api_key',
      p_resource_id: 'openai_api_key',
      p_details: {
        updated_by: user.id,
        key_length: key.length
      },
      p_success: true,
      p_severity: 'info'
    });

    return new Response(
      JSON.stringify({ 
        message: "API key updated successfully",
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in update-openai-key function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});