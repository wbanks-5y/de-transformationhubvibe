
import React from "react";
import { CockpitType } from "@/types/cockpit";
import InsightsManagement from "./InsightsManagement";
import CockpitSelectorBar from "./CockpitSelectorBar";

interface InsightsTabProps {
  cockpitTypes?: CockpitType[];
  selectedCockpit: string;
  selectedCockpitType?: CockpitType;
  onSelectedCockpitChange?: (value: string) => void;
}

const InsightsTab: React.FC<InsightsTabProps> = ({
  cockpitTypes,
  selectedCockpit,
  selectedCockpitType,
  onSelectedCockpitChange,
}) => {
  console.log('InsightsTab props:', {
    selectedCockpit,
    selectedCockpitType,
    selectedCockpitTypeId: selectedCockpitType?.id
  });

  return (
    <div className="space-y-6">
      <CockpitSelectorBar
        cockpitTypes={cockpitTypes}
        selectedCockpit={selectedCockpit}
        onSelectCockpit={onSelectedCockpitChange || (() => {})}
      />

      {!selectedCockpit || !selectedCockpitType ? (
        <div className="text-center py-8 text-gray-500">
          Select a cockpit to view insights
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-sm text-gray-600">
            Managing insights for: {selectedCockpitType.display_name}
          </div>
          <InsightsManagement
            cockpitTypeId={selectedCockpitType.id}
            cockpitDisplayName={selectedCockpitType.display_name}
          />
        </div>
      )}
    </div>
  );
};

export default InsightsTab;
