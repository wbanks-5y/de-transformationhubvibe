import React from "react";
import { Helmet } from "react-helmet";
import BackButton from "@/components/ui/back-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const ApiKeySettings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>API Key Settings - Admin Dashboard</title>
      </Helmet>
      
      <BackButton />
      
      <h1 className="text-2xl font-bold mb-6">API Key Settings</h1>
      
      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              External API Key Management
            </CardTitle>
            <CardDescription>
              API keys for this application are managed externally
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              OpenAI API keys and other service credentials are managed through the external user management application. 
              Please access the user management portal to view or update API keys.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              This ensures centralized key management and enhanced security across all applications in the system.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiKeySettings;
