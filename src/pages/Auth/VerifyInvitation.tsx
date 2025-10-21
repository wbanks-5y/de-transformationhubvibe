import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { managementClient } from "@/lib/supabase/management-client";
import { getOrganizationClient } from "@/lib/supabase/organization-client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const VerifyInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "error" | "redirecting">("verifying");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      const code = searchParams.get("code");
      const orgSlug = searchParams.get("org");

      if (!code || !orgSlug) {
        setStatus("error");
        setError("Invalid invitation link. Missing required parameters.");
        return;
      }

      try {
        // Step 1: Validate custom token with management DB
        console.log("Validating invitation token...");
        
        const { data: tokenData, error: tokenError } = await managementClient
          .from("invitation_tokens")
          .select("*")
          .eq("token", code)
          .is("used_at", null)
          .single();

        if (tokenError || !tokenData) {
          setStatus("error");
          setError("This invitation link is invalid or has already been used.");
          console.error("Token validation error:", tokenError);
          return;
        }

        // Check expiration
        if (new Date(tokenData.expires_at) < new Date()) {
          setStatus("error");
          setError("This invitation link has expired. Please request a new invitation.");
          return;
        }

        // Step 2: Mark token as used (prevents reuse, even from Safelinks pre-fetch)
        console.log("Marking token as used...");
        
        const { error: updateError } = await managementClient
          .from("invitation_tokens")
          .update({ used_at: new Date().toISOString() })
          .eq("token", code);

        if (updateError) {
          console.error("Failed to mark token as used:", updateError);
          // Continue anyway - token validation succeeded
        }

        // Step 3: Create org-specific Supabase client
        console.log("Creating organization-specific client...");
        
        const orgClient = getOrganizationClient(
          tokenData.organization_supabase_url,
          tokenData.organization_supabase_anon_key,
          orgSlug
        );

        // Step 4: Redirect directly to password setup page with token
        console.log("Redirecting to password setup page...");
        setStatus("redirecting");
        navigate(`/set-password?org=${orgSlug}&token=${code}`);

      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
        setError("An unexpected error occurred. Please try again or contact support.");
      }
    };

    verifyAndRedirect();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === "verifying" && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Invitation</h2>
            <p className="text-gray-600">Please wait while we verify your invitation...</p>
          </div>
        )}

        {status === "redirecting" && (
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Redirecting...</h2>
            <p className="text-gray-600">Taking you to the password setup page...</p>
          </div>
        )}

        {status === "error" && (
          <div>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyInvitation;
