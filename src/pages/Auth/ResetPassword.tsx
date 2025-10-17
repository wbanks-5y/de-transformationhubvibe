
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [validationError, setValidationError] = useState('');

  // Password strength validation
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (pwd: string) => pwd.length >= 8 },
    { label: 'One uppercase letter', test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'One lowercase letter', test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'One number', test: (pwd: string) => /\d/.test(pwd) },
    { label: 'One special character', test: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.test(password));
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  useEffect(() => {
    const validateResetToken = async () => {
      try {
        console.log('Starting password reset token validation...');
        
        // Get URL parameters
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const type = searchParams.get('type');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        console.log('Reset password URL parameters:', {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type,
          error,
          errorDescription,
          fullURL: window.location.href
        });

        // Check for URL errors first
        if (error) {
          console.error('URL contains error parameter:', error, errorDescription);
          setValidationError(`Authentication error: ${errorDescription || error}`);
          setIsValidating(false);
          return;
        }

        // Validate required parameters
        if (type !== 'recovery') {
          console.error('Invalid or missing type parameter:', type);
          setValidationError('Invalid password reset link. Please request a new password reset.');
          setIsValidating(false);
          return;
        }

        if (!accessToken || !refreshToken) {
          console.error('Missing required tokens:', { accessToken: !!accessToken, refreshToken: !!refreshToken });
          setValidationError('Invalid password reset link. Required authentication tokens are missing.');
          setIsValidating(false);
          return;
        }

        // Attempt to set the session with the provided tokens
        console.log('Setting session with provided tokens...');
        const { data, error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });

        if (sessionError) {
          console.error('Session error:', sessionError);
          
          // Provide specific error messages based on the error type
          if (sessionError.message.includes('expired')) {
            setValidationError('This password reset link has expired. Please request a new password reset.');
          } else if (sessionError.message.includes('invalid')) {
            setValidationError('This password reset link is invalid. Please request a new password reset.');
          } else {
            setValidationError(`Authentication error: ${sessionError.message}`);
          }
          setIsValidating(false);
          return;
        }

        if (!data.session) {
          console.error('No session created despite no error');
          setValidationError('Failed to authenticate with the reset link. Please request a new password reset.');
          setIsValidating(false);
          return;
        }

        console.log('Session established successfully for password reset');
        setIsValidating(false);

      } catch (err) {
        console.error('Unexpected error during token validation:', err);
        setValidationError('An unexpected error occurred. Please try again or request a new password reset.');
        setIsValidating(false);
      }
    };

    validateResetToken();
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements.');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to update user password...');
      
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        console.error('Password update error:', updateError);
        
        // Provide user-friendly error messages
        if (updateError.message.includes('session')) {
          setError('Your session has expired. Please request a new password reset.');
        } else {
          setError(updateError.message || 'Failed to update password. Please try again.');
        }
        return;
      }

      console.log('Password updated successfully');
      toast.success('Password updated successfully!');
      
      // Sign out the user to ensure they use the new password
      await supabase.auth.signOut();
      
      // Redirect to root with success message
      navigate('/', { 
        state: { 
          message: 'Your password has been updated successfully. Please log in with your new password.',
          type: 'success'
        }
      });

    } catch (err) {
      console.error('Unexpected error during password update:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show validation loading state
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show validation error state
  if (validationError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600 flex items-center justify-center gap-2">
              <XCircle className="h-5 w-5" />
              Reset Link Invalid
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Alert className="border-red-200">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
            
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/forgot-password')}
                className="w-full"
              >
                Request New Reset Link
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="w-full"
              >
                Back to Login
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 mt-4">
              <p>Common reasons for this error:</p>
              <ul className="list-disc list-inside text-left space-y-1">
                <li>The reset link has expired (links expire after 1 hour)</li>
                <li>The link has already been used</li>
                <li>The link was copied incorrectly</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show password reset form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Reset Your Password</CardTitle>
          <p className="text-center text-gray-600 text-sm">
            Enter your new password below
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {error && (
              <Alert className="border-red-200">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {password && (
              <div className="space-y-2">
                <Label className="text-sm font-medium">Password Requirements</Label>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      {req.test(password) ? (
                        <CheckCircle className="h-3 w-3 text-green-500" />
                      ) : (
                        <XCircle className="h-3 w-3 text-red-500" />
                      )}
                      <span className={req.test(password) ? 'text-green-700' : 'text-red-700'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {confirmPassword && !doPasswordsMatch && (
                <p className="text-xs text-red-600">Passwords do not match</p>
              )}
              {confirmPassword && doPasswordsMatch && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Passwords match
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !isPasswordValid || !doPasswordsMatch}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating Password...
                </>
              ) : (
                'Update Password'
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
