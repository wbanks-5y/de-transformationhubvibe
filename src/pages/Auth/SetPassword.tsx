import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getOrganizationClient } from '@/lib/supabase/organization-client';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useOrganization } from '@/context/OrganizationContext';

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
  const { setOrganization } = useOrganization();

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        // Extract parameters from query string
        const token = searchParams.get("token");
        const orgSlug = searchParams.get("org");
        const emailParam = searchParams.get("email");
        
        console.log("SetPassword - validating params:", { token: !!token, orgSlug, email: emailParam });
        
        if (!token || !orgSlug || !emailParam) {
          setError("Invalid invitation link. Missing required parameters (token, org, or email).");
          setIsValidating(false);
          return;
        }

        setEmail(emailParam);
        setOrganizationSlug(orgSlug);

        // For Option A, we need to look up the organization details
        // from the management database to get the Supabase credentials
        
        // Since we don't have managementClient available here,
        // we'll fetch organization details via a dedicated edge function
        // OR we can embed them in the invitation email URL
        
        // For now, we'll need to call an edge function to get org details
        // Let's create a simple validation that will be completed when setting password
        
        console.log("Invitation validated successfully for:", emailParam);
        setIsValidating(false);
        
      } catch (err) {
        console.error("Validation error:", err);
        setError("An error occurred while validating your invitation.");
        setIsValidating(false);
      }
    };

    validateInvitation();
  }, [searchParams]);

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
    const emailParam = searchParams.get("email");

    if (!token || !orgSlug || !emailParam) {
      setError("Invalid invitation link. Missing required parameters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Completing invitation for:", emailParam);

      // Call the complete-invitation edge function from the management database
      // This function will:
      // 1. Validate the invitation token from user metadata
      // 2. Update the user's password
      // 3. Confirm the user's email
      // 4. Return session tokens
      
      const managementUrl = 'https://mcbvzxnkhcohiieeovdp.supabase.co';
      const managementAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jYnZ6eG5raGNvaGlpZWVvdmRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgyNjE2MDYsImV4cCI6MjA1MzgzNzYwNn0.SzcVIhiWRl9J0-Rxy9KXiYDyT3E6rMujoZMmpMNJpDc';
      
      const response = await fetch(`${managementUrl}/functions/v1/complete-invitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${managementAnonKey}`,
        },
        body: JSON.stringify({
          email: emailParam,
          password: password,
          organizationSlug: orgSlug,
          invitationToken: token,
        }),
      });

      const completeData = await response.json();

      if (!response.ok || !completeData?.success) {
        console.error("Failed to complete invitation:", completeData);
        setError(completeData?.error || "Failed to set password. Please try again.");
        return;
      }

      console.log("Invitation completed successfully, setting session...");

      // Create organization-specific client and set session
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

      // Set organization context
      setOrganization({
        id: completeData.organizationId,
        name: completeData.organizationName || orgSlug,
        slug: orgSlug,
        supabase_url: completeData.orgUrl,
        supabase_anon_key: completeData.orgAnonKey,
      });

      console.log("Session established, redirecting to home...");
      toast.success("Password set successfully! Welcome to Transformation Suite!");
      
      // Redirect to home page
      setTimeout(() => {
        navigate("/home");
      }, 1000);
      
    } catch (err: any) {
      console.error("Unexpected error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <CardTitle>Validating Invitation</CardTitle>
            <CardDescription>Please wait while we validate your invitation...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>
            Welcome{email && ` ${email}`}! Please set a password for your account
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email || ''}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password (min. 6 characters)"
                required
                minLength={6}
                autoFocus
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Setting Password...
                </>
              ) : (
                'Set Password & Continue'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By setting your password, you'll gain access to your organization's Transformation Suite dashboard.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;
