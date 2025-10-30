
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Construction } from "lucide-react";

const DevelopmentWatermark: React.FC = () => {
  return (
    <div className="fixed top-20 right-4 z-50 opacity-75 pointer-events-none">
      <Badge variant="outline" className="bg-yellow-50 border-yellow-300 text-yellow-800 px-3 py-2 shadow-lg">
        <Construction className="h-4 w-4 mr-2" />
        In Development - Functionality Available Soon
      </Badge>
    </div>
  );
};

export default DevelopmentWatermark;
