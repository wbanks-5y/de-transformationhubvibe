
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Mail, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PendingApprovalScreen = () => {
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-xl font-semibold">Approval Pending</CardTitle>
          <CardDescription>
            Your account is waiting for administrator approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              Thank you for registering! Your account has been created successfully, 
              but it requires approval from an administrator before you can access the platform.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">What happens next?</p>
                <p className="text-sm text-gray-600">
                  An administrator will review your request and you'll receive an email 
                  notification once your account is approved.
                </p>
              </div>
            </div>
          </div>

          {user?.email && (
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-600">
                Registered with: <span className="font-medium">{user.email}</span>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-xs text-gray-500 text-center">
              Need help? Contact your administrator or IT support team.
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

export default PendingApprovalScreen;
