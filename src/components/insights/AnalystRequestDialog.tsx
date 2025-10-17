import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AnalystRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AnalystRequestDialog: React.FC<AnalystRequestDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const [question, setQuestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question for the analyst");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Your question has been sent to our analysts. Expect a response within 24 hours.");
      setQuestion("");
      setIsSubmitting(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ask an Analyst</DialogTitle>
          <DialogDescription>
            Submit your question to our industry analysts. Our team will provide expert insights based on your inquiry.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <label htmlFor="question" className="text-sm font-medium mb-2 block">
            What would you like to know?
          </label>
          <Textarea
            id="question"
            placeholder="E.g., How will recent tariff changes impact our supply chain? What trends should we monitor in our industry?"
            className="min-h-[120px]"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>Be specific for more targeted insights</span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-1"
          >
            {isSubmitting ? "Submitting..." : <>Submit Request <Send className="h-4 w-4" /></>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AnalystRequestDialog;
