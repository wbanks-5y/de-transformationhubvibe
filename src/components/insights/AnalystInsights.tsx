
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart, 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Users, 
  Briefcase, 
  AlertTriangle,
  MessageSquare,
  Info,
  Search,
  Calendar,
  Layers,
  DollarSign,
  FlagTriangleRight,
  FilePlus,
  ChartBar,
  Loader2,
  ExternalLink
} from "lucide-react";
import AnalystRequestDialog from "./AnalystRequestDialog";
import { useAnalystInsights, AnalystInsight } from "@/hooks/useAnalystInsights";
import { useAnalystInsightCategories } from "@/hooks/useAnalystInsightCategories";

// Icon mapping for dynamic icon rendering
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  TrendingUp,
  TrendingDown,
  Globe,
  Users,
  Briefcase,
  AlertTriangle,
  BarChart,
  DollarSign,
  FlagTriangleRight,
  FilePlus,
  ChartBar,
  Layers
};

const InsightCard = ({ insight }: { insight: AnalystInsight }) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const IconComponent = insight.icon_name ? iconMap[insight.icon_name] || BarChart : BarChart;

  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
          <div className="flex items-start gap-2 flex-1">
            <div className={`p-2 rounded-full flex-shrink-0 ${insight.impact === "positive" ? "bg-green-100" : insight.impact === "negative" ? "bg-red-100" : "bg-blue-100"}`}>
              <IconComponent className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg leading-tight">{insight.title}</CardTitle>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                <Badge variant="outline" className="text-xs w-fit">{insight.category}</Badge>
                <span className="text-gray-500 text-xs">{insight.timestamp_text}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getImpactColor(insight.impact)} text-xs whitespace-nowrap flex-shrink-0`}>
            {insight.impact === "positive" ? "Positive" : 
             insight.impact === "negative" ? "Negative" : "Neutral"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 text-sm sm:text-base">{insight.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 mt-2">
          {insight.source && (
            <span>Source: {insight.source}</span>
          )}
          {insight.external_url && (
            <a 
              href={insight.external_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-3 w-3" />
              View Source
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const AnalystInsights: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: insights = [], isLoading, error } = useAnalystInsights();
  const { data: categories = [], isLoading: categoriesLoading } = useAnalystInsightCategories();
  
  const filterInsights = (insights: AnalystInsight[]) => {
    if (!searchQuery.trim()) return insights;
    
    const query = searchQuery.toLowerCase();
    return insights.filter(
      insight => 
        insight.title.toLowerCase().includes(query) || 
        insight.description.toLowerCase().includes(query) ||
        insight.category.toLowerCase().includes(query)
    );
  };

  const getInsightsByCategory = (categoryName: string) => {
    if (categoryName === 'all') return insights;
    
    // Find the category to get the proper mapping
    const category = categories.find(cat => cat.name === categoryName);
    if (!category) return [];
    
    // Match insights by category display name or name
    return insights.filter(insight => 
      insight.category.toLowerCase() === category.display_name.toLowerCase() ||
      insight.category.toLowerCase() === category.name.toLowerCase()
    );
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    
    categories.forEach(category => {
      const categoryInsights = insights.filter(insight => 
        insight.category.toLowerCase() === category.display_name.toLowerCase() ||
        insight.category.toLowerCase() === category.name.toLowerCase()
      );
      stats[category.name] = categoryInsights.length;
    });
    
    return stats;
  };

  if (isLoading || categoriesLoading) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 lg:p-8">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error Loading Insights</AlertTitle>
          <AlertDescription>
            Failed to load analyst insights. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const stats = getCategoryStats();

  return (
    <div className="container mx-auto p-4 lg:p-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analyst Insights</h1>
        <p className="text-gray-500 mt-2 text-sm sm:text-base">
          AI-powered analysis of market, economic, political, and operational data relevant to your organization
        </p>
        
        <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search insights..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Calendar size={14} className="sm:w-4 sm:h-4" />
            <span>Last updated: Today, 14:30</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 lg:gap-6">
        <div className="xl:col-span-3">
          <Tabs defaultValue="all" className="w-full">
            <div className="overflow-x-auto mb-4 sm:mb-6">
              <TabsList className="grid w-max grid-cols-auto lg:w-full" style={{ gridTemplateColumns: `repeat(${categories.length + 1}, minmax(0, 1fr))` }}>
                <TabsTrigger value="all" className="text-xs sm:text-sm">All</TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.name} 
                    className="text-xs sm:text-sm"
                  >
                    {category.display_name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            <TabsContent value="all">
              {filterInsights(insights).length > 0 ? (
                filterInsights(insights).map(insight => (
                  <InsightCard key={insight.id} insight={insight} />
                ))
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No insights found</AlertTitle>
                  <AlertDescription>
                    No insights match your search criteria. Try adjusting your search terms.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            {categories.map(category => (
              <TabsContent key={category.id} value={category.name}>
                {filterInsights(getInsightsByCategory(category.name)).length > 0 ? (
                  filterInsights(getInsightsByCategory(category.name)).map(insight => (
                    <InsightCard key={insight.id} insight={insight} />
                  ))
                ) : (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>No insights found</AlertTitle>
                    <AlertDescription>
                      No {category.display_name.toLowerCase()} insights match your search criteria. Try adjusting your search terms.
                    </AlertDescription>
                  </Alert>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
        
        <div className="xl:col-span-1">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base sm:text-lg">Key Topics</CardTitle>
              <CardDescription className="text-sm">Trending in your industry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categories.map(category => (
                  <div key={category.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-4 w-4 ${category.color_class || 'text-blue-500'} flex-shrink-0`}>
                          {category.icon_name && iconMap[category.icon_name] ? 
                            React.createElement(iconMap[category.icon_name], { className: "h-4 w-4" }) :
                            <BarChart className="h-4 w-4" />
                          }
                        </div>
                        <span className="text-sm">{category.display_name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">{stats[category.name] || 0}</Badge>
                    </div>
                    <Separator className="mt-2" />
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Insight Sources</h3>
                <div className="text-xs text-gray-500">
                  <p>Data analyzed from 65+ industry sources, government reports, customer data, and vendor performance metrics.</p>
                  <p className="mt-2">Last data refresh: Today at 12:00 PM</p>
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  className="w-full text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-md transition-colors flex items-center justify-center gap-1"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Ask Analyst
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <AnalystRequestDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  );
};

export default AnalystInsights;
