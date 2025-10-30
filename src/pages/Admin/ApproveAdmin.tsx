
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { assignAdminRoleByEmail, isUserAdmin } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ApproveAdmin = () => {
  const [email, setEmail] = useState<string>('psaxton@5ytechnology.com');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<string | null>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleApproveAdmin = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }
    
    try {
      setIsLoading(true);
      setResult(null);
      
      const success = await assignAdminRoleByEmail(email);
      
      if (success) {
        setResult('Success! User has been made an admin.');
        toast.success("Admin role assigned successfully");
        
        // If the approved user is the current user, invalidate admin check queries
        if (user?.email?.toLowerCase() === email.toLowerCase()) {
          queryClient.invalidateQueries({ queryKey: ['admin-check'] });
          queryClient.invalidateQueries({ queryKey: ['secure-admin-check'] });
          toast.success("Your session has been refreshed with new permissions");
        }
      } else {
        setResult('Failed to assign admin role. Check console for errors.');
        toast.error("Failed to assign admin role");
      }
    } catch (error: any) {
      console.error('Error approving admin:', error);
      setResult(`Error: ${error.message || 'Unknown error'}`);
      toast.error("An error occurred", {
        description: error.message || "Unknown error"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const checkCurrentUserAdmin = async () => {
    if (user) {
      const isAdmin = await isUserAdmin(user.id);
      if (isAdmin) {
        toast.success("You already have admin privileges");
        setResult('Current user already has admin privileges');
      }
    }
  };
  
  useEffect(() => {
    checkCurrentUserAdmin();
  }, [user]);

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Approve Admin User</CardTitle>
          <CardDescription>
            Give admin privileges to a user by email address
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email" 
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            {result && (
              <div className={`p-4 rounded-md text-sm ${result.includes('Success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {result}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleApproveAdmin}
            disabled={isLoading || !email}
            className="w-full"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> Processing...
              </>
            ) : (
              'Approve as Admin'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ApproveAdmin;
