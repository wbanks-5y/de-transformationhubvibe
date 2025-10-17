import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { managementClient } from "@/lib/supabase/management-client";
import { useOrganization } from "@/context/OrganizationContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import type { Organization } from "@/types/management";

const Index = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [showOrgSelector, setShowOrgSelector] = useState(false);
  const navigate = useNavigate();
  const { setOrganization } = useOrganization();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    setShowOrgSelector(false);
    setOrganizations([]);
    setSelectedOrgId("");

    try {
      // Query management database to find user's organizations
      // Use ilike for case-insensitive email matching
      const { data: userOrgs, error: userOrgError } = await managementClient
        .from('user_organizations')
        .select('organization_id')
        .ilike('email', email);

      if (userOrgError || !userOrgs || userOrgs.length === 0) {
        toast.error("Email not found", {
          description: "This email is not associated with any organization. Please contact your administrator."
        });
        setIsLoading(false);
        return;
      }

      // If user belongs to multiple organizations
      if (userOrgs.length > 1) {
        // Fetch all organization details
        const orgIds = userOrgs.map(uo => uo.organization_id);
        const { data: orgs, error: orgsError } = await managementClient
          .from('organizations')
          .select('*')
          .in('id', orgIds);

        if (orgsError || !orgs || orgs.length === 0) {
          toast.error("Organizations not found", {
            description: "Unable to load organization details. Please contact support."
          });
          setIsLoading(false);
          return;
        }

        // Show organization selector
        setOrganizations(orgs as Organization[]);
        setShowOrgSelector(true);
        setIsLoading(false);
        return;
      }

      // Single organization - auto-redirect (existing behavior)
      const { data: org, error: orgError } = await managementClient
        .from('organizations')
        .select('*')
        .eq('id', userOrgs[0].organization_id)
        .single();

      if (orgError || !org) {
        toast.error("Organization not found", {
          description: "Unable to load organization details. Please contact support."
        });
        setIsLoading(false);
        return;
      }

      // Set the organization context
      setOrganization(org as Organization);

      // Redirect to organization-specific login
      navigate(`/auth/${org.slug}`, { state: { email } });
    } catch (error: any) {
      console.error("Organization lookup error:", error);
      toast.error("An error occurred", {
        description: "Please try again or contact support."
      });
      setIsLoading(false);
    }
  };

  const handleOrganizationSelect = () => {
    if (!selectedOrgId) {
      toast.error("Please select an organization");
      return;
    }

    const selectedOrg = organizations.find(org => org.id === selectedOrgId);
    if (!selectedOrg) {
      toast.error("Invalid organization selected");
      return;
    }

    // Set the organization context
    setOrganization(selectedOrg);

    // Redirect to organization-specific login
    navigate(`/auth/${selectedOrg.slug}`, { state: { email } });
  };

  const handleBackToEmail = () => {
    setShowOrgSelector(false);
    setOrganizations([]);
    setSelectedOrgId("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg border">
        <div className="flex justify-center mb-6">
          <img 
            src="/lovable-uploads/bffb888e-1eed-499e-aa66-2045b6c73f93.png" 
            alt="Business Transformation Hub Logo" 
            className="h-16 w-auto"
          />
        </div>
        
        {!showOrgSelector ? (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-foreground">Welcome</h1>
              <p className="text-muted-foreground">Enter your email to access your organization</p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full"
                  autoFocus
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Finding your organization..." : "Continue"}
              </Button>
            </form>

            <p className="text-xs text-center text-muted-foreground">
              Don't have access? Contact your organization administrator.
            </p>
          </>
        ) : (
          <>
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-foreground">Hello!</h1>
              <p className="text-muted-foreground">
                We noticed you are a member of multiple organisations. Which one would you like?
              </p>
            </div>

            <div className="space-y-4">
              <Select value={selectedOrgId} onValueChange={setSelectedOrgId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an organization" />
                </SelectTrigger>
                <SelectContent>
                  {organizations.map((org) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={handleBackToEmail} 
                  className="flex-1"
                >
                  Back
                </Button>
                <Button 
                  onClick={handleOrganizationSelect} 
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Using {email}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
