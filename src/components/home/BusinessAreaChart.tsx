
import React from "react";
import { RingChart, RingData } from "../RingChart";

interface BusinessAreaChartProps {
  ringData: RingData[];
  modules: any[];
}

const BusinessAreaChart = ({ ringData, modules }: BusinessAreaChartProps) => {
  // Only show cockpit modules that have data (performance > 0) in the legend
  // Filter out static modules and only include cockpit-based modules
  const cockpitModulesWithData = modules.filter(module => 
    module.performanceValue > 0 && 
    module.link.startsWith('/cockpit/')
  );

  return (
    <div className="flex flex-col items-center mb-20">
      <h2 className="text-2xl font-semibold text-gray-800 mb-10">Business Area Performance</h2>
      <div className="w-full max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10 justify-center">
          <div className="flex-shrink-0">
            <RingChart 
              data={ringData} 
              size={380}
              strokeWidth={24}
              iconSize={24}
              gap={8}
              removeIcons={false}
            />
          </div>
          
          {cockpitModulesWithData.length > 0 && (
            <div className="mt-8 md:mt-0 w-full max-w-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {cockpitModulesWithData.map((module) => (
                  <div key={module.link} className="flex items-center text-sm gap-2.5">
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: module.ringColor }}></div>
                    <div className="flex items-center justify-between w-full gap-3">
                      <span className="text-gray-700">{module.title}</span>
                      <span className="text-gray-500 font-medium">{module.performanceValue}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusinessAreaChart;
