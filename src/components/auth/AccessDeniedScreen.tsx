
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const AccessDeniedScreen = () => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-xl font-semibold">Access Denied</CardTitle>
          <CardDescription>
            Your account access has been restricted
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-red-50 p-4">
            <p className="text-sm text-red-800">
              Unfortunately, your access request has been declined. 
              Your account does not have permission to access this platform.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Need to appeal this decision?</p>
                <p className="text-sm text-gray-600">
                  Please contact your administrator or IT support team to discuss your access requirements.
                </p>
              </div>
            </div>
          </div>

          {user?.email && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-600">
                Account: <span className="font-medium">{user.email}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-center">
              If you believe this is an error, please contact your administrator.
            </p>
            
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="w-full flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessDeniedScreen;
