import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/context/OrganizationContext";
import { managementClient } from "@/lib/supabase/management-client";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [organizationSlug, setOrganizationSlug] = useState<string | null>(null);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setOrganization, updateOrganizationAuth } = useOrganization();

  // Use your app project (where edge functions are deployed)
  const appSupabase = useMemo(() => {
    const url = import.meta.env.VITE_SUPABASE_URL as string;
    const anon = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
    return createClient(url, anon);
  }, []);

  useEffect(() => {
    const validateInvitation = async () => {
      try {
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
        setInvitationToken(token);

        // Fetch organization details from management database
        const { data: orgData, error: orgError } = await managementClient
          .from("organizations")
          .select("*")
          .eq("slug", orgSlug)
          .single();

        if (orgError || !orgData) {
          console.error("Organization not found:", orgError);
          setError("Organization not found. Please contact support.");
          setIsValidating(false);
          return;
        }

        console.log("Organization found, invitation validated successfully");
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

    if (!invitationToken || !organizationSlug || !email) {
      setError("Invalid invitation link. Missing required parameters.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Completing invitation for:", email);

      // Get org display/meta from management DB
      const { data: orgData, error: orgError } = await managementClient
        .from("organizations")
        .select("*")
        .eq("slug", organizationSlug)
        .single();

      if (orgError || !orgData) {
        console.error("Organization not found:", orgError);
        setError("Organization not found. Please contact support.");
        return;
      }

      // Call the edge function on the target org's project (secure) using direct fetch
      // Ensure the URL has the https:// protocol (management DB stores URLs without it)
      const baseUrl = orgData.supabase_url.startsWith('http') 
        ? orgData.supabase_url 
        : `https://${orgData.supabase_url}`;
      const functionUrl = `${baseUrl}/functions/v1/complete-invitation`;
      console.log("Calling edge function at:", functionUrl);

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${orgData.supabase_anon_key}`,
          'apikey': orgData.supabase_anon_key,
        },
        body: JSON.stringify({
          email,
          password,
          organizationSlug,
          invitationToken,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Edge function error:", response.status, errorText);
        setError(`Failed to complete invitation: ${response.status} ${errorText}`);
        return;
      }

      const completeData = await response.json();
      const completeError = completeData.error ? { message: completeData.error } : null;

      if (completeError || !completeData?.success) {
        console.error("complete-invitation error:", completeError, completeData);
        const message =
          (completeError as any)?.message || completeData?.error || "Failed to validate invitation. Please try again.";
        setError(message);
        return;
      }

      // Set organization context (from management DB)
      setOrganization({
        id: orgData.id,
        name: orgData.name,
        slug: organizationSlug,
        supabase_url: completeData.orgUrl || orgData.supabase_url, // prefer function response
        supabase_anon_key: completeData.orgAnonKey || orgData.supabase_anon_key,
        created_at: orgData.created_at,
        updated_at: orgData.updated_at,
      });

      // Authenticate org client with the returned access token
      if (completeData.accessToken) {
        updateOrganizationAuth(completeData.accessToken);
      }

      console.log("Invitation completed, redirecting to home...");
      toast.success("Password set successfully! Welcome to Transformation Suite!");

      setTimeout(() => {
        navigate("/home");
      }, 800);
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
          <CardDescription>Welcome{email && ` ${email}`}! Please set a password for your account</CardDescription>
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
              <Input id="email" type="email" value={email || ""} disabled className="bg-gray-50" />
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
                "Set Password & Continue"
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
