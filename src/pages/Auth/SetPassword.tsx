
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { managementClient } from '@/lib/supabase/management-client';
import { getOrganizationClient } from '@/lib/supabase/organization-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [organizationSlug, setOrganizationSlug] = useState<string | null>(null);
  const [orgClient, setOrgClient] = useState<SupabaseClient<Database> | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        // Extract token and organization slug from query params
        const token = searchParams.get("token");
        const orgSlug = searchParams.get("org");
        
        if (!token || !orgSlug) {
          setError("Invalid invitation link. Missing required parameters.");
          setIsValidating(false);
          return;
        }

        console.log("Validating invitation token for organization:", orgSlug);
        setOrganizationSlug(orgSlug);

        // Validate token against management database
        const { data: tokenData, error: tokenError } = await managementClient
          .from("invitation_tokens")
          .select("*")
          .eq("token", token)
          .is("used_at", null)
          .single();

        if (tokenError || !tokenData) {
          console.error("Token validation failed:", tokenError);
          setError("Invalid or expired invitation link. Please request a new invitation.");
          setIsValidating(false);
          return;
        }

        // Check token expiration
        if (new Date(tokenData.expires_at) < new Date()) {
          setError("This invitation link has expired. Please request a new invitation.");
          setIsValidating(false);
          return;
        }

        console.log("Token validated successfully");
        setEmail(tokenData.email);

        // Create organization-specific client for later use
        const orgClient = getOrganizationClient(
          tokenData.organization_supabase_url,
          tokenData.organization_supabase_anon_key,
          orgSlug
        );

        setOrgClient(orgClient);
        setIsValidating(false);
      } catch (error) {
        console.error("Validation error:", error);
        setError("An error occurred while validating your invitation.");
        setIsValidating(false);
      }
    };

    validateInvitation();
  }, [searchParams, navigate]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    const token = searchParams.get("token");
    const orgSlug = searchParams.get("org");

    if (!token || !orgSlug) {
      setError("Invalid invitation link");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Completing invitation via edge function...");

      // Call complete-invitation edge function
      const { data: completeData, error: completeError } = await managementClient.functions.invoke(
        "complete-invitation",
        {
          body: {
            email: email,
            password: password,
            organizationSlug: orgSlug,
            invitationToken: token,
          },
        }
      );

      if (completeError || !completeData?.success) {
        console.error("Failed to complete invitation:", completeError || completeData);
        setError(completeData?.error || "Failed to set password. Please try again.");
        return;
      }

      console.log("Invitation completed successfully, setting session...");

      // Create organization client and set session
      const orgClient = getOrganizationClient(
        completeData.orgUrl,
        completeData.orgAnonKey,
        orgSlug
      );

      const { error: sessionError } = await orgClient.auth.setSession({
        access_token: completeData.accessToken,
        refresh_token: completeData.refreshToken,
      });

      if (sessionError) {
        console.error("Session error:", sessionError);
        setError("Failed to establish session. Please try logging in.");
        return;
      }

      console.log("Session established, redirecting to home...");
      toast.success("Password set successfully! Redirecting to your dashboard...");
      
      // Redirect to home page
      navigate("/home");
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Validating Invitation</CardTitle>
            <CardDescription>Please wait while we validate your invitation...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>
            Welcome! Please set a password for your account{email && `: ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting Password...' : 'Set Password'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {organizationSlug 
                ? "After setting your password, you'll be redirected to your organization's login page."
                : "After setting your password, you'll be redirected to the welcome page where you can enter your email to access your organization."}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;
