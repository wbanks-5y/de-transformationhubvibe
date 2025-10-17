import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Save, Edit, Key, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ApiKeyInputProps {
  apiKey: string;
  setApiKey: (key: string) => void;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ apiKey, setApiKey }) => {
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [maskedKey, setMaskedKey] = useState("");

  // Fetch the current API key securely
  const fetchApiKey = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-openai-key');
      
      if (error) {
        throw error;
      }
      
      if (data && data.key) {
        // Only show the masked key
        const masked = `${data.key.substring(0, 3)}...${data.key.substring(data.key.length - 4)}`;
        setMaskedKey(masked);
        setApiKey(data.key); // Update parent component
      }
    } catch (error) {
      toast.error("Failed to fetch the API key");
    } finally {
      setIsLoading(false);
    }
  };

  // Update the API key securely using edge function
  const handleSave = async () => {
    if (!inputKey || inputKey.length < 10) {
      toast.error("Please enter a valid API key");
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('update-openai-key', { 
        body: { key: inputKey } 
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("API key has been updated securely");
      setApiKey(inputKey);
      setIsEditing(false);
      setInputKey("");
      fetchApiKey(); // Refresh the displayed key
    } catch (error: any) {
      toast.error(error?.message || "Failed to update the API key");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowKey = () => {
    setShowKey(!showKey);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setInputKey("");
  };

  useEffect(() => {
    fetchApiKey();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>OpenAI API Key</span>
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchApiKey}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
              <span className="sr-only">Refresh</span>
            </Button>
          )}
        </CardTitle>
        <CardDescription>
          {isEditing
            ? "Enter your OpenAI API key. It will be stored securely with encryption."
            : "Your API key is encrypted and stored securely. Only masked previews are shown."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder="sk-..."
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleShowKey}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="flex space-x-2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !inputKey || inputKey.length < 10}
                size="sm"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} className="mr-2" />
                    Save
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditing(false);
                  setInputKey("");
                }} 
                disabled={isLoading}
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center text-muted-foreground py-1">
            <Key size={18} className="mr-2 text-primary" />
            <span className="text-sm font-medium">
              {maskedKey ? `API Key: ${maskedKey}` : "No API key configured"}
            </span>
            <Button onClick={handleEdit} variant="outline" size="sm" className="ml-auto">
              <Edit size={16} className="mr-2" />
              {maskedKey ? "Update" : "Add"} Key
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiKeyInput;