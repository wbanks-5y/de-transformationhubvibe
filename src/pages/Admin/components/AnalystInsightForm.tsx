
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { useAnalystInsights } from "@/hooks/useAnalystInsights";
import { useCreateAnalystInsight, useUpdateAnalystInsight, CreateAnalystInsightData } from "@/hooks/useAnalystInsightsAdmin";
import { useAnalystInsightCategories } from "@/hooks/useAnalystInsightCategories";
import { useCreateAnalystInsightCategory } from "@/hooks/useAnalystInsightCategoriesAdmin";

interface AnalystInsightFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  insightId?: string | null;
}

const icons = [
  'TrendingUp',
  'TrendingDown', 
  'Globe',
  'Users',
  'Briefcase',
  'AlertTriangle',
  'BarChart',
  'DollarSign',
  'FlagTriangleRight',
  'FilePlus',
  'ChartBar',
  'Layers'
];

const AnalystInsightForm: React.FC<AnalystInsightFormProps> = ({
  open,
  onOpenChange,
  insightId
}) => {
  const { data: insights = [] } = useAnalystInsights();
  const { data: categories = [] } = useAnalystInsightCategories();
  const createInsight = useCreateAnalystInsight();
  const updateInsight = useUpdateAnalystInsight();
  const createCategory = useCreateAnalystInsightCategory();
  
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDisplayName, setNewCategoryDisplayName] = useState("");
  
  const isEdit = !!insightId;
  const editingInsight = insights.find(insight => insight.id === insightId);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CreateAnalystInsightData>();

  const watchedCategory = watch('category');
  const watchedImpact = watch('impact');
  const watchedIconName = watch('icon_name');

  useEffect(() => {
    if (isEdit && editingInsight) {
      setValue('title', editingInsight.title);
      setValue('description', editingInsight.description);
      setValue('category', editingInsight.category);
      setValue('impact', editingInsight.impact);
      setValue('source', editingInsight.source || '');
      setValue('timestamp_text', editingInsight.timestamp_text);
      setValue('icon_name', editingInsight.icon_name || '');
      setValue('external_url', editingInsight.external_url || '');
    } else {
      reset();
    }
  }, [isEdit, editingInsight, setValue, reset]);

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim() || !newCategoryDisplayName.trim()) return;
    
    await createCategory.mutateAsync({
      name: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
      display_name: newCategoryDisplayName,
      description: `${newCategoryDisplayName} category`,
      sort_order: categories.length
    });
    
    setValue('category', newCategoryDisplayName);
    setNewCategoryName("");
    setNewCategoryDisplayName("");
    setShowNewCategory(false);
  };

  const onSubmit = (data: CreateAnalystInsightData) => {
    const payload = {
      ...data,
      source: data.source || null,
      icon_name: data.icon_name || null,
      external_url: data.external_url || null,
    };

    if (isEdit && insightId) {
      updateInsight.mutate({ id: insightId, data: payload }, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        }
      });
    } else {
      createInsight.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
          reset();
        }
      });
    }
  };

  const availableCategories = categories.map(cat => cat.display_name);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Analyst Insight' : 'Create New Analyst Insight'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                {...register('title', { required: 'Title is required' })}
                placeholder="Enter insight title"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <div className="flex gap-2">
                <Select
                  value={watchedCategory}
                  onValueChange={(value) => setValue('category', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewCategory(!showNewCategory)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {errors.category && (
                <p className="text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {showNewCategory && (
            <div className="p-4 border rounded-lg bg-gray-50 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Create New Category</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewCategory(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Display Name</Label>
                  <Input
                    value={newCategoryDisplayName}
                    onChange={(e) => setNewCategoryDisplayName(e.target.value)}
                    placeholder="e.g., Market Trends"
                    className="text-sm"
                  />
                </div>
                <div>
                  <Label className="text-xs">URL Key</Label>
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="e.g., market-trends"
                    className="text-sm"
                  />
                </div>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={handleCreateCategory}
                disabled={!newCategoryName.trim() || !newCategoryDisplayName.trim() || createCategory.isPending}
              >
                Create Category
              </Button>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Enter detailed insight description"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="impact">Impact *</Label>
              <Select
                value={watchedImpact}
                onValueChange={(value) => setValue('impact', value as 'positive' | 'negative' | 'neutral')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select impact" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="positive">Positive</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
              {errors.impact && (
                <p className="text-sm text-red-600">{errors.impact.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timestamp_text">Time *</Label>
              <Input
                id="timestamp_text"
                {...register('timestamp_text', { required: 'Timestamp is required' })}
                placeholder="e.g., 2 hours ago"
              />
              {errors.timestamp_text && (
                <p className="text-sm text-red-600">{errors.timestamp_text.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_name">Icon</Label>
              <Select
                value={watchedIconName}
                onValueChange={(value) => setValue('icon_name', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select icon" />
                </SelectTrigger>
                <SelectContent>
                  {icons.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                {...register('source')}
                placeholder="e.g., Reuters, Bloomberg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="external_url">External URL</Label>
              <Input
                id="external_url"
                {...register('external_url')}
                placeholder="https://..."
                type="url"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createInsight.isPending || updateInsight.isPending}
            >
              {isEdit ? 'Update' : 'Create'} Insight
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AnalystInsightForm;
