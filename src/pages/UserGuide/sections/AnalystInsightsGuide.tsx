
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, TrendingUp, Search, Filter, ExternalLink, Tag, Info } from 'lucide-react';

const AnalystInsightsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Analyst Insights</h1>
        <p className="text-gray-600">AI-powered market intelligence and external data analysis for strategic decision making.</p>
        <Badge className="mt-2">Enterprise Tier</Badge>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Analyst Insights Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Analyst Insights provides curated, AI-powered market intelligence from external sources to help you 
            make informed strategic decisions based on market trends, economic indicators, and competitive intelligence.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Key Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Market trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-green-500" />
                  Intelligent search and filtering
                </li>
                <li className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-purple-500" />
                  Categorized insights
                </li>
                <li className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4 text-orange-500" />
                  Source attribution and links
                </li>
                <li className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-500" />
                  PESTLE Analysis generation
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Insight Categories</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Market Analysis</Badge>
                <Badge variant="outline">Economic Indicators</Badge>
                <Badge variant="outline">Political Impact</Badge>
                <Badge variant="outline">Operational Trends</Badge>
                <Badge variant="outline">Technology</Badge>
                <Badge variant="outline">Regulatory</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PESTLE Analysis Generation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            PESTLE Analysis Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Generate comprehensive PESTLE (Political, Economic, Social, Technological, Legal, Environmental) 
            analysis reports using AI and existing analyst insights to support strategic planning.
          </p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">How PESTLE Generation Works</h4>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">1</span>
                  </div>
                  <div>
                    <h5 className="font-medium">Data Collection</h5>
                    <p className="text-sm text-gray-600">
                      AI analyzes your company profile, existing analyst insights, and current market data.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">2</span>
                  </div>
                  <div>
                    <h5 className="font-medium">AI Analysis</h5>
                    <p className="text-sm text-gray-600">
                      Advanced AI processes the data to identify relevant factors across all PESTLE categories.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-600">3</span>
                  </div>
                  <div>
                    <h5 className="font-medium">Report Generation</h5>
                    <p className="text-sm text-gray-600">
                      Creates a structured PESTLE report with strategic recommendations tailored to your business.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">What's Included</h4>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Political factors affecting your industry</li>
                  <li>• Economic trends and indicators</li>
                  <li>• Social and demographic changes</li>
                  <li>• Technological developments</li>
                  <li>• Legal and regulatory updates</li>
                  <li>• Environmental considerations</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Strategic Value</h4>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• Comprehensive external environment view</li>
                  <li>• Strategic planning support</li>
                  <li>• Risk identification and mitigation</li>
                  <li>• Opportunity discovery</li>
                  <li>• Evidence-based decision making</li>
                  <li>• Stakeholder presentation ready</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insight Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding Insight Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Insights are organized into categories to help you focus on the most relevant information for your business context.</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">Market Analysis</h4>
                <p className="text-sm text-blue-700 mb-2">Industry trends, competitive landscape, and market opportunities</p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• Industry growth rates</li>
                  <li>• Competitive positioning</li>
                  <li>• Customer behavior trends</li>
                  <li>• Market share analysis</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-green-50 border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">Economic Indicators</h4>
                <p className="text-sm text-green-700 mb-2">Macroeconomic factors affecting business performance</p>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• GDP growth rates</li>
                  <li>• Interest rate changes</li>
                  <li>• Inflation indicators</li>
                  <li>• Currency fluctuations</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
                <h4 className="font-semibold text-purple-800 mb-2">Political Impact</h4>
                <p className="text-sm text-purple-700 mb-2">Political developments and policy changes</p>
                <ul className="text-sm text-purple-600 space-y-1">
                  <li>• Regulatory changes</li>
                  <li>• Trade policies</li>
                  <li>• Government initiatives</li>
                  <li>• Political stability</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4 bg-orange-50 border-orange-200">
                <h4 className="font-semibold text-orange-800 mb-2">Operational Trends</h4>
                <p className="text-sm text-orange-700 mb-2">Business operations and technology trends</p>
                <ul className="text-sm text-orange-600 space-y-1">
                  <li>• Supply chain developments</li>
                  <li>• Technology adoption</li>
                  <li>• Workforce trends</li>
                  <li>• Operational efficiency</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Using Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search and Filtering
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Find relevant insights quickly using powerful search and filtering capabilities.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Search Functionality</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">Search Types</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• <strong>Keyword Search:</strong> Find insights by topic</li>
                    <li>• <strong>Semantic Search:</strong> AI-powered context understanding</li>
                    <li>• <strong>Tag Search:</strong> Search by predefined tags</li>
                    <li>• <strong>Source Search:</strong> Find insights from specific sources</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Search Tips</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Use specific industry terms</li>
                    <li>• Combine multiple keywords</li>
                    <li>• Try different search variations</li>
                    <li>• Use quotation marks for exact phrases</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Filter Options</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">By Category</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Market</li>
                    <li>• Economic</li>
                    <li>• Political</li>
                    <li>• Operational</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">By Impact Level</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• High Impact</li>
                    <li>• Medium Impact</li>
                    <li>• Low Impact</li>
                    <li>• Neutral</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">By Time Period</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Last 24 hours</li>
                    <li>• Last week</li>
                    <li>• Last month</li>
                    <li>• Custom range</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Understanding Impact Levels */}
      <Card>
        <CardHeader>
          <CardTitle>Impact Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Each insight is assessed for its potential impact on business operations and strategy.</p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-red-50 border-red-200">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div>
                <h4 className="font-semibold text-red-800">High Impact</h4>
                <p className="text-sm text-red-700">Insights that could significantly affect business performance or strategy</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg bg-yellow-50 border-yellow-200">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
              <div>
                <h4 className="font-semibold text-yellow-800">Medium Impact</h4>
                <p className="text-sm text-yellow-700">Moderately important insights worth monitoring</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 border rounded-lg bg-blue-50 border-blue-200">
              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              <div>
                <h4 className="font-semibold text-blue-800">Low Impact</h4>
                <p className="text-sm text-blue-700">General market information for awareness</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Working with Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Working with Insights & Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Review Daily Insights</h4>
                <p className="text-sm text-gray-600">
                  Start each day by reviewing new high-impact insights relevant to your industry.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Generate PESTLE Analysis</h4>
                <p className="text-sm text-gray-600">
                  Use the "Generate PESTLE Analysis" button to create comprehensive strategic reports.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Filter by Relevance</h4>
                <p className="text-sm text-gray-600">
                  Use category and impact filters to focus on insights most relevant to your business.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Dive Deeper</h4>
                <p className="text-sm text-gray-600">
                  Click on insight sources to read full reports and analyses from original publishers.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">5</span>
              </div>
              <div>
                <h4 className="font-semibold">Apply to Strategy</h4>
                <p className="text-sm text-gray-600">
                  Consider how insights might affect your strategic planning and risk assessments.
                </p>
              </div>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-purple-50 border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">Admin Workflow (Admin Users Only)</h4>
            <div className="text-sm text-purple-700 space-y-2">
              <p><strong>Insight Approval Process:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                <li>New insights appear in "Pending Approval" section</li>
                <li>Review insight content, source, and impact assessment</li>
                <li>Approve high-quality insights to make them visible to all users</li>
                <li>Reject low-quality insights (automatically deleted)</li>
                <li>Edit insights before approval if needed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle>Best Practices</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Effective Usage</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Review insights regularly (daily or weekly)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Generate PESTLE reports for strategic planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Focus on high-impact insights first</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Verify information from original sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Share relevant insights with your team</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-orange-600">Integration Tips</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Link insights to strategic objectives</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Update risk assessments based on insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Consider insights in scenario planning</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <span>Use insights for competitive analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Intelligence Tip:</strong> Analyst Insights work best when combined with your internal data. 
          Use external insights to validate assumptions and identify blind spots in your strategic planning.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AnalystInsightsGuide;
