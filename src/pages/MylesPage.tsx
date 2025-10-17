
import React, { useEffect } from "react";
import ChatContainer from "@/components/myles/ChatContainer";
import ChatInput from "@/components/myles/ChatInput";
import { useMylesChat } from "@/hooks/use-myles-chat";
import { Trash2, AlertTriangle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOptimizedUserApproval } from "@/hooks/auth/use-optimized-user-approval";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useDeviceDetection } from "@/hooks/use-device-detection";

const MylesPage: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useMylesChat();
  const { user } = useAuth();
  const { userStatus } = useOptimizedUserApproval();
  const { isMobile } = useDeviceDetection();

  // Reset chat at the beginning of each session
  useEffect(() => {
    clearMessages();
  }, [clearMessages]);

  return (
    <div className="myles-page">
      {/* Header alerts */}
      {(!user || userStatus === 'pending') && (
        <div className="myles-alerts">
          {!user && (
            <Alert className="alert-signin">
              <AlertDescription className="alert-content">
                <span className="alert-text">Sign in to save your chat history across sessions.</span>
                <Button asChild variant="outline" size="sm" className="alert-button">
                  <Link to="/">Sign In</Link>
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {user && userStatus === 'pending' && (
            <Alert className="alert-pending">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="alert-content">
                <span className="alert-text">Your account is pending approval. Some features may be limited.</span>
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
      
      {/* Main chat area */}
      <div className="myles-main">
        <div className="myles-container">
          <div className="myles-chat-area">
            {/* Clear chat button */}
            {messages.length > 0 && (
              <div className="myles-clear-chat">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearMessages}
                  className="clear-chat-button"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-xs">Clear chat</span>
                </Button>
              </div>
            )}
            
            {/* Messages container */}
            <ChatContainer 
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
          </div>
        </div>
      </div>

      {/* Fixed chat input */}
      <ChatInput 
        onSendMessage={sendMessage} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default MylesPage;
