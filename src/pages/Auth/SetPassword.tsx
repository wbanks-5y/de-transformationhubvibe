
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const SetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const validateInvitation = async () => {
      try {
        // Get the current session to see if user is already authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Check if user has confirmed email but hasn't set password
          if (session.user.email_confirmed_at && !session.user.user_metadata?.password_set) {
            setEmail(session.user.email);
            setIsValidating(false);
            return;
          }
          
          // If user is fully set up, redirect to home
          navigate('/');
          return;
        }

        // Check for access_token and refresh_token in URL (from email link)
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        
        if (accessToken && refreshToken) {
          // Set the session with the tokens from the URL
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            setError('Invalid or expired invitation link. Please request a new invitation.');
            setIsValidating(false);
            return;
          }
          
          if (data.user) {
            setEmail(data.user.email);
            setIsValidating(false);
            return;
          }
        }
        
        // If no valid session or tokens, redirect to login
        setError('No valid invitation found. Please use the invitation link from your email.');
        setIsValidating(false);
      } catch (err) {
        console.error('Error validating invitation:', err);
        setError('An error occurred while validating your invitation.');
        setIsValidating(false);
      }
    };

    validateInvitation();
  }, [navigate, searchParams]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
        data: { password_set: true }
      });

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Ensure the user profile exists and is properly set up
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Check if profile exists, create if it doesn't
        const { data: existingProfile, error: fetchError } = await supabase
          .from('profiles')
          .select()
          .eq('id', user.id)
          .single();
          
        if (fetchError && fetchError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || user.email || '',
              updated_at: new Date().toISOString(),
              status: 'pending' // Start as pending until admin approval
            });
            
          if (insertError) {
            console.error('Error creating profile:', insertError);
            // Don't block the flow for profile creation errors
          }
        }
      }

      toast.success('Password set successfully! Please wait for admin approval to access the system.');
      navigate('/login?message=password_set');
    } catch (err: any) {
      console.error('Error setting password:', err);
      setError(err.message || 'An error occurred while setting your password');
    } finally {
      setLoading(false);
    }
  };

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Validating Invitation</CardTitle>
            <CardDescription>Please wait while we validate your invitation...</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Set Your Password</CardTitle>
          <CardDescription>
            Welcome! Please set a password for your account{email && `: ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSetPassword} className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Setting Password...' : 'Set Password'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              After setting your password, an administrator will need to approve your account before you can access the system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;
