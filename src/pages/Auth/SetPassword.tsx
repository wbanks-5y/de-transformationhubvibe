import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useOrganization } from "@/context/OrganizationContext";

const SetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setOrganizationWithCredentials } = useOrganization();
  
  // Get parameters from URL
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const orgUrl = searchParams.get("orgUrl");
  const orgAnonKey = searchParams.get("orgAnonKey");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Validate invitation parameters on mount
  useEffect(() => {
    console.log("Validating invitation with params:", { token, email, orgUrl, orgAnonKey });
    
    if (!token || !email || !orgUrl || !orgAnonKey) {
      setError("Invalid invitation link. Please request a new invitation.");
      setIsValidating(false);
      return;
    }

    setIsValidating(false);
  }, [token, email, orgUrl, orgAnonKey]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (!token || !email || !orgUrl || !orgAnonKey) {
      setError("Missing required parameters");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Calling complete-invitation at:", orgUrl);

      const completeResponse = await fetch(
        `${orgUrl}/functions/v1/complete-invitation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${orgAnonKey}`,
            "apikey": orgAnonKey,
          },
          body: JSON.stringify({
            email: decodeURIComponent(email),
            password,
            invitationToken: token,
          }),
        }
      );

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.error || "Failed to complete invitation");
      }

      const completeData = await completeResponse.json();
      const urlObj = new URL(orgUrl);
      const orgSlug = urlObj.hostname.split('.')[0];

      await setOrganizationWithCredentials(
        {
          id: completeData.userId,
          name: orgSlug,
          slug: orgSlug,
          supabase_url: orgUrl,
          supabase_anon_key: orgAnonKey,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { 
          access_token: completeData.accessToken, 
          refresh_token: completeData.refreshToken 
        }
      );

      toast.success("Account setup complete! Welcome aboard!");
      navigate("/home");
    } catch (err: any) {
      console.error("Error completing invitation:", err);
      setError(err.message || "Failed to complete invitation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20">
        <Card className="w-full max-w-md">
          <div className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Validating Invitation...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Set Your Password</h1>
            <p className="text-muted-foreground">
              Complete your invitation by creating a password
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSetPassword}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input
                  type="email"
                  value={email ? decodeURIComponent(email) : ""}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  disabled={loading}
                  required
                  minLength={8}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading || !password || !confirmPassword}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting Password...
                  </>
                ) : (
                  "Set Password & Continue"
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default SetPassword;