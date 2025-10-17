
import React from "react";
import CompactWelcomeMessage from "./CompactWelcomeMessage";

interface WelcomeMessageProps {
  onSendMessage: (message: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ onSendMessage }) => {
  return <CompactWelcomeMessage onSendMessage={onSendMessage} />;
};

export default WelcomeMessage;
