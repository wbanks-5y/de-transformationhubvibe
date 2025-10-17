
import React from "react";
import { Helmet } from "react-helmet";
import ApiKeyManagement from "@/components/admin/ApiKeyManagement";
import BackButton from "@/components/ui/back-button";

const ApiKeySettings: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <Helmet>
        <title>API Key Settings - Admin Dashboard</title>
      </Helmet>
      
      <BackButton />
      
      <h1 className="text-2xl font-bold mb-6">API Key Settings</h1>
      <p className="text-muted-foreground mb-6">
        Manage the OpenAI API key that is used by all users in the application.
        This key is stored securely and not accessible to regular users.
      </p>
      
      <div className="max-w-2xl">
        <ApiKeyManagement />
      </div>
    </div>
  );
};

export default ApiKeySettings;
