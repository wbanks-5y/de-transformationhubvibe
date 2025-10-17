
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { TrendingUp } from 'lucide-react';
import type { ModuleConfig } from './moduleData';
import type { CockpitAggregate } from '@/hooks/use-home-cockpit-aggregates';

interface ModuleCardProps {
  module: ModuleConfig;
  cockpitAggregate?: CockpitAggregate;
}

interface ColorScheme {
  progress: string;
  background: string;
  text: string;
  iconBg: string;
  iconText: string;
  border: string;
  accent: string;
  customHex?: string;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, cockpitAggregate }) => {
  // Use actual performance percentage from database
  const performanceValue = cockpitAggregate ? Math.round(cockpitAggregate.performance_percentage) : null;

  console.log("ModuleCard rendering:", {
    moduleTitle: module.title,
    moduleColor: module.color,
    aggregateColor: cockpitAggregate?.color,
    performanceValue
  });

  // Enhanced color handler with better cockpit color detection
  const getColorScheme = (): ColorScheme => {
    // Priority 1: Use cockpitAggregate.color (HEX from database)
    if (cockpitAggregate?.color) {
      const hexColor = cockpitAggregate.color;
      console.log("Using cockpit aggregate color:", hexColor);
      
      // Enhanced HEX color mapping with more professional colors
      const hexColorMap: Record<string, ColorScheme> = {
        '#3B82F6': { 
          progress: 'bg-blue-500', 
          background: 'bg-blue-50/80', 
          text: 'text-blue-700', 
          iconBg: 'bg-blue-100', 
          iconText: 'text-blue-600',
          border: 'border-blue-200/60',
          accent: 'bg-blue-500/10'
        },
        '#10B981': { 
          progress: 'bg-emerald-500', 
          background: 'bg-emerald-50/80', 
          text: 'text-emerald-700', 
          iconBg: 'bg-emerald-100', 
          iconText: 'text-emerald-600',
          border: 'border-emerald-200/60',
          accent: 'bg-emerald-500/10'
        },
        '#EF4444': { 
          progress: 'bg-red-500', 
          background: 'bg-red-50/80', 
          text: 'text-red-700', 
          iconBg: 'bg-red-100', 
          iconText: 'text-red-600',
          border: 'border-red-200/60',
          accent: 'bg-red-500/10'
        },
        '#F59E0B': { 
          progress: 'bg-amber-500', 
          background: 'bg-amber-50/80', 
          text: 'text-amber-700', 
          iconBg: 'bg-amber-100', 
          iconText: 'text-amber-600',
          border: 'border-amber-200/60',
          accent: 'bg-amber-500/10'
        },
        '#8B5CF6': { 
          progress: 'bg-violet-500', 
          background: 'bg-violet-50/80', 
          text: 'text-violet-700', 
          iconBg: 'bg-violet-100', 
          iconText: 'text-violet-600',
          border: 'border-violet-200/60',
          accent: 'bg-violet-500/10'
        },
        '#EC4899': { 
          progress: 'bg-pink-500', 
          background: 'bg-pink-50/80', 
          text: 'text-pink-700', 
          iconBg: 'bg-pink-100', 
          iconText: 'text-pink-600',
          border: 'border-pink-200/60',
          accent: 'bg-pink-500/10'
        },
        '#6366F1': { 
          progress: 'bg-indigo-500', 
          background: 'bg-indigo-50/80', 
          text: 'text-indigo-700', 
          iconBg: 'bg-indigo-100', 
          iconText: 'text-indigo-600',
          border: 'border-indigo-200/60',
          accent: 'bg-indigo-500/10'
        },
        '#14B8A6': { 
          progress: 'bg-teal-500', 
          background: 'bg-teal-50/80', 
          text: 'text-teal-700', 
          iconBg: 'bg-teal-100', 
          iconText: 'text-teal-600',
          border: 'border-teal-200/60',
          accent: 'bg-teal-500/10'
        },
        '#F97316': { 
          progress: 'bg-orange-500', 
          background: 'bg-orange-50/80', 
          text: 'text-orange-700', 
          iconBg: 'bg-orange-100', 
          iconText: 'text-orange-600',
          border: 'border-orange-200/60',
          accent: 'bg-orange-500/10'
        },
        '#84CC16': { 
          progress: 'bg-lime-500', 
          background: 'bg-lime-50/80', 
          text: 'text-lime-700', 
          iconBg: 'bg-lime-100', 
          iconText: 'text-lime-600',
          border: 'border-lime-200/60',
          accent: 'bg-lime-500/10'
        },
      };
      
      if (hexColorMap[hexColor]) {
        return hexColorMap[hexColor];
      }
      
      // For unmapped HEX colors, return with custom properties
      console.log("Using custom hex color:", hexColor);
      return {
        progress: 'bg-slate-400',
        background: 'bg-slate-50/80',
        text: 'text-slate-700',
        iconBg: 'bg-slate-100',
        iconText: 'text-slate-600',
        border: 'border-slate-200/60',
        accent: 'bg-slate-500/10',
        customHex: hexColor
      };
    }
    
    // Priority 2: Use module.color (could be HEX or Tailwind)
    if (module.color) {
      const colorStr = module.color;
      console.log("Using module color:", colorStr);
      
      // Check if it's a HEX color in module.color
      if (colorStr.startsWith('#')) {
        const hexColorMap: Record<string, ColorScheme> = {
          '#3B82F6': { 
            progress: 'bg-blue-500', 
            background: 'bg-blue-50/80', 
            text: 'text-blue-700', 
            iconBg: 'bg-blue-100', 
            iconText: 'text-blue-600',
            border: 'border-blue-200/60',
            accent: 'bg-blue-500/10'
          },
          '#10B981': { 
            progress: 'bg-emerald-500', 
            background: 'bg-emerald-50/80', 
            text: 'text-emerald-700', 
            iconBg: 'bg-emerald-100', 
            iconText: 'text-emerald-600',
            border: 'border-emerald-200/60',
            accent: 'bg-emerald-500/10'
          },
          '#8B5CF6': { 
            progress: 'bg-violet-500', 
            background: 'bg-violet-50/80', 
            text: 'text-violet-700', 
            iconBg: 'bg-violet-100', 
            iconText: 'text-violet-600',
            border: 'border-violet-200/60',
            accent: 'bg-violet-500/10'
          },
        };
        
        return hexColorMap[colorStr] || {
          progress: 'bg-slate-400',
          background: 'bg-slate-50/80',
          text: 'text-slate-700',
          iconBg: 'bg-slate-100',
          iconText: 'text-slate-600',
          border: 'border-slate-200/60',
          accent: 'bg-slate-500/10',
          customHex: colorStr
        };
      }
      
      // Parse Tailwind classes
      const bgColorMatch = colorStr.match(/bg-(\w+)-(\d+)/);
      
      if (bgColorMatch) {
        const colorName = bgColorMatch[1];
        console.log("Using Tailwind color scheme:", colorName);
        return {
          progress: `bg-${colorName}-500`,
          background: `bg-${colorName}-50/80`,
          text: `text-${colorName}-700`,
          iconBg: `bg-${colorName}-100`,
          iconText: `text-${colorName}-600`,
          border: `border-${colorName}-200/60`,
          accent: `bg-${colorName}-500/10`
        };
      }
    }
    
    // Priority 3: Default to refined blue theme
    console.log("Using default blue color scheme");
    return {
      progress: 'bg-blue-500',
      background: 'bg-blue-50/80',
      text: 'text-blue-700',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      border: 'border-blue-200/60',
      accent: 'bg-blue-500/10'
    };
  };

  const colorScheme = getColorScheme();

  return (
    <Link to={module.path} className="block">
      <Card className={`group hover:shadow-lg transition-all duration-300 h-full flex flex-col border ${colorScheme.border} ${colorScheme.background} hover:${colorScheme.accent}`}>
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-center">
            <div 
              className={`p-4 rounded-xl ${colorScheme.iconBg} group-hover:scale-105 transition-all duration-300 shadow-sm border border-white/50`}
              style={colorScheme.customHex ? { 
                backgroundColor: `${colorScheme.customHex}15`, // 8% opacity
                borderColor: `${colorScheme.customHex}30` // 18% opacity
              } : {}}
            >
              {React.cloneElement(module.icon as React.ReactElement, {
                className: `w-6 h-6 ${colorScheme.customHex ? '' : colorScheme.iconText}`,
                style: colorScheme.customHex ? { color: colorScheme.customHex } : {}
              })}
            </div>
          </div>
          <CardTitle className={`text-lg font-semibold text-center mt-3 ${colorScheme.text}`}>
            {module.title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4 flex-1 flex flex-col justify-between">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              {cockpitAggregate ? `${cockpitAggregate.active_kpis} Active KPIs` : 'No KPI data available'}
            </p>
            
            {/* Performance Progress Bar */}
            {performanceValue !== null && performanceValue > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    Performance
                  </span>
                  <span className={`font-medium ${colorScheme.text}`}>{performanceValue}%</span>
                </div>
                <div className="w-full bg-gray-200/60 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${colorScheme.progress}`}
                    style={{ 
                      width: `${performanceValue}%`,
                      ...(colorScheme.customHex ? { backgroundColor: colorScheme.customHex } : {})
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ModuleCard;
