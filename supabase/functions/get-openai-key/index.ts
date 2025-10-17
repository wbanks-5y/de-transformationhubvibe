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

    // Use the secure admin check function
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

    // Get the encrypted API key from database using secure function
    const { data: encryptedKey, error: keyError } = await supabase.rpc('get_encrypted_api_key_secure', {
      p_key_name: 'openai_api_key'
    });

    if (keyError || !encryptedKey) {
      // Fallback to environment variable for backward compatibility
      const envKey = Deno.env.get("OPENAI_API_KEY") ?? "";
      if (!envKey) {
        return new Response(
          JSON.stringify({ error: "OpenAI API key not configured" }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      // Return masked version of environment key
      const maskedKey = `${envKey.substring(0, 3)}...${envKey.substring(envKey.length - 4)}`;
      return new Response(
        JSON.stringify({ key: maskedKey }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Decrypt the key and return masked version
    const { data: decryptedKey, error: decryptError } = await supabase.rpc('decrypt_api_key', { 
      encrypted_key: encryptedKey 
    });
    
    if (decryptError || !decryptedKey) {
      return new Response(
        JSON.stringify({ error: "Failed to decrypt API key" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Return ONLY a masked version of the decrypted key - never the full key
    const maskedKey = `${decryptedKey.substring(0, 3)}...${decryptedKey.substring(decryptedKey.length - 4)}`;
    
    return new Response(
      JSON.stringify({ key: maskedKey }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in get-openai-key function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});