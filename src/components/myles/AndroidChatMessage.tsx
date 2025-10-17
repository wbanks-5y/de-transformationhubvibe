
import React from "react";
import { Message } from "@/hooks/use-myles-chat";
import ChartParser from "./ChartParser";

interface AndroidChatMessageProps {
  message: Message;
}

const AndroidChatMessage: React.FC<AndroidChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  // Format the timestamp
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  // Check if the message contains chart markers
  const hasChartMarkers = message.content.includes('[CHART:');

  // Simple inline styles for better WebAppView compatibility
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    justifyContent: isUser ? 'flex-end' : 'flex-start',
    maxWidth: '100%'
  };

  const avatarStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '14px',
    backgroundColor: isUser ? '#4f46e5' : '#f3f4f6',
    color: isUser ? 'white' : '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '600',
    flexShrink: 0,
    marginTop: '2px'
  };

  const messageContainerStyle: React.CSSProperties = {
    maxWidth: '80%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: isUser ? 'flex-end' : 'flex-start',
    minWidth: 0 // Allow shrinking
  };

  const messageStyle: React.CSSProperties = {
    backgroundColor: isUser ? '#4f46e5' : '#f8f9fa',
    color: isUser ? 'white' : '#1f2937',
    padding: '12px 16px',
    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
    fontSize: '15px',
    lineHeight: '1.4',
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    width: 'fit-content',
    maxWidth: '100%',
    minWidth: 0,
    whiteSpace: 'pre-wrap',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  };

  const timestampStyle: React.CSSProperties = {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '4px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    flexWrap: 'wrap'
  };

  const moduleStyle: React.CSSProperties = {
    backgroundColor: '#e5e7eb',
    color: '#6b7280',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: '500'
  };

  return (
    <div style={containerStyle}>
      {!isUser && (
        <div style={avatarStyle}>
          M
        </div>
      )}
      <div style={messageContainerStyle}>
        <div style={messageStyle}>
          {hasChartMarkers ? (
            <ChartParser content={message.content} />
          ) : (
            message.content
          )}
        </div>
        <div style={timestampStyle}>
          <span>{formattedTime}</span>
          {!isUser && message.module && (
            <span style={moduleStyle}>
              {message.module}
            </span>
          )}
          {!isUser && message.responseTime && (
            <span>{Math.round(message.responseTime / 1000)}s</span>
          )}
        </div>
      </div>
      {isUser && (
        <div style={avatarStyle}>
          You
        </div>
      )}
    </div>
  );
};

export default AndroidChatMessage;
