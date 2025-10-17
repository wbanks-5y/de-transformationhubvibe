
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the event data from Supabase Auth
    const { type, email, new_email } = await req.json();
    console.log("Email request received:", { type, email, new_email });
    const targetEmail = email || new_email;

    let subject = "";
    let htmlContent = "";
    
    // Generate appropriate email content based on the event type
    switch (type) {
      case "signup":
        subject = "Welcome to 5Y Transformation Hub - Confirm Your Email";
        htmlContent = generateSignupEmail(req.url, targetEmail);
        break;
      case "magiclink":
        subject = "Your Magic Link for 5Y Transformation Hub";
        htmlContent = generateMagicLinkEmail(req.url, targetEmail);
        break;
      case "recovery":
        subject = "Reset Your 5Y Transformation Hub Password";
        htmlContent = generateRecoveryEmail(req.url, targetEmail);
        break;
      case "invite":
        subject = "You've Been Invited to 5Y Transformation Hub";
        htmlContent = generateInviteEmail(req.url, targetEmail);
        break;
      case "change_email":
        subject = "Confirm Your New Email for 5Y Transformation Hub";
        htmlContent = generateChangeEmailTemplate(req.url, targetEmail);
        break;
      default:
        console.error("Unsupported email type:", type);
        return new Response(
          JSON.stringify({ error: "Unsupported email type" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
    
    const response = {
      subject,
      html_content: htmlContent
    };
    
    console.log("Returning email template with subject:", subject);
    
    // Return the custom email template
    return new Response(
      JSON.stringify(response),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in custom-email-template function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
};

// Helper function to generate signup confirmation email
function generateSignupEmail(url: string, email: string): string {
  const origin = new URL(url).origin;
  
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Welcome to 5Y Transformation Hub</title>
    <style>
      body { 
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
      }
      .logo {
        max-height: 80px;
      }
      .container {
        padding: 20px;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: white !important;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 20px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://jyuxaifsevdwbjwldgbw.supabase.co/storage/v1/object/public/logos/5YLogo.png" alt="5Y Transformation Hub" class="logo">
    </div>
    <div class="container">
      <h1>Welcome to 5Y Transformation Hub!</h1>
      <p>Thank you for registering. Please confirm your email address to complete your registration and gain access to the platform.</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Address</a>
      </div>
      
      <p>If you didn't create an account with us, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} 5Y Technology. All rights reserved.</p>
      <p>This email was sent to ${email}</p>
    </div>
  </body>
  </html>
  `;
}

// Helper function to generate magic link email
function generateMagicLinkEmail(url: string, email: string): string {
  // Similar structure to signup email
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Your Magic Link</title>
    <style>
      body { 
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
      }
      .logo {
        max-height: 80px;
      }
      .container {
        padding: 20px;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 20px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://jyuxaifsevdwbjwldgbw.supabase.co/storage/v1/object/public/logos/5YLogo.png" alt="5Y Transformation Hub" class="logo">
    </div>
    <div class="container">
      <h1>Login to 5Y Transformation Hub</h1>
      <p>Click the button below to securely sign in to your account. This magic link will expire in 24 hours.</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Sign In</a>
      </div>
      
      <p>If you didn't request this email, you can safely ignore it.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} 5Y Technology. All rights reserved.</p>
      <p>This email was sent to ${email}</p>
    </div>
  </body>
  </html>
  `;
}

// Helper function for password recovery emails
function generateRecoveryEmail(url: string, email: string): string {
  // Similar structure to other emails
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Reset Your Password</title>
    <style>
      body { 
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
      }
      .logo {
        max-height: 80px;
      }
      .container {
        padding: 20px;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 20px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://jyuxaifsevdwbjwldgbw.supabase.co/storage/v1/object/public/logos/5YLogo.png" alt="5Y Transformation Hub" class="logo">
    </div>
    <div class="container">
      <h1>Reset Your Password</h1>
      <p>You recently requested to reset your password for the 5Y Transformation Hub. Click the button below to reset it.</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Reset Password</a>
      </div>
      
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} 5Y Technology. All rights reserved.</p>
      <p>This email was sent to ${email}</p>
    </div>
  </body>
  </html>
  `;
}

// Helper function for invitation emails
function generateInviteEmail(url: string, email: string): string {
  // Similar structure to other emails
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>You've Been Invited</title>
    <style>
      body { 
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
      }
      .logo {
        max-height: 80px;
      }
      .container {
        padding: 20px;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 20px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://jyuxaifsevdwbjwldgbw.supabase.co/storage/v1/object/public/logos/5YLogo.png" alt="5Y Transformation Hub" class="logo">
    </div>
    <div class="container">
      <h1>You've Been Invited to Join 5Y Transformation Hub</h1>
      <p>You've been invited to join the 5Y Transformation Hub platform. Click the button below to accept the invitation and set up your account.</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Accept Invitation</a>
      </div>
      
      <p>If you weren't expecting this invitation, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} 5Y Technology. All rights reserved.</p>
      <p>This email was sent to ${email}</p>
    </div>
  </body>
  </html>
  `;
}

// Helper function for email change confirmation
function generateChangeEmailTemplate(url: string, email: string): string {
  // Similar structure to other emails
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Confirm Email Change</title>
    <style>
      body { 
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 600px;
        margin: 0 auto;
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #eee;
      }
      .logo {
        max-height: 80px;
      }
      .container {
        padding: 20px;
      }
      .button {
        display: inline-block;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 4px;
        margin: 20px 0;
        font-weight: bold;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 20px;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <img src="https://jyuxaifsevdwbjwldgbw.supabase.co/storage/v1/object/public/logos/5YLogo.png" alt="5Y Transformation Hub" class="logo">
    </div>
    <div class="container">
      <h1>Confirm Your New Email</h1>
      <p>You recently requested to change your email address for the 5Y Transformation Hub. Click the button below to confirm your new email.</p>
      
      <div style="text-align: center;">
        <a href="{{ .ConfirmationURL }}" class="button">Confirm Email Change</a>
      </div>
      
      <p>If you didn't request this change, please contact support immediately.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} 5Y Technology. All rights reserved.</p>
      <p>This email was sent to ${email}</p>
    </div>
  </body>
  </html>
  `;
}

// Start the server
serve(handler);
