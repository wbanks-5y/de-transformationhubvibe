import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders } from "../_shared/cors.ts";

interface RequestBody {
  email: string;
}

interface RateLimitRecord {
  email: string;
  attempts: number;
  window_start: string;
}

// Simple in-memory rate limiting (resets on function restart)
const rateLimitStore = new Map<string, RateLimitRecord>();
const MAX_ATTEMPTS = 5;
const WINDOW_MINUTES = 15;

function checkRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const normalizedEmail = email.toLowerCase().trim();
  const now = new Date();
  const record = rateLimitStore.get(normalizedEmail);

  if (!record) {
    rateLimitStore.set(normalizedEmail, {
      email: normalizedEmail,
      attempts: 1,
      window_start: now.toISOString(),
    });
    return { allowed: true };
  }

  const windowStart = new Date(record.window_start);
  const windowEnd = new Date(windowStart.getTime() + WINDOW_MINUTES * 60 * 1000);

  // If window expired, reset
  if (now > windowEnd) {
    rateLimitStore.set(normalizedEmail, {
      email: normalizedEmail,
      attempts: 1,
      window_start: now.toISOString(),
    });
    return { allowed: true };
  }

  // Within window - check attempts
  if (record.attempts >= MAX_ATTEMPTS) {
    const retryAfter = Math.ceil((windowEnd.getTime() - now.getTime()) / 1000);
    return { allowed: false, retryAfter };
  }

  // Increment attempts
  record.attempts += 1;
  rateLimitStore.set(normalizedEmail, record);
  return { allowed: true };
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const managementUrl = Deno.env.get("MANAGEMENT_SUPABASE_URL");
    const managementServiceKey = Deno.env.get("MANAGEMENT_SUPABASE_SERVICE_ROLE_KEY");

    if (!managementUrl || !managementServiceKey) {
      console.error("Missing management database configuration");
      return new Response(
        JSON.stringify({ error: "Service configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { email }: RequestBody = await req.json();

    // Validate email format
    if (!email || typeof email !== "string") {
      return new Response(
        JSON.stringify({ error: "Invalid email provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check rate limit
    const rateLimitResult = checkRateLimit(email);
    if (!rateLimitResult.allowed) {
      console.warn(`Rate limit exceeded for email: ${email}`);
      return new Response(
        JSON.stringify({ 
          error: "Too many requests. Please try again later.",
          retryAfter: rateLimitResult.retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json",
            "Retry-After": rateLimitResult.retryAfter?.toString() || "900"
          } 
        }
      );
    }

    // Create management client with service role key (bypasses RLS)
    const managementClient = createClient(managementUrl, managementServiceKey);

    // Query user_organizations with case-insensitive email match
    const { data: userOrgs, error: userOrgError } = await managementClient
      .from("user_organizations")
      .select("organization_id")
      .ilike("email", email);

    if (userOrgError) {
      console.error("Error querying user_organizations:", userOrgError);
      return new Response(
        JSON.stringify({ error: "Organization lookup failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generic response for security - don't reveal if email exists or not
    if (!userOrgs || userOrgs.length === 0) {
      console.log(`No organizations found for email: ${email}`);
      return new Response(
        JSON.stringify({ organizations: [] }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch organization details (only safe, non-sensitive fields)
    const orgIds = userOrgs.map((uo) => uo.organization_id);
    const { data: orgs, error: orgsError } = await managementClient
      .from("organizations")
      .select("id, name, slug")
      .in("id", orgIds);

    if (orgsError || !orgs || orgs.length === 0) {
      console.error("Error fetching organizations:", orgsError);
      return new Response(
        JSON.stringify({ error: "Failed to retrieve organization details" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully looked up ${orgs.length} organization(s) for email: ${email}`);

    // Return only non-sensitive organization data
    return new Response(
      JSON.stringify({ 
        organizations: orgs.map(org => ({
          id: org.id,
          name: org.name,
          slug: org.slug
        }))
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error in lookup-organization:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
