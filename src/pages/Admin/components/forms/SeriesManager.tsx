
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ColorPicker from "@/components/ui/color-picker";
import { Trash2, Info } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SeriesConfig {
  id: string;
  name: string;
  color: string;
}

interface SeriesManagerProps {
  series: SeriesConfig[];
  allowMultiple: boolean;
  addSeries: () => void;
  removeSeries: (id: string) => void;
  updateSeries: (id: string, field: string, value: string) => void;
}

const SeriesManager: React.FC<SeriesManagerProps> = ({
  series,
  allowMultiple,
  addSeries,
  removeSeries,
  updateSeries,
}) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <Label className="font-semibold">
        Data Series
        <span className="ml-1" tabIndex={0} title="Each series represents a separate line/bar in the chart. You can add more series if multiple series is enabled.">
          <Info className="inline h-4 w-4 text-blue-500" aria-label="Info: Each series represents a separate line or bar in the chart." />
        </span>
      </Label>
      {allowMultiple && (
        <Button type="button" onClick={addSeries} variant="outline" size="sm">
          + Add Series
        </Button>
      )}
    </div>
    {series.map((s) => (
      <div key={s.id} className="flex items-center gap-2 mb-2">
        <Input
          value={s.name}
          onChange={(e) => updateSeries(s.id, "name", e.target.value)}
          placeholder="Series name"
          aria-label="Series name"
        />
        <ColorPicker value={s.color} onChange={(color) => updateSeries(s.id, "color", color)} />
        {allowMultiple && series.length > 1 && (
          <Button
            type="button"
            onClick={() => removeSeries(s.id)}
            variant="outline"
            size="sm"
            aria-label="Remove series"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ))}
  </div>
);

export default SeriesManager;

