import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Key, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const ApiKeyManagement: React.FC = () => {
  const [openAiKey, setOpenAiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Fetch the current OpenAI API key
  const fetchApiKey = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      
      if (error) {
        throw error;
      }
      
      if (data && data.key) {
        // Only show the masked key
        const maskedKey = `${data.key.substring(0, 3)}...${data.key.substring(data.key.length - 4)}`;
        setOpenAiKey(maskedKey);
      }
    } catch (error) {
      // Don't log sensitive information to console in production
      toast.error("Failed to fetch the API key");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the OpenAI API key
  const updateApiKey = async (newKey: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-openai-key', { 
        body: { key: newKey } 
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("OpenAI API key has been updated securely");
      
      setIsEditing(false);
      fetchApiKey(); // Refresh the displayed key
    } catch (error: any) {
      // Don't log sensitive information to console in production
      toast.error(error?.message || "Failed to update the API key");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>OpenAI API Key Management</span>
          {!isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
            >
              <RefreshCw size={16} className="mr-2" />
              Update Key
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Enter a new OpenAI API key. It will be stored securely with encryption and used for all AI features."
            : "The OpenAI API key is encrypted and stored securely. Only masked previews are shown for security."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={openAiKey === `${openAiKey.substring(0, 3)}...${openAiKey.substring(openAiKey.length - 4)}` ? "" : openAiKey}
                onChange={(e) => setOpenAiKey(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => updateApiKey(openAiKey)}
                disabled={isLoading || !openAiKey || openAiKey.length < 10}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Key"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  fetchApiKey();
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-muted-foreground py-1">
            <Key size={18} className="mr-2 text-primary" />
            <span className="text-sm font-medium">
              {openAiKey ? `API Key: ${openAiKey}` : "No API key configured"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto"
              onClick={fetchApiKey}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyManagement;
