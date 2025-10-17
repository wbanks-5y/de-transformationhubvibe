
import React from "react";
import ModuleCard from "./ModuleCard";
import type { HomeModuleCard } from "./types";
import type { CockpitAggregate } from "@/hooks/use-home-cockpit-aggregates";

interface ModuleGridProps {
  modules: HomeModuleCard[];
  onModuleClick: (link: string) => void;
  cockpitAggregates?: CockpitAggregate[];
}

const ModuleGrid = ({ modules, onModuleClick, cockpitAggregates = [] }: ModuleGridProps) => {
  return (
    <div className="mb-20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-10 text-center">Business Area Cockpits</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {modules.map((module) => {
          // Find matching cockpit aggregate
          const cockpitAggregate = cockpitAggregates.find(agg => 
            module.link.includes(agg.cockpit_name) || 
            agg.display_name.toLowerCase().includes(module.title.toLowerCase().split(' ')[0])
          );
          
          return (
            <div key={module.link} onClick={() => onModuleClick(module.link)}>
              <ModuleCard 
                module={{
                  id: module.link.replace('/', '').replace('/', '-'), // Generate ID from path
                  title: module.title,
                  description: module.description,
                  icon: module.icon as any,
                  path: module.link,
                  color: module.color,
                  category: 'analytics' as const, // Default category
                  requiredTier: 'essential' as const, // Default tier
                }}
                cockpitAggregate={cockpitAggregate}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModuleGrid;
