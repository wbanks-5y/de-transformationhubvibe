
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BackButton from "../ui/back-button";

interface BaseCockpitLayoutProps {
  title: string;
  description: string;
  cockpitDescription?: string;
  children: React.ReactNode;
  tabs?: {
    id: string;
    label: string;
    content: React.ReactNode;
  }[];
}

const BaseCockpitLayout: React.FC<BaseCockpitLayoutProps> = ({
  title,
  description,
  cockpitDescription,
  children,
  tabs = [],
}) => {
  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-500 mt-2">{description}</p>
      </div>

      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <p className="text-gray-700">
          {title} {cockpitDescription || 'provides real-time operational metrics and analytics for day-to-day decision making. Unlike the Health dashboards which focus on strategic indicators and long-term trends, this cockpit gives you immediate visibility into current operations and performance.'}
        </p>
      </div>

      {tabs.length > 0 ? (
        <Tabs defaultValue={tabs[0].id} className="w-full">
          <TabsList className="mb-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tab.content}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children}
        </div>
      )}
    </div>
  );
};

export default BaseCockpitLayout;
