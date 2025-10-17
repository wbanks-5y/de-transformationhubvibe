
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Lightbulb, Brain } from "lucide-react";

interface GenerateInsightsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (replaceExisting: boolean) => void;
  existingInsightsCount: number;
  cockpitDisplayName: string;
  isLoading: boolean;
}

const GenerateInsightsDialog: React.FC<GenerateInsightsDialogProps> = ({
  open,
  onOpenChange,
  onConfirm,
  existingInsightsCount,
  cockpitDisplayName,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Generate AI Insights
          </DialogTitle>
          <DialogDescription>
            Generate comprehensive AI-powered insights for the {cockpitDisplayName} cockpit by analyzing all metrics, KPIs, and performance data.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {existingInsightsCount > 0 && (
            <div className="mb-4 p-3 border border-yellow-200 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium">Existing Insights Found</span>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                This cockpit has {existingInsightsCount} existing insight{existingInsightsCount !== 1 ? 's' : ''}. 
                How would you like to proceed?
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">What will be analyzed?</h4>
                  <ul className="text-sm text-blue-800 mt-2 space-y-1">
                    <li>• All cockpit sections and their metrics</li>
                    <li>• KPI performance and targets</li>
                    <li>• Data trends and patterns</li>
                    <li>• Performance indicators</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">AI Analysis Output</h4>
                  <ul className="text-sm text-green-800 mt-2 space-y-1">
                    <li>• Performance analysis and assessment</li>
                    <li>• Optimization opportunities</li>
                    <li>• Risk identification</li>
                    <li>• Actionable recommendations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          
          {existingInsightsCount > 0 && (
            <Button 
              variant="outline"
              onClick={() => onConfirm(false)}
              disabled={isLoading}
            >
              Keep & Add New
            </Button>
          )}
          
          <Button 
            onClick={() => onConfirm(existingInsightsCount > 0)}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? (
              <>
                <Brain className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                {existingInsightsCount > 0 ? 'Replace All' : 'Generate Insights'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateInsightsDialog;
