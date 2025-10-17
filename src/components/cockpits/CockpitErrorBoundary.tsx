
import React, { Component, ReactNode } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  cockpitType?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export class CockpitErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('🚨 Cockpit Error Boundary caught error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      cockpitType: this.props.cockpitType
    });
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    console.log('🔄 Retrying after error boundary catch...');
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    
    // Clear any cached data and reload
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="container mx-auto p-4 lg:p-8">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <div className="flex flex-col space-y-2">
                <span>
                  Something went wrong loading the {this.props.cockpitType || 'cockpit'} cockpit.
                </span>
                {this.state.error?.message && (
                  <span className="text-sm text-gray-600">
                    Error: {this.state.error.message}
                  </span>
                )}
                <span className="text-xs text-gray-500">
                  This error has been logged for debugging.
                </span>
              </div>
              <Button
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="ml-4 flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}
