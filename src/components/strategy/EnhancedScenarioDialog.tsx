import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, TrendingDown, TrendingUp, Settings, Zap, Users, Brain } from 'lucide-react';
import { useEnhancedScenarioIntelligence, EnhancedScenarioRequest } from '@/hooks/use-enhanced-scenario-intelligence';

interface EnhancedScenarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScenarioGenerated: (scenarioData: any) => void;
}

const scenarioTypes = [
  {
    id: 'economic_downturn',
    name: 'Economic Downturn',
    description: 'Market contraction, reduced spending, supply chain disruptions',
    icon: TrendingDown,
    color: 'text-red-500',
    examples: ['Recession impact', 'Inflation effects', 'Interest rate changes']
  },
  {
    id: 'market_expansion',
    name: 'Market Expansion', 
    description: 'New product launch, geographic growth, market share gains',
    icon: TrendingUp,
    color: 'text-green-500',
    examples: ['Product launch success', 'New market entry', 'Competitor exit']
  },
  {
    id: 'operational_efficiency',
    name: 'Operational Efficiency',
    description: 'Process improvements, automation, cost optimization',
    icon: Settings,
    color: 'text-blue-500',
    examples: ['Automation investment', 'Process optimization', 'System upgrades']
  },
  {
    id: 'competitive_pressure',
    name: 'Competitive Pressure',
    description: 'New competitors, pricing wars, market disruption',
    icon: Zap,
    color: 'text-orange-500',
    examples: ['New competitor entry', 'Price competition', 'Disruptive technology']
  },
  {
    id: 'custom',
    name: 'Custom Scenario',
    description: 'Define your own unique business scenario',
    icon: Brain,
    color: 'text-purple-500',
    examples: ['Regulatory changes', 'Technology shifts', 'Strategic partnerships']
  }
];

const timeframeOptions = [
  { value: '3_months', label: '3 Months', description: 'Short-term impact analysis' },
  { value: '6_months', label: '6 Months', description: 'Medium-term planning' },
  { value: '12_months', label: '12 Months', description: 'Annual strategic planning' },
  { value: '24_months', label: '24 Months', description: 'Long-term strategic view' }
];

export const EnhancedScenarioDialog: React.FC<EnhancedScenarioDialogProps> = ({
  open,
  onOpenChange,
  onScenarioGenerated
}) => {
  const [selectedScenarioType, setSelectedScenarioType] = useState<string>('economic_downturn');
  const [customDescription, setCustomDescription] = useState('');
  const [timeframe, setTimeframe] = useState('12_months');
  const [companyProfile, setCompanyProfile] = useState({
    name: '',
    industry: '',
    location: '',
    business_type: 'B2B'
  });

  const { mutate: generateScenario, isPending } = useEnhancedScenarioIntelligence();

  const handleGenerate = () => {
    const request: EnhancedScenarioRequest = {
      scenarioType: selectedScenarioType as any,
      timeframe: timeframe as any,
      customScenarioDescription: selectedScenarioType === 'custom' ? customDescription : undefined,
      companyProfile: companyProfile.name ? companyProfile : undefined
    };

    generateScenario(request, {
      onSuccess: (data) => {
        onScenarioGenerated(data);
        onOpenChange(false);
      }
    });
  };

  const selectedScenario = scenarioTypes.find(s => s.id === selectedScenarioType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            Generate AI-Powered Scenario Analysis
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Info Card */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Brain className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-primary mb-1">AI-Enhanced Scenario Planning</h3>
                  <p className="text-sm text-primary/80">
                    This tool automatically analyzes your real cockpit data, applies market intelligence, 
                    and generates realistic scenario impacts with actionable recommendations.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scenario Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Select Scenario Type</Label>
            <RadioGroup 
              value={selectedScenarioType} 
              onValueChange={setSelectedScenarioType}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {scenarioTypes.map((scenario) => {
                const IconComponent = scenario.icon;
                return (
                  <div key={scenario.id} className="relative">
                    <RadioGroupItem 
                      value={scenario.id} 
                      id={scenario.id}
                      className="peer sr-only"
                    />
                    <Label 
                      htmlFor={scenario.id}
                      className="flex flex-col p-4 border-2 rounded-lg cursor-pointer transition-all peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary/50"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <IconComponent className={`h-5 w-5 ${scenario.color}`} />
                        <span className="font-medium">{scenario.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{scenario.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {scenario.examples.map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Custom Scenario Description */}
          {selectedScenarioType === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="custom-description">Custom Scenario Description</Label>
              <Textarea
                id="custom-description"
                placeholder="Describe your custom scenario in detail..."
                value={customDescription}
                onChange={(e) => setCustomDescription(e.target.value)}
                rows={3}
              />
            </div>
          )}

          {/* Timeframe Selection */}
          <div className="space-y-2">
            <Label>Analysis Timeframe</Label>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeframeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                      <span className="text-xs text-muted-foreground">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Optional Company Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="h-4 w-4" />
                Company Profile (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Company Name</Label>
                  <Input
                    id="company-name"
                    placeholder="e.g., Acme Corp"
                    value={companyProfile.name}
                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Input
                    id="industry"
                    placeholder="e.g., Manufacturing"
                    value={companyProfile.industry}
                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, industry: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Detroit, MI"
                    value={companyProfile.location}
                    onChange={(e) => setCompanyProfile(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Business Type</Label>
                  <Select 
                    value={companyProfile.business_type} 
                    onValueChange={(value) => setCompanyProfile(prev => ({ ...prev, business_type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="B2B">B2B (Business to Business)</SelectItem>
                      <SelectItem value="B2C">B2C (Business to Consumer)</SelectItem>
                      <SelectItem value="B2G">B2G (Business to Government)</SelectItem>
                      <SelectItem value="Mixed">Mixed Model</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleGenerate} 
              disabled={isPending || (selectedScenarioType === 'custom' && !customDescription.trim())}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Analysis...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Generate AI Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};