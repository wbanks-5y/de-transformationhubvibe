
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AndroidSelect } from "@/components/ui/android-select";
import { CockpitType, CockpitSection } from "@/types/cockpit";
import { isAndroidWebView } from "@/utils/androidWebViewDetection";

interface CockpitSelectorBarProps {
  cockpitTypes?: CockpitType[];
  selectedCockpit: string;
  onSelectCockpit: (cockpitId: string) => void;
  sections?: CockpitSection[];
  selectedSection?: string;
  onSelectSection?: (sectionId: string) => void;
  showSectionSelector?: boolean;
}

const CockpitSelectorBar: React.FC<CockpitSelectorBarProps> = ({
  cockpitTypes,
  selectedCockpit,
  onSelectCockpit,
  sections,
  selectedSection,
  onSelectSection,
  showSectionSelector = false,
}) => {
  const selectedCockpitType = cockpitTypes?.find(c => c.id === selectedCockpit);
  const useAndroidSelect = isAndroidWebView();

  const cockpitOptions = cockpitTypes?.map(cockpit => ({
    value: cockpit.id,
    label: cockpit.display_name
  })) || [];

  const sectionOptions = sections?.map(section => ({
    value: section.id,
    label: section.display_name
  })) || [];

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg">
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-700">Cockpit:</label>
        {useAndroidSelect ? (
          <AndroidSelect
            value={selectedCockpit}
            onValueChange={onSelectCockpit}
            placeholder="Select a cockpit"
            options={cockpitOptions}
            className="w-[250px]"
          />
        ) : (
          <Select value={selectedCockpit} onValueChange={onSelectCockpit}>
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select a cockpit" />
            </SelectTrigger>
            <SelectContent>
              {cockpitTypes?.map((cockpit) => (
                <SelectItem key={cockpit.id} value={cockpit.id}>
                  {cockpit.display_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {showSectionSelector && sections && sections.length > 0 && onSelectSection && (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Section:</label>
          {useAndroidSelect ? (
            <AndroidSelect
              value={selectedSection || ""}
              onValueChange={onSelectSection}
              placeholder="Select a section"
              options={sectionOptions}
              className="w-[250px]"
            />
          ) : (
            <Select value={selectedSection || ""} onValueChange={onSelectSection}>
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {sections.map((section) => (
                  <SelectItem key={section.id} value={section.id}>
                    {section.display_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {selectedCockpitType && (
        <div className="ml-auto text-sm text-gray-500">
          {selectedCockpitType.display_name}
        </div>
      )}
    </div>
  );
};

export default CockpitSelectorBar;
