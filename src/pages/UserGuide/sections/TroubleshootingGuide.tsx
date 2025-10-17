
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, HelpCircle, RefreshCw, Wifi, Database, Key, Info } from 'lucide-react';

const TroubleshootingGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Troubleshooting & Support</h1>
        <p className="text-gray-600">Common issues, solutions, and best practices to keep your platform running smoothly.</p>
      </div>

      {/* Common Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 bg-red-50 border-red-200">
              <div className="flex items-start gap-3">
                <Wifi className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-red-800">Login and Authentication Issues</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <p className="font-medium text-red-700">Problem: Cannot log in to the platform</p>
                      <ul className="mt-1 space-y-1 text-red-600 ml-4">
                        <li>• Check email and password for typos</li>
                        <li>• Ensure account has been activated</li>
                        <li>• Try password reset if needed</li>
                        <li>• Clear browser cache and cookies</li>
                        <li>• Check with admin about account status</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-3">
                <Database className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800">Data Loading Issues</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <p className="font-medium text-yellow-700">Problem: Charts or KPIs not loading data</p>
                      <ul className="mt-1 space-y-1 text-yellow-600 ml-4">
                        <li>• Refresh the page or specific component</li>
                        <li>• Check internet connection stability</li>
                        <li>• Verify data source connections (Admin)</li>
                        <li>• Check if data sources have recent data</li>
                        <li>• Review query configurations (Admin)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800">Performance Issues</h4>
                  <div className="mt-3 space-y-2 text-sm">
                    <div>
                      <p className="font-medium text-blue-700">Problem: Slow loading or unresponsive interface</p>
                      <ul className="mt-1 space-y-1 text-blue-600 ml-4">
                        <li>• Close unused browser tabs</li>
                        <li>• Clear browser cache</li>
                        <li>• Check system resources (CPU, Memory)</li>
                        <li>• Try a different browser</li>
                        <li>• Check network connectivity</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Platform-Specific Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Platform-Specific Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Cockpit Issues</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">KPIs showing "No Data"</p>
                    <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                      <li>• Check data source connections</li>
                      <li>• Verify query mappings</li>
                      <li>• Confirm data exists for selected time period</li>
                      <li>• Review KPI configuration</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Charts not displaying correctly</p>
                    <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                      <li>• Check chart type compatibility with data</li>
                      <li>• Verify data format requirements</li>
                      <li>• Try refreshing the specific chart</li>
                      <li>• Check browser compatibility</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Process Intelligence Issues</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Process maps not loading</p>
                    <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                      <li>• Ensure process data has been uploaded</li>
                      <li>• Check process step configurations</li>
                      <li>• Verify process is active</li>
                      <li>• Try selecting a different process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Business Health Issues</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Strategy map showing incorrect colors</p>
                    <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                      <li>• Update objective health scores</li>
                      <li>• Check health calculation periods</li>
                      <li>• Verify objective targets are set</li>
                      <li>• Review health threshold settings</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium">Initiative progress not updating</p>
                    <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                      <li>• Ensure progress percentages are updated</li>
                      <li>• Check milestone completion status</li>
                      <li>• Verify initiative is active</li>
                      <li>• Review calculation formulas</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">AI Features Issues</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Myles not responding</p>
                    <ul className="mt-1 space-y-1 text-gray-600 ml-4">
                      <li>• Check internet connection</li>
                      <li>• Verify API key configuration</li>
                      <li>• Try rephrasing your question</li>
                      <li>• Clear chat history and restart</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Browser Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle>Browser Compatibility & Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-green-600">Supported Browsers</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Google Chrome</span>
                  <Badge variant="outline">Recommended</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Mozilla Firefox</span>
                  <Badge variant="outline">Supported</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Microsoft Edge</span>
                  <Badge variant="outline">Supported</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Safari</span>
                  <Badge variant="outline">Supported</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-600">System Requirements</h4>
              <ul className="text-sm space-y-1">
                <li>• <strong>RAM:</strong> Minimum 4GB, Recommended 8GB</li>
                <li>• <strong>Internet:</strong> Stable broadband connection</li>
                <li>• <strong>Screen:</strong> Minimum 1024x768 resolution</li>
                <li>• <strong>JavaScript:</strong> Must be enabled</li>
                <li>• <strong>Cookies:</strong> Must be enabled</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Mobile-Specific Issues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Common Mobile Issues</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h5 className="font-medium">Touch Navigation Problems</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Ensure screen is clean</li>
                    <li>• Try landscape orientation</li>
                    <li>• Use pinch-to-zoom for small elements</li>
                    <li>• Restart the browser app</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium">Performance on Mobile</h5>
                  <ul className="space-y-1 mt-1">
                    <li>• Close other running apps</li>
                    <li>• Ensure strong WiFi/cellular signal</li>
                    <li>• Clear browser cache</li>
                    <li>• Restart device if needed</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Admin-Level Troubleshooting
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Database Connection Issues</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Symptoms:</strong> Multiple users reporting "No Data" across different cockpits</p>
                <p><strong>Solutions:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Check database server status</li>
                  <li>• Verify connection credentials</li>
                  <li>• Test network connectivity to database</li>
                  <li>• Review query execution logs</li>
                  <li>• Check for database locks or maintenance</li>
                </ul>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-semibold mb-2">User Access Issues</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Symptoms:</strong> Users can't access certain features or see error messages</p>
                <p><strong>Solutions:</strong></p>
                <ul className="space-y-1 ml-4">
                  <li>• Check user tier assignments</li>
                  <li>• Verify account activation status</li>
                  <li>• Review role-based permissions</li>
                  <li>• Check for account expiration</li>
                  <li>• Audit recent permission changes</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Getting Help */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Getting Additional Help
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold">Before Contacting Support</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Try the solutions in this troubleshooting guide</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Check if the issue affects multiple users</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Note when the issue started occurring</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Document steps that reproduce the issue</span>
                </li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold">Support Information to Provide</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Browser type and version</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Operating system details</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Error messages (screenshots preferred)</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <span>Steps to reproduce the issue</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Quick Tip:</strong> Many issues can be resolved by clearing your browser cache and refreshing the page. 
          This is often the first step to try before more complex troubleshooting.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TroubleshootingGuide;
