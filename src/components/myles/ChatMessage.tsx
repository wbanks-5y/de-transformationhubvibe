
import React, { useState } from "react";
import { Message } from "@/hooks/use-myles-chat";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import TypewriterText from "./TypewriterText";
import { useIsMobile } from "@/hooks/use-mobile";
import { isAndroidWebView } from "@/utils/androidWebViewDetection";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const [typewriterComplete, setTypewriterComplete] = useState(isUser);
  const isMobile = useIsMobile();
  const isAndroid = isAndroidWebView();
  
  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  // Use simpler styling for Android WebView
  const messageContainerStyle = isAndroid ? {
    display: 'flex',
    gap: isMobile ? '0.5rem' : '0.75rem',
    marginBottom: isMobile ? '1rem' : '1.5rem',
    justifyContent: isUser ? 'flex-end' : 'flex-start'
  } : {};

  const cardStyle = isAndroid ? {
    backgroundColor: isUser ? '#4f46e5' : '#f3f4f6',
    color: isUser ? 'white' : 'inherit',
    borderRadius: '0.5rem',
    overflow: 'hidden',
    width: '100%',
    border: 'none',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
  } : {};

  return (
    <div 
      className={`flex gap-${isMobile ? '2' : '3'} mb-${isMobile ? '4' : '6'} ${isUser ? 'justify-end' : 'justify-start'}`}
      style={isAndroid ? messageContainerStyle : {}}
    >
      {!isUser && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}>
            <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs font-medium">
              M
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <div className={`${isMobile ? 'max-w-[90%]' : 'max-w-[85%] sm:max-w-[75%]'} flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <Card 
          className={`${isUser ? 'bg-primary text-primary-foreground' : 'bg-muted border-0 shadow-sm'} overflow-hidden w-full`}
          style={isAndroid ? cardStyle : {}}
        >
          <CardContent 
            className={`${isMobile ? 'p-3' : 'p-4'} overflow-hidden`}
            style={isAndroid ? { padding: isMobile ? '0.75rem' : '1rem', overflow: 'hidden' } : {}}
          >
            {isUser ? (
              <p 
                className={`${isMobile ? 'text-sm' : 'text-sm'} whitespace-pre-wrap break-words leading-relaxed`}
                style={isAndroid ? { fontSize: isMobile ? '0.875rem' : '0.875rem', lineHeight: '1.625' } : {}}
              >
                {message.content}
              </p>
            ) : (
              <div 
                className={`${isMobile ? 'text-sm' : 'text-sm'} prose dark:prose-invert max-w-none break-words prose-p:leading-relaxed prose-p:mb-3 prose-ul:mb-3 prose-ol:mb-3 prose-li:mb-1`}
                style={isAndroid ? { fontSize: isMobile ? '0.875rem' : '0.875rem' } : {}}
              >
                <TypewriterText 
                  text={message.content} 
                  speed={15} 
                  onComplete={() => setTypewriterComplete(true)}
                  renderAsMarkdown={true}
                />
              </div>
            )}
          </CardContent>
        </Card>
        <div className={`flex items-center gap-${isMobile ? '1.5' : '2'} mt-1.5 px-1 w-full ${isUser ? 'justify-end' : 'justify-start'} ${!isUser && !typewriterComplete ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}>
          <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>{formattedTime}</span>
          {!isUser && message.module && (
            <Badge variant="outline" className={`${isMobile ? 'text-xs py-0 px-1 h-4' : 'text-xs py-0 px-1.5 h-5'}`}>
              {message.module}
            </Badge>
          )}
          {!isUser && message.responseTime && (
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
              {Math.round(message.responseTime / 1000)}s
            </span>
          )}
        </div>
      </div>
      {isUser && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}>
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
              You
            </AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
