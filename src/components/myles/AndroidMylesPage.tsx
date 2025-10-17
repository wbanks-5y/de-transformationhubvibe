
import React, { useRef, useEffect, useState } from "react";
import AndroidChatMessage from "./AndroidChatMessage";
import AndroidChatInput from "./AndroidChatInput";
import WelcomeMessage from "./WelcomeMessage";
import { useMylesChat } from "@/hooks/use-myles-chat";
import { Loader2, Trash2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AndroidMylesPage: React.FC = () => {
  const { messages, isLoading, sendMessage, clearMessages } = useMylesChat();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

  console.log('AndroidMylesPage rendered with', messages.length, 'messages');

  // Reset chat at the beginning of each session
  useEffect(() => {
    clearMessages();
  }, []);

  // Handle viewport changes for virtual keyboard
  useEffect(() => {
    const handleResize = () => {
      const newHeight = window.innerHeight;
      const heightDiff = viewportHeight - newHeight;
      
      console.log('Viewport change:', { viewportHeight, newHeight, heightDiff });
      
      if (heightDiff > 150) {
        // Keyboard likely opened
        setKeyboardHeight(heightDiff);
      } else {
        // Keyboard likely closed
        setKeyboardHeight(0);
      }
      setViewportHeight(newHeight);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [viewportHeight]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages, keyboardHeight]);

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesContainerRef.current) {
      console.log('Scrolling to bottom');
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "auto", block: "end" });
      }, 100);
    }
  };

  // Calculate dynamic heights
  const headerHeight = 60;
  const inputHeight = 80;
  const bottomNavHeight = 64;
  const availableHeight = viewportHeight - headerHeight - inputHeight - bottomNavHeight - keyboardHeight;

  // Simple inline styles for better WebAppView compatibility
  const containerStyle: React.CSSProperties = {
    height: `${viewportHeight}px`,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'white',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1
  };

  const headerStyle: React.CSSProperties = {
    height: `${headerHeight}px`,
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexShrink: 0
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    margin: 0
  };

  const clearButtonStyle: React.CSSProperties = {
    padding: '6px 12px',
    backgroundColor: 'transparent',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    color: '#6b7280',
    fontSize: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  };

  const messagesContainerStyle: React.CSSProperties = {
    height: `${availableHeight}px`,
    overflowY: 'auto' as const,
    overflowX: 'hidden',
    padding: '16px',
    flexShrink: 0,
    WebkitOverflowScrolling: 'touch'
  };

  const inputContainerStyle: React.CSSProperties = {
    height: `${inputHeight}px`,
    flexShrink: 0,
    position: 'relative',
    bottom: keyboardHeight > 0 ? `${keyboardHeight - bottomNavHeight}px` : '0px',
    transition: 'bottom 0.3s ease'
  };

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '16px'
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div style={titleStyle}>Myles</div>
        {messages.length > 0 && (
          <button style={clearButtonStyle} onClick={clearMessages}>
            <Trash2 size={12} />
            Clear
          </button>
        )}
      </div>
      
      <div style={messagesContainerStyle} ref={messagesContainerRef}>
        {messages.length === 0 ? (
          <WelcomeMessage onSendMessage={sendMessage} />
        ) : (
          <div>
            {messages.map((message) => (
              <AndroidChatMessage key={message.id} message={message} />
            ))}
            {isLoading && (
              <div style={loadingStyle}>
                <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', color: '#4f46e5' }} />
              </div>
            )}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div style={inputContainerStyle}>
        <AndroidChatInput 
          onSendMessage={sendMessage} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default AndroidMylesPage;
