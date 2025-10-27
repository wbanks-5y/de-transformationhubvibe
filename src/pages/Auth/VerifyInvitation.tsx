import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const VerifyInvitation = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAndRedirect = async () => {
      try {
        // Extract parameters from URL
        const token = searchParams.get('code') || searchParams.get('token');
        const org = searchParams.get('org');
        const email = searchParams.get('email');

        console.log('VerifyInvitation - params:', { 
          token: !!token, 
          org, 
          email 
        });

        // Validate all required parameters are present
        if (!token) {
          setError('Invalid invitation link: missing token');
          return;
        }

        if (!org) {
          setError('Invalid invitation link: missing organization');
          return;
        }

        if (!email) {
          setError('Invalid invitation link: missing email');
          return;
        }

        // Redirect to set-password page with all parameters
        console.log('Redirecting to set-password with params:', { token, org, email });
        navigate(`/set-password?token=${token}&org=${org}&email=${encodeURIComponent(email)}`);

      } catch (err: any) {
        console.error('Verification error:', err);
        setError(err.message || 'An error occurred while verifying your invitation');
      }
    };

    verifyAndRedirect();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <CardTitle>Verification Error</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <CardTitle>Verifying Invitation</CardTitle>
          <CardDescription>
            Please wait while we verify your invitation and redirect you...
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default VerifyInvitation;
