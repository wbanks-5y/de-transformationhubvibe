
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users } from "lucide-react";

interface CompactWelcomeMessageProps {
  onSendMessage: (message: string) => void;
}

const CompactWelcomeMessage: React.FC<CompactWelcomeMessageProps> = ({ onSendMessage }) => {
  const suggestedQuestions = [
    {
      question: "How's our sales performance this quarter?",
      icon: TrendingUp,
      category: "Sales"
    },
    {
      question: "What bottlenecks should I be worried about?",
      icon: BarChart3,
      category: "Process Intelligence"
    },
    {
      question: "Show me warehouse efficiency trends",
      icon: Users,
      category: "Operations"
    }
  ];

  return (
    <div className="welcome-container">
      <div className="welcome-header">
        <div className="welcome-logo">
          <img 
            src="/lovable-uploads/1b7781b7-2118-4bf9-b92a-0dc0d3877a1e.png" 
            alt="Myles Logo" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Hi! I'm Myles</h1>
        <p className="text-sm text-gray-600 mb-4">
          Ask me anything about your business performance!
        </p>
      </div>

      <div className="welcome-suggestions">
        {suggestedQuestions.map((item, index) => (
          <Card key={index} className="suggestion-card">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2">
                <item.icon className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-indigo-600 mb-1">
                    {item.category}
                  </p>
                  <Button
                    variant="ghost"
                    className="text-left p-0 h-auto font-normal text-gray-700 hover:text-gray-900 text-sm leading-tight whitespace-normal"
                    onClick={() => onSendMessage(item.question)}
                  >
                    {item.question}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-xs text-gray-500 text-center mt-3">
        Ask me about your cockpits, KPIs, trends, or any business question!
      </p>
    </div>
  );
};

export default CompactWelcomeMessage;
