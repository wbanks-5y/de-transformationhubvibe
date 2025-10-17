
import React from "react";
import BackButton from "@/components/ui/back-button";

interface CockpitHeaderProps {
  displayName: string;
  description?: string;
  cockpitDescription?: string;
}

const CockpitHeader: React.FC<CockpitHeaderProps> = ({ 
  displayName, 
  description, 
  cockpitDescription 
}) => {
  return (
    <>
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{displayName}</h1>
        {description && (
          <p className="text-gray-500 mt-2">{description}</p>
        )}
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-700">
          {displayName} {cockpitDescription || 'provides real-time operational metrics and analytics for day-to-day decision making. Unlike the Health dashboards which focus on strategic indicators and long-term trends, this cockpit gives you immediate visibility into current operations and performance.'}
        </p>
      </div>
    </>
  );
};

export default CockpitHeader;
