import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Clock, Mail, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [debugInfo, setDebugInfo] = useState('');

  // Add error boundary for useAuth
  let resetPassword, lastResetTime, canRequestReset;
  try {
    const auth = useAuth();
    resetPassword = auth.resetPassword;
    lastResetTime = auth.lastResetTime;
    canRequestReset = auth.canRequestReset;
  } catch (err) {
    console.error('Auth context error:', err);
    setError('Authentication system not available. Please refresh the page.');
  }

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (lastResetTime && !canRequestReset) {
      const updateCountdown = () => {
        const timeLeft = Math.ceil((60000 - (Date.now() - lastResetTime)) / 1000);
        if (timeLeft > 0) {
          setCountdown(timeLeft);
        } else {
          setCountdown(0);
          clearInterval(interval);
        }
      };

      updateCountdown();
      interval = setInterval(updateCountdown, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [lastResetTime, canRequestReset]);

  // Debug info effect
  useEffect(() => {
    if (lastResetTime) {
      const timeSinceLastReset = Date.now() - lastResetTime;
      const info = `Last reset: ${new Date(lastResetTime).toLocaleString()}, Time since: ${Math.floor(timeSinceLastReset / 1000)}s, Can request: ${canRequestReset}`;
      setDebugInfo(info);
      console.log('Debug info:', info);
    }
  }, [lastResetTime, canRequestReset]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted:', {
      email,
      canRequestReset,
      countdown,
      lastResetTime: lastResetTime ? new Date(lastResetTime).toLocaleString() : 'none'
    });
    
    if (!resetPassword) {
      setError('Reset password function not available. Please refresh the page.');
      return;
    }

    if (!canRequestReset) {
      const errorMsg = `Please wait ${countdown} seconds before requesting another password reset.`;
      setError(errorMsg);
      console.log('Client-side block:', errorMsg);
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('Attempting to send reset email to:', email);
      await resetPassword(email);
      console.log('Reset email sent successfully');
      setIsSubmitted(true);
      toast.success('Password reset email sent!');
    } catch (error: any) {
      console.error('Password reset request failed:', {
        error: error?.message,
        type: typeof error,
        stack: error?.stack
      });
      
      const errorMessage = error?.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      
      // Don't show toast for rate limit errors as they're handled in the UI
      if (!errorMessage.includes('rate limit') && !errorMessage.includes('wait')) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearRateLimit = () => {
    localStorage.removeItem('password_reset_last_time');
    window.location.reload();
  };

  const isButtonDisabled = isLoading || !email.trim() || !canRequestReset;

  if (error && !resetPassword) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-red-600">System Error</CardTitle>
            <CardDescription className="text-center">
              There's an issue with the authentication system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <div className="mt-4 text-center">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/bffb888e-1eed-499e-aa66-2045b6c73f93.png" 
              alt="5Y Transformation Hub Logo" 
              className="h-12 w-auto"
            />
          </div>
          <CardTitle className="text-2xl text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            {isSubmitted 
              ? "Check your email for a link to reset your password." 
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="border-red-200 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Debug Info for troubleshooting */}
          {debugInfo && (
            <Alert className="border-blue-200 bg-blue-50 mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-mono">
                Debug: {debugInfo}
                <Button
                  onClick={handleClearRateLimit}
                  variant="outline"
                  size="sm"
                  className="ml-2 h-6 text-xs"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Rate Limit Warning */}
          {!canRequestReset && countdown > 0 && (
            <Alert className="border-yellow-200 bg-yellow-50 mb-4">
              <Clock className="h-4 w-4" />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Please wait before requesting another reset</span>
                  <span className="font-mono font-bold">{countdown}s</span>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!isSubmitted ? (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isButtonDisabled}
              >
                {isLoading ? (
                  'Sending...'
                ) : !canRequestReset ? (
                  `Wait ${countdown}s`
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              {lastResetTime && canRequestReset && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    Last reset request: {new Date(lastResetTime).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-4 text-center py-4">
              <div className="flex justify-center mb-4">
                <Mail className="h-12 w-12 text-green-600" />
              </div>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                <h4 className="font-medium text-blue-900 mb-2">Next steps:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Check your email inbox</li>
                  <li>• Look in your spam/junk folder</li>
                  <li>• Click the reset link in the email</li>
                  <li>• The link expires in 1 hour</li>
                </ul>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsSubmitted(false);
                  setError('');
                }}
                className="mx-auto mt-4"
                disabled={!canRequestReset}
              >
                {!canRequestReset ? `Try again in ${countdown}s` : 'Try another email'}
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="my-4" />
          <Link 
            to="/login" 
            className="flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to log in
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
