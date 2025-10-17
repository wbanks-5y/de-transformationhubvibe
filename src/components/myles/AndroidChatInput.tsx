
import React, { useState, useRef, useEffect } from "react";
import { Send, Loader2 } from "lucide-react";

interface AndroidChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const AndroidChatInput: React.FC<AndroidChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  console.log('AndroidChatInput render:', { messageLength: message.length, isLoading, isFocused });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const newHeight = Math.min(textareaRef.current.scrollHeight, 100);
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    console.log('Submitting message:', message.slice(0, 50) + '...');
    onSendMessage(message);
    setMessage("");
    
    // Blur the textarea to hide keyboard
    if (textareaRef.current) {
      textareaRef.current.blur();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFocus = () => {
    console.log('Input focused');
    setIsFocused(true);
  };

  const handleBlur = () => {
    console.log('Input blurred');
    setIsFocused(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent event bubbling that might interfere with touch handling
    e.stopPropagation();
  };

  // Simple inline styles for better WebAppView compatibility
  const containerStyle: React.CSSProperties = {
    padding: '12px 16px',
    backgroundColor: 'white',
    borderTop: '1px solid #e5e7eb',
    boxShadow: isFocused ? '0 -2px 8px rgba(0,0,0,0.1)' : 'none',
    transition: 'box-shadow 0.2s ease'
  };

  const formStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end'
  };

  const textareaStyle: React.CSSProperties = {
    flex: 1,
    minHeight: '40px',
    maxHeight: '100px',
    resize: 'none' as const,
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '10px 12px',
    fontSize: '16px', // Prevent zoom on iOS
    fontFamily: 'inherit',
    outline: 'none',
    overflowY: 'auto' as const,
    backgroundColor: 'white',
    transition: 'border-color 0.2s ease',
    borderColor: isFocused ? '#4f46e5' : '#d1d5db'
  };

  const buttonStyle: React.CSSProperties = {
    width: '44px',
    height: '44px',
    backgroundColor: isLoading || !message.trim() ? '#d1d5db' : '#4f46e5',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: isLoading || !message.trim() ? 'not-allowed' : 'pointer',
    flexShrink: 0,
    transition: 'background-color 0.2s ease',
    touchAction: 'manipulation'
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <textarea
          ref={textareaRef}
          placeholder="Ask me anything..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onTouchStart={handleTouchStart}
          style={textareaStyle}
          disabled={isLoading}
          rows={1}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="sentences"
          spellCheck="true"
        />
        <button 
          type="submit" 
          disabled={!message.trim() || isLoading}
          style={buttonStyle}
          onTouchStart={handleTouchStart}
        >
          {isLoading ? (
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Send size={18} />
          )}
        </button>
      </form>
    </div>
  );
};

export default AndroidChatInput;
