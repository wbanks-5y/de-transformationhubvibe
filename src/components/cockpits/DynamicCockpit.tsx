import React from "react";
import { useParams } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle, Plus, RefreshCw } from "lucide-react";
import { useRefactoredCockpitData } from "@/hooks/cockpit/use-refactored-cockpit-data";
import { useCockpitKPIs } from "@/hooks/use-cockpit-kpis";
import { useCockpitInsights } from "@/hooks/insights/useCockpitInsights";
import { useAuth } from "@/context/AuthContext";
import { CockpitErrorBoundary } from "./CockpitErrorBoundary";
import CockpitHeader from "./CockpitHeader";
import InsightsSection from "./InsightsSection";
import KPICard from "./KPICard";
import { CockpitSectionRenderer } from "./CockpitSectionRenderer";
import EnhancedLoadingScreen from "@/components/EnhancedLoadingScreen";
import { CockpitType } from "@/types/cockpit";

interface CockpitData {
  cockpitType: CockpitType;
  sections: any[];
  insights: any[];
}

const DynamicCockpitContent: React.FC<{ cockpitType: string }> = ({ cockpitType }) => {
  const { user, session, loading: authLoading } = useAuth();
  const { data, isLoading, error, refetch, isFetching } = useRefactoredCockpitData(cockpitType);
  const cockpitData = data as CockpitData | undefined;
  const { data: kpis, isLoading: kpisLoading } = useCockpitKPIs(cockpitData?.cockpitType?.id);
  const { data: insights, isLoading: insightsLoading } = useCockpitInsights(cockpitData?.cockpitType?.id);

  console.log(`DynamicCockpit [${cockpitType}] render:`, {
    authLoading,
    hasUser: !!user,
    hasSession: !!session,
    isLoading,
    isFetching,
    hasData: !!data,
    error: error?.message,
    kpisLoading,
    kpisCount: kpis?.length || 0,
    insightsLoading,
    insightsCount: insights?.length || 0
  });

  // Show enhanced loading screen while auth is loading or data is loading
  if (authLoading || isLoading) {
    return <EnhancedLoadingScreen message={`Loading ${cockpitType} cockpit...`} />;
  }

  // Show auth-specific error if no session
  if (!user || !session) {
    console.error('No auth session for cockpit');
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Authentication required. Please refresh the page or sign in again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error || !cockpitData) {
    console.error('Cockpit error:', error);
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              Failed to load cockpit data. Please try again.
              {error?.message && ` Error: ${error.message}`}
            </span>
            <button
              onClick={() => {
                console.log('Retry button clicked');
                refetch();
              }}
              className="ml-4 px-3 py-1 bg-primary text-white rounded-md text-sm hover:bg-primary/90 transition-colors flex items-center gap-1"
              disabled={isFetching}
            >
              <RefreshCw className={`h-3 w-3 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Refreshing...' : 'Retry'}
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { cockpitType: cockpitTypeData, sections } = cockpitData;

  return (
    <div className="container mx-auto p-4 lg:p-8 space-y-8">
      {/* Header */}
      <CockpitHeader 
        displayName={cockpitTypeData.display_name}
        description={cockpitTypeData.description}
      />

      {/* KPIs Section */}
      {kpis && kpis.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Key Performance Indicators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 auto-rows-fr">
            {kpis
              .filter(kpi => kpi.is_active)
              .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
              .map((kpi) => (
                <div key={kpi.id} className="min-h-[120px]">
                  <KPICard 
                    kpi={kpi}
                    timeRange="30d"
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Metrics by Section */}
      {sections.length === 0 ? (
        <div className="text-center py-16">
          <Plus className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No sections configured</h3>
          <p className="mt-1 text-sm text-gray-500">
            This cockpit doesn't have any sections or metrics configured yet.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {sections.map((section) => (
            <CockpitSectionRenderer key={section.id} section={section} />
          ))}
        </div>
      )}

      {/* Insights Section */}
      <InsightsSection 
        insights={insights || []} 
        cockpitDisplayName={cockpitTypeData.display_name}
      />
    </div>
  );
};

const DynamicCockpit: React.FC = () => {
  const { cockpitType } = useParams<{ cockpitType: string }>();
  
  if (!cockpitType) {
    console.error('DynamicCockpit: No cockpit type provided in URL params');
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Invalid cockpit URL. Please navigate to a valid cockpit.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <CockpitErrorBoundary cockpitType={cockpitType}>
      <DynamicCockpitContent cockpitType={cockpitType} />
    </CockpitErrorBoundary>
  );
};

export default DynamicCockpit;
