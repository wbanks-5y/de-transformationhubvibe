import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  email: string;
  full_name: string;
  status: 'approved' | 'rejected';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, full_name, status }: EmailRequest = await req.json();

    console.log(`Processing email for ${email} with status: ${status}`);

    let subject: string;
    let htmlContent: string;
    const appUrl = Deno.env.get("SUPABASE_URL")?.replace("supabase.co", "lovable.app") || "https://gvrxydwedhppmvppqwwm.lovable.app";

    if (status === 'approved') {
      // Approval email with login link
      subject = "Your Transform Hub Account Has Been Approved!";
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
              .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Account Approved!</h1>
              </div>
              <div class="content">
                <h2>Great news, ${full_name || 'there'}!</h2>
                <p>Your Transform Hub account has been approved by an administrator. You now have full access to the platform.</p>
                <div style="text-align: center;">
                  <a href="${appUrl}/login" class="button">Login to Your Account</a>
                </div>
                <p><strong>What you can do now:</strong></p>
                <ul>
                  <li>Access all cockpit dashboards</li>
                  <li>View real-time KPIs and metrics</li>
                  <li>Collaborate with your team</li>
                  <li>Generate insights and reports</li>
                </ul>
                <p style="margin-top: 30px;">If you have any questions, please don't hesitate to reach out to your administrator.</p>
              </div>
              <div class="footer">
                <p>© 2025 Transform Hub. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    } else {
      // Rejection email
      subject = "Update on Your Transform Hub Account";
      htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
              .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Transform Hub Account Update</h1>
              </div>
              <div class="content">
                <h2>Hi ${full_name || 'there'},</h2>
                <p>Thank you for your interest in Transform Hub. After review, we're unable to approve your account at this time.</p>
                <p>If you believe this is an error or would like more information, please contact your administrator or reply to this email.</p>
                <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; color: #666;">
                  We appreciate your understanding.
                </p>
              </div>
              <div class="footer">
                <p>© 2025 Transform Hub. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Transform Hub <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      html: htmlContent,
    });

    console.log(`Email sent successfully to ${email}:`, emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: `${status} email sent successfully`,
      data: emailResponse 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-approval-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
