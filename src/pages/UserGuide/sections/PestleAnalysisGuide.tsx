import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Target, TrendingUp, Globe, Scale, Leaf, Info } from 'lucide-react';

const PestleAnalysisGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">PESTLE Analysis</h1>
        <p className="text-gray-600">Comprehensive Political, Economic, Social, Technological, Legal, and Environmental analysis for strategic decision making.</p>
        <Badge className="mt-2">Enterprise Tier</Badge>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            PESTLE Analysis Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            PESTLE Analysis is a strategic planning tool that examines external factors affecting your business 
            across six key categories. Our AI-powered system generates comprehensive reports using your company 
            profile and existing analyst insights.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Key Benefits</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-500" />
                  Strategic planning support
                </li>
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Risk identification and mitigation
                </li>
                <li className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-purple-500" />
                  Market opportunity discovery
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-orange-500" />
                  AI-powered insights generation
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Analysis Components</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Political</Badge>
                <Badge variant="outline">Economic</Badge>
                <Badge variant="outline">Social</Badge>
                <Badge variant="outline">Technological</Badge>
                <Badge variant="outline">Legal</Badge>
                <Badge variant="outline">Environmental</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PESTLE Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding PESTLE Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Each category of PESTLE analysis examines different external factors that could impact your business strategy and operations.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-red-50 border-red-200">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Political Factors
                </h4>
                <p className="text-sm text-red-700 mb-2">Government policies, regulations, and political stability</p>
                <ul className="text-sm text-red-600 space-y-1">
                  <li>• Government stability and changes</li>
                  <li>• Tax policies and regulations</li>
                  <li>• Trade restrictions and tariffs</li>
                  <li>• Labor laws and employment regulations</li>
                  <li>• Political trends and electoral outcomes</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Economic Factors
                </h4>
                <p className="text-sm text-green-700 mb-2">Economic conditions and trends affecting business</p>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• GDP growth rates and economic cycles</li>
                  <li>• Interest rates and inflation</li>
                  <li>• Currency exchange rates</li>
                  <li>• Unemployment rates and labor costs</li>
                  <li>• Consumer spending patterns</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Social Factors
                </h4>
                <p className="text-sm text-blue-700 mb-2">Cultural trends and demographic changes</p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Population demographics and aging</li>
                  <li>• Cultural attitudes and lifestyle changes</li>
                  <li>• Education levels and skills availability</li>
                  <li>• Health consciousness and wellness trends</li>
                  <li>• Social media and communication patterns</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Technological Factors
                </h4>
                <p className="text-sm text-purple-700 mb-2">Technology developments and innovation trends</p>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• Automation and AI advancement</li>
                  <li>• Digital transformation trends</li>
                  <li>• R&D investment and innovation</li>
                  <li>• Technology adoption rates</li>
                  <li>• Cybersecurity and data protection</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Legal Factors
                </h4>
                <p className="text-sm text-yellow-700 mb-2">Laws, regulations, and compliance requirements</p>
                <ul className="text-sm text-yellow-600 space-y-1">
                  <li>• Industry-specific regulations</li>
                  <li>• Consumer protection laws</li>
                  <li>• Employment and health & safety laws</li>
                  <li>• Data protection and privacy regulations</li>
                  <li>• International trade laws</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-emerald-50 border-emerald-200">
                <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  Environmental Factors
                </h4>
                <p className="text-sm text-emerald-700 mb-2">Environmental concerns and sustainability trends</p>
                <ul className="text-sm text-emerald-600 space-y-1">
                  <li>• Climate change and weather patterns</li>
                  <li>• Environmental regulations and policies</li>
                  <li>• Sustainability and green initiatives</li>
                  <li>• Carbon footprint and emissions</li>
                  <li>• Renewable energy trends</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Generate */}
      <Card>
        <CardHeader>
          <CardTitle>Generating PESTLE Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Follow these steps to generate a comprehensive PESTLE analysis for your organization.</p>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Navigate to Analyst Insights</h4>
                <p className="text-sm text-gray-600">
                  Access the Analyst Insights section from the main navigation menu.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Click Generate PESTLE Analysis</h4>
                <p className="text-sm text-gray-600">
                  Look for the "Generate PESTLE Analysis" button at the top of the insights page.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">AI Processing</h4>
                <p className="text-sm text-gray-600">
                  The AI will analyze your company profile, existing insights, and current market data.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Review Generated Report</h4>
                <p className="text-sm text-gray-600">
                  The comprehensive PESTLE report will be generated and ready for review and export.
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">What You'll Get</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-700">
              <ul className="space-y-1">
                <li>• Detailed analysis for each PESTLE category</li>
                <li>• Industry-specific factor identification</li>
                <li>• Impact assessment and risk evaluation</li>
              </ul>
              <ul className="space-y-1">
                <li>• Strategic recommendations and insights</li>
                <li>• Opportunity identification</li>
                <li>• Stakeholder-ready professional report</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Using PESTLE Results */}
      <Card>
        <CardHeader>
          <CardTitle>Using PESTLE Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Learn how to effectively use your PESTLE analysis results for strategic planning and decision making.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Strategic Applications</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Strategic planning and goal setting</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Risk management and mitigation planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Market entry and expansion decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Investment and resource allocation</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600">Best Practices</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Update analysis regularly (quarterly/annually)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Share with leadership and planning teams</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Integrate findings into business plans</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Monitor key factors for changes</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Strategic Tip:</strong> PESTLE analysis is most effective when updated regularly and used 
          in conjunction with internal analysis tools like SWOT analysis. Consider generating new reports 
          quarterly or when significant external changes occur.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default PestleAnalysisGuide;