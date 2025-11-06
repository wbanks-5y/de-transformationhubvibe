
import React from "react";
import { useNavigate } from "react-router-dom";
import { RingData } from "./RingChart";
import LogoHeader from "./home/LogoHeader";
import ModuleGrid from "./home/ModuleGrid";
import Footer from "./home/Footer";
import { useHomeCockpitAggregates } from "@/hooks/use-home-cockpit-aggregates";
import { useCockpitModules } from "@/hooks/use-cockpit-modules";
import BusinessAreaChart from "./home/BusinessAreaChart";
import { Lightbulb, RefreshCw, AlertTriangle } from "lucide-react";
import { getIconByName } from "@/utils/iconUtils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useOrganization } from "@/context/OrganizationContext";
import type { HomeModuleCard } from "./home/types";

const HomeScreen = () => {
  const navigate = useNavigate();
  const { user, session, loading: authLoading } = useAuth();
  const { currentOrganization } = useOrganization();
  
  const { data: cockpitAggregates, isLoading: aggregatesLoading, error: aggregatesError, refetch } = useHomeCockpitAggregates();
  const cockpitModules = useCockpitModules();

  const handleModuleClick = (link: string) => {
    console.log("Navigation triggered:", { 
      destination: link,
      timestamp: new Date().toISOString(),
      currentPath: window.location.pathname,
      sessionValid: session ? Date.now() < (session.expires_at * 1000) : false
    });
    navigate(link);
  };

  console.log("HomeScreen render:", {
    authLoading,
    hasUser: !!user,
    hasSession: !!session,
    sessionValid: session ? Date.now() < (session.expires_at * 1000) : false,
    aggregatesLoading,
    aggregatesError: aggregatesError?.message,
    cockpitModulesCount: cockpitModules.length,
    cockpitAggregatesCount: cockpitAggregates?.length || 0
  });

  // Show auth loading first
  if (authLoading) {
    console.log("HomeScreen: Showing auth loading");
    return (
      <div className="container mx-auto px-4 py-10">
        <LogoHeader />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <div className="text-lg">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // Handle session issues
  if (!user || !session) {
    console.log("HomeScreen: No user or session");
    return (
      <div className="container mx-auto px-4 py-10">
        <LogoHeader />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertTriangle className="h-8 w-8 text-yellow-500" />
          <div className="text-lg">Session Issue</div>
          <p className="text-sm text-gray-500 max-w-md text-center">
            Please refresh the page to continue.
          </p>
          <Button onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  // Convert cockpit aggregates to ring data format
  const ringData: RingData[] = cockpitAggregates?.map(aggregate => {
    const IconComponent = getIconByName(aggregate.icon);
    
    console.log("Creating ring data for cockpit:", {
      cockpitName: aggregate.cockpit_name,
      displayName: aggregate.display_name,
      aggregateColor: aggregate.color,
      performancePercentage: aggregate.performance_percentage
    });
    
    return {
      id: aggregate.cockpit_type_id,
      title: aggregate.display_name,
      value: Math.round(aggregate.performance_percentage),
      color: aggregate.color,
      icon: React.createElement(IconComponent, { 
        className: "h-4 w-4",
        style: { color: aggregate.color }
      }),
    };
  }).filter(item => item.value > 0) || [];

  // Convert dynamic cockpit modules with enhanced color handling
  const cockpitModulesForGrid: HomeModuleCard[] = cockpitModules.map(module => {
    // Find matching aggregate by cockpit name
    const aggregateData = cockpitAggregates?.find(agg => 
      agg.cockpit_name === module.id.replace('-cockpit', '') ||
      module.path.includes(agg.cockpit_name)
    );
    
    const IconComponent = getIconByName(aggregateData?.icon || 'Gauge');
    
    console.log("Processing module colors:", {
      moduleId: module.id,
      modulePath: module.path,
      moduleColor: module.color,
      aggregateColor: aggregateData?.color,
      cockpitName: aggregateData?.cockpit_name,
      finalColor: aggregateData?.color || module.color
    });
    
    return {
      title: module.title,
      description: aggregateData 
        ? `${aggregateData.active_kpis} active KPIs | ${Math.round(aggregateData.performance_percentage)}% performance`
        : module.description,
      icon: React.createElement(IconComponent, { 
        className: "h-6 w-6"
      }),
      link: module.path,
      color: aggregateData?.color || module.color, // Use aggregate color if available
      performanceValue: Math.round(aggregateData?.performance_percentage || 0),
      ringColor: aggregateData?.color || "",
      isNewFeature: false
    };
  });

  // Additional cards
  const additionalCards: HomeModuleCard[] = [
    {
      title: "Analyst Insights",
      description: "AI-powered analysis and recommendations from business data",
      icon: <Lightbulb className="h-6 w-6 text-purple-600" />,
      link: "/insights",
      color: "#8B5CF6", // Use hex color directly
      performanceValue: 0,
      ringColor: "",
      isNewFeature: true
    }
  ];

  const allModulesForGrid = [...cockpitModulesForGrid, ...additionalCards];
  const allModulesForChart = cockpitModulesForGrid.filter(module => module.performanceValue && module.performanceValue > 0);

  // Loading state
  if (aggregatesLoading) {
    console.log("HomeScreen: Showing aggregates loading");
    return (
      <div className="container mx-auto px-4 py-10">
        <LogoHeader />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
            <div className="text-lg">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (aggregatesError) {
    console.error("HomeScreen: Aggregates error:", aggregatesError);
    return (
      <div className="container mx-auto px-4 py-10">
        <LogoHeader />
        <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
          <div className="text-lg text-red-600">Failed to load dashboard</div>
          <p className="text-sm text-gray-500 max-w-md text-center">
            {aggregatesError.message || "There was an error loading your dashboard."}
          </p>
          <Button onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  console.log("HomeScreen: Rendering main content with colors:", {
    ringDataCount: ringData.length,
    modulesCount: allModulesForGrid.length,
    chartModulesCount: allModulesForChart.length
  });

  return (
    <div className="container mx-auto px-4 py-10">
      <LogoHeader />
      
      {currentOrganization?.name && (
        <div className="text-center mb-8">
          <h2 className="text-2xl font-jakarta font-semibold text-foreground">
            {currentOrganization.name}
          </h2>
        </div>
      )}
      
      <BusinessAreaChart
        ringData={ringData} 
        modules={allModulesForChart} 
      />
      
      <ModuleGrid 
        modules={allModulesForGrid} 
        onModuleClick={handleModuleClick}
        cockpitAggregates={cockpitAggregates}
      />
      <Footer />
    </div>
  );
};

export default HomeScreen;
