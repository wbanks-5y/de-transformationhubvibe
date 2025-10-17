import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, MessageCircle, BarChart3, Search, Lightbulb, Zap, Info, TrendingUp } from 'lucide-react';

const MylesGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Myles AI Assistant</h1>
        <p className="text-gray-600">Your conversational business intelligence partner for data-driven insights and analysis.</p>
        <Badge className="mt-2">Enterprise Tier</Badge>
      </div>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Meet Myles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Myles is your AI-powered business intelligence assistant that helps you understand your data, 
            discover insights, and make informed decisions through natural language conversations.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Core Capabilities</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-blue-500" />
                  Natural language queries
                </li>
                <li className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-green-500" />
                  Data analysis and visualization
                </li>
                <li className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Insight generation
                </li>
                <li className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-purple-500" />
                  Pattern recognition
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">What Myles Can Help With</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Data Analysis</Badge>
                <Badge variant="outline">Trend Identification</Badge>
                <Badge variant="outline">Performance Review</Badge>
                <Badge variant="outline">Recommendations</Badge>
                <Badge variant="outline">Forecasting</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* How to Interact */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            How to Interact with Myles
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Myles understands natural language, so you can ask questions just like you would to a human analyst.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Sample Questions You Can Ask</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium mb-2">Performance Analysis</h5>
                  <ul className="space-y-1 text-blue-700">
                    <li>• "How are our sales performing this quarter?"</li>
                    <li>• "What's driving our revenue growth?"</li>
                    <li>• "Which KPIs are underperforming?"</li>
                    <li>• "Show me trends in customer satisfaction"</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-2">Insights & Recommendations</h5>
                  <ul className="space-y-1 text-blue-700">
                    <li>• "What patterns do you see in our data?"</li>
                    <li>• "How can we improve operational efficiency?"</li>
                    <li>• "What opportunities should we focus on?"</li>
                    <li>• "Predict next month's performance"</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Conversation Tips</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium text-green-600">Do's</h5>
                  <ul className="space-y-1">
                    <li>• Be specific about time periods</li>
                    <li>• Ask follow-up questions</li>
                    <li>• Request explanations for insights</li>
                    <li>• Ask for chart visualizations</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-orange-600">For Better Results</h5>
                  <ul className="space-y-1">
                    <li>• Provide context for questions</li>
                    <li>• Specify metrics you're interested in</li>
                    <li>• Ask for actionable recommendations</li>
                    <li>• Request data validation when needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Types of Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Types of Analysis Myles Can Perform
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-500" />
                  Descriptive Analysis
                </h4>
                <p className="text-sm text-gray-600 mb-2">"What happened?"</p>
                <ul className="text-sm space-y-1">
                  <li>• Historical performance summaries</li>
                  <li>• Trend identification over time</li>
                  <li>• Comparative analysis between periods</li>
                  <li>• Key performance indicator tracking</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Search className="h-4 w-4 text-green-500" />
                  Diagnostic Analysis
                </h4>
                <p className="text-sm text-gray-600 mb-2">"Why did it happen?"</p>
                <ul className="text-sm space-y-1">
                  <li>• Root cause analysis</li>
                  <li>• Correlation identification</li>
                  <li>• Anomaly detection</li>
                  <li>• Performance driver analysis</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  Predictive Analysis
                </h4>
                <p className="text-sm text-gray-600 mb-2">"What might happen?"</p>
                <ul className="text-sm space-y-1">
                  <li>• Trend forecasting</li>
                  <li>• Scenario modeling</li>
                  <li>• Risk probability assessment</li>
                  <li>• Performance projections</li>
                </ul>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-500" />
                  Prescriptive Analysis
                </h4>
                <p className="text-sm text-gray-600 mb-2">"What should we do?"</p>
                <ul className="text-sm space-y-1">
                  <li>• Strategic recommendations</li>
                  <li>• Optimization suggestions</li>
                  <li>• Action plan development</li>
                  <li>• Priority setting guidance</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chart and Visualization Requests */}
      <Card>
        <CardHeader>
          <CardTitle>Requesting Charts and Visualizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Myles can create various visualizations to help you understand your data better.</p>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Chart Types Available</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">Time Series</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Line charts</li>
                    <li>• Area charts</li>
                    <li>• Bar charts over time</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Comparative</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Bar charts</li>
                    <li>• Column charts</li>
                    <li>• Horizontal bars</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Composition</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Pie charts</li>
                    <li>• Donut charts</li>
                    <li>• Stacked bars</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">How to Request Charts</h4>
              <div className="space-y-2">
                <p className="text-sm font-medium">Example Requests:</p>
                <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                  <p>• "Show me a line chart of sales over the last 6 months"</p>
                  <p>• "Create a bar chart comparing this year's performance to last year"</p>
                  <p>• "Generate a pie chart showing revenue by product category"</p>
                  <p>• "Plot customer satisfaction trends with a trend line"</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Features */}
      <Card>
        <CardHeader>
          <CardTitle>Advanced Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Contextual Understanding</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Remembers conversation context</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Understands business terminology</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Maintains conversation threads</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Provides relevant follow-up suggestions</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Data Integration</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Accesses all your cockpit data</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Combines multiple data sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Real-time data analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Historical data comparison</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Started */}
      <Card>
        <CardHeader>
          <CardTitle>Getting Started with Myles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">1</span>
              </div>
              <div>
                <h4 className="font-semibold">Start with Simple Questions</h4>
                <p className="text-sm text-gray-600">
                  Begin with basic questions about your data to get comfortable with Myles' capabilities.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">2</span>
              </div>
              <div>
                <h4 className="font-semibold">Ask Follow-up Questions</h4>
                <p className="text-sm text-gray-600">
                  Dive deeper into insights by asking "why" and "how" questions to understand the analysis better.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">3</span>
              </div>
              <div>
                <h4 className="font-semibold">Request Visualizations</h4>
                <p className="text-sm text-gray-600">
                  Ask Myles to create charts and graphs to visualize the data and insights.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">4</span>
              </div>
              <div>
                <h4 className="font-semibold">Seek Recommendations</h4>
                <p className="text-sm text-gray-600">
                  Ask for actionable recommendations based on the analysis and insights provided.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>AI Tip:</strong> Myles learns from your questions and preferences over time. 
          The more you interact, the better it becomes at providing relevant insights for your business context.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default MylesGuide;
