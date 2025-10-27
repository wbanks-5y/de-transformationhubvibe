import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const VerifyInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"verifying" | "error" | "redirecting">("verifying");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const verifyAndRedirect = async () => {
      const token = searchParams.get("token");
      const orgSlug = searchParams.get("org");
      const email = searchParams.get("email");

      console.log("VerifyInvitation - params:", { token, orgSlug, email });

      if (!token || !orgSlug || !email) {
        setStatus("error");
        setError("Invalid invitation link. Missing required parameters (token, org, or email).");
        console.error("Missing params:", { token: !!token, orgSlug: !!orgSlug, email: !!email });
        return;
      }

      try {
        // With Option A, we no longer validate against invitation_tokens
        // The token is stored in the user's metadata and will be validated
        // when they set their password
        
        console.log("Invitation link verified, redirecting to password setup...");
        setStatus("redirecting");
        
        // Redirect to password setup with all parameters
        navigate(`/set-password?token=${token}&org=${orgSlug}&email=${email}`);

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
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
            >
              Go to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyInvitation;
