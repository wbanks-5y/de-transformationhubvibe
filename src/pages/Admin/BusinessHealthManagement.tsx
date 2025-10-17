
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Target, TrendingUp, Calendar, Users, Shield, Plus, Info } from "lucide-react";
import BackButton from "@/components/ui/back-button";
import StrategicObjectivesAdmin from "./components/StrategicObjectivesAdmin";
import ObjectiveHealthTrackingAdmin from "./components/ObjectiveHealthTrackingAdmin";
import StrategicInitiativesAdmin from "./components/StrategicInitiativesAdmin";
import RisksOpportunitiesAdmin from "./components/RisksOpportunitiesAdmin";

const BusinessHealthManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("objectives");

  const adminSections = [
    {
      id: "objectives",
      title: "Strategic Objectives",
      description: "Define your organization's key strategic goals across Financial, Customer, Internal Process, and Learning & Growth perspectives. These form the foundation of your business health tracking.",
      icon: Target,
      color: "bg-blue-500",
      helpText: "Start here: Create the strategic objectives that define what success looks like for your organization."
    },
    {
      id: "health",
      title: "Business Health",
      description: "Track health scores (0-100) and RAG status for each strategic objective across different time periods. This shows how well you're performing against your strategic goals.",
      icon: TrendingUp,
      color: "bg-green-500",
      helpText: "Monitor performance: Add health data to see how your objectives are progressing over time."
    },
    {
      id: "initiatives",
      title: "Initiative Tracker",
      description: "Manage specific projects and actions that drive progress toward your strategic objectives. Link initiatives to objectives to show execution plans.",
      icon: Calendar,
      color: "bg-purple-500",
      helpText: "Execute strategy: Create initiatives that will help you achieve your strategic objectives."
    },
    {
      id: "risks",
      title: "Risk Assessment",
      description: "Identify and track risks that could impact your strategic objectives, plus opportunities that could accelerate progress.",
      icon: Shield,
      color: "bg-orange-500",
      helpText: "Manage uncertainty: Track what could help or hinder your strategic success."
    }
  ];

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Health Management</h1>
        <p className="text-gray-500 mt-2">
          Configure and manage your strategic framework - from objectives to execution tracking
        </p>
        
        {/* Data Flow Explanation */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">How it all connects:</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                <strong>1. Strategic Objectives</strong> are your core goals → 
                <strong> 2. Business Health</strong> measures progress → 
                <strong> 3. Initiative Tracker</strong> are actions to achieve objectives → 
                <strong> 4. Risk Assessment</strong> impact success
              </p>
            </div>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          {adminSections.map((section) => (
            <TabsTrigger key={section.id} value={section.id} className="flex items-center gap-2">
              <section.icon className="h-4 w-4" />
              {section.title}
            </TabsTrigger>
          ))}
        </TabsList>

        {adminSections.map((section) => (
          <TabsContent key={section.id} value={section.id}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${section.color}`}>
                    <section.icon className="h-5 w-5 text-white" />
                  </div>
                  {section.title}
                </CardTitle>
                <CardDescription className="text-base">
                  {section.description}
                </CardDescription>
                <div className="mt-2 p-3 bg-gray-50 rounded border-l-4 border-gray-300">
                  <p className="text-sm text-gray-700 font-medium">
                    💡 {section.helpText}
                  </p>
                </div>
              </CardHeader>
            </Card>
            
            {section.id === "objectives" && <StrategicObjectivesAdmin />}
            {section.id === "health" && <ObjectiveHealthTrackingAdmin />}
            {section.id === "initiatives" && <StrategicInitiativesAdmin />}
            {section.id === "risks" && <RisksOpportunitiesAdmin />}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default BusinessHealthManagement;
