
import React from "react";
import NewTimeRangeSelector from "./NewTimeRangeSelector";

interface TimeRangeOption {
  value: string;
  label: string;
}

interface TimeRangeSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: TimeRangeOption[];
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = (props) => {
  return <NewTimeRangeSelector {...props} />;
};

export default TimeRangeSelector;
