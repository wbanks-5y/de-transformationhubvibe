import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StatusRequest {
  emailId: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log('resend-email-status: Request received', { method: req.method });

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY') || Deno.env.get('RESEND_API_KEY_V2');
    if (!resendApiKey) {
      console.error('resend-email-status: RESEND_API_KEY or RESEND_API_KEY_V2 not found');
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    let emailId: string;

    if (req.method === 'GET') {
      const url = new URL(req.url);
      emailId = url.searchParams.get('id') || '';
    } else if (req.method === 'POST') {
      const body: StatusRequest = await req.json();
      emailId = body.emailId;
    } else {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    if (!emailId) {
      return new Response(
        JSON.stringify({ error: 'emailId is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    console.log('resend-email-status: Fetching status for emailId:', emailId);

    const resendResponse = await fetch(`https://api.resend.com/emails/${emailId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const responseData = await resendResponse.json().catch(() => null);

    console.log('resend-email-status: Resend API response', {
      status: resendResponse.status,
      ok: resendResponse.ok,
      data: responseData
    });

    if (!resendResponse.ok) {
      return new Response(
        JSON.stringify({
          error: 'Failed to fetch email status from Resend',
          status: resendResponse.status,
          details: responseData
        }),
        { status: resendResponse.status, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        email: responseData
      }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );

  } catch (error: any) {
    console.error('resend-email-status: Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

serve(handler);
