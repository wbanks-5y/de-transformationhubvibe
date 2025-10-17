import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useOrganization } from "@/context/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const OrganizationLogin = () => {
  const { organizationSlug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentOrganization, organizationClient } = useOrganization();
  
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verify we have an organization context
    if (!currentOrganization || !organizationClient) {
      toast.error("Organization not found", {
        description: "Please start from the beginning."
      });
      navigate("/");
      return;
    }

    // Verify the URL slug matches the current organization
    if (currentOrganization.slug !== organizationSlug) {
      toast.error("Organization mismatch");
      navigate("/");
      return;
    }
  }, [currentOrganization, organizationClient, organizationSlug, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!organizationClient) {
      toast.error("Organization not initialized");
      navigate("/");
      return;
    }

    setIsLoading(true);

    try {
      // Authenticate against the organization's specific database
      const { data, error } = await organizationClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error("Login failed", {
          description: error.message
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        toast.success(`Welcome to ${currentOrganization?.name}!`);
        // Navigation will be handled by auth state change
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("An error occurred", {
        description: "Please try again."
      });
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    navigate("/");
  };

  if (!currentOrganization) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBackToEmail}
          className="mb-2"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/bffb888e-1eed-499e-aa66-2045b6c73f93.png" 
            alt="Business Transformation Hub Logo" 
            className="h-16 w-auto"
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{currentOrganization.name}</h1>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              autoFocus={!email}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              autoFocus={!!email}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => navigate("/forgot-password")}
            className="text-sm text-muted-foreground"
          >
            Forgot password?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrganizationLogin;
