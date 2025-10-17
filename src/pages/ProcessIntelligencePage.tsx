
import React, { useState, useEffect } from "react";
import { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent 
} from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProcessIntelligenceHeader from "@/components/process-mining/ProcessIntelligenceHeader";
import ProcessAnalysis from "@/components/process-mining/ProcessAnalysis";
import ProcessVisualizer from "@/components/process-mining/ProcessVisualizer";
import ProcessOptimization from "@/components/process-mining/ProcessOptimization";
import { useIsMobile } from "@/hooks/use-mobile";
import { useBusinessProcesses } from "@/hooks/useBusinessProcesses";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ProcessIntelligencePage = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [selectedProcess, setSelectedProcess] = useState("");
  const isMobile = useIsMobile();
  
  const { data: processes = [], isLoading, error } = useBusinessProcesses();

  // Set default process when data loads
  useEffect(() => {
    if (processes.length > 0 && !selectedProcess) {
      const defaultProcess = processes.find(p => p.name === "order-to-cash") || processes[0];
      setSelectedProcess(defaultProcess.name);
    }
  }, [processes, selectedProcess]);

  const handleProcessChange = (processName: string) => {
    setSelectedProcess(processName);
  };

  // Filter processes to ensure no empty names
  const validProcesses = processes.filter(process => process.name && process.name.trim() !== "");

  if (isLoading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <ProcessIntelligenceHeader />
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading processes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <ProcessIntelligenceHeader />
        <Alert className="mt-6">
          <AlertDescription>
            Error loading processes: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (validProcesses.length === 0) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
        <ProcessIntelligenceHeader />
        <div className="text-center mt-8">
          <p className="text-gray-600 mb-4">No processes found. Please contact your administrator to set up process data.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 ${isMobile ? 'pb-20' : ''}`}>
      <ProcessIntelligenceHeader />
      
      {/* Process selection dropdown moved here, above the tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold">Selected Process</h2>
          <p className="text-gray-600 text-sm">Choose a business process to analyze</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={selectedProcess} onValueChange={handleProcessChange}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Select process" />
            </SelectTrigger>
            <SelectContent>
              {validProcesses.map((process) => (
                <SelectItem key={process.name} value={process.name || `process-${process.id}`}>
                  {process.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="discover" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
        <div className="overflow-x-auto mb-8">
          <TabsList className="w-full md:w-auto inline-flex h-auto p-1">
            <TabsTrigger 
              value="discover" 
              className="px-2 py-2 text-xs sm:text-sm flex-1 whitespace-nowrap"
            >
              Process Discovery
            </TabsTrigger>
            <TabsTrigger 
              value="analyze" 
              className="px-2 py-2 text-xs sm:text-sm flex-1 whitespace-nowrap"
            >
              Process Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="optimize" 
              className="px-2 py-2 text-xs sm:text-sm flex-1 whitespace-nowrap"
            >
              Process Optimization
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="discover" className="p-2">
          <ProcessVisualizer 
            selectedProcess={selectedProcess}
            onProcessChange={handleProcessChange}
          />
        </TabsContent>
        
        <TabsContent value="analyze" className="p-2">
          <ProcessAnalysis selectedProcess={selectedProcess} />
        </TabsContent>
        
        <TabsContent value="optimize" className="p-2">
          <ProcessOptimization selectedProcess={selectedProcess} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProcessIntelligencePage;
