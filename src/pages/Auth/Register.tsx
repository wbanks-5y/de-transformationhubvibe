
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import SecureAuthForm from '@/components/auth/SecureAuthForm';

export default function Register() {
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (data: { email: string; password: string; fullName?: string }) => {
    try {
      setIsSubmitting(true);
      await signUp(data.email, data.password, { 
        full_name: data.fullName || ''
      });
      
      // Navigate to root page after successful registration
      navigate('/', { state: { message: 'Please check your email to verify your account.' } });
    } catch (error: any) {
      // Error handling is done in the SecureAuthForm component
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check for confirmation message in the URL
  const confirmationMessage = searchParams.get('confirmed');
  
  // Show confirmation toast if coming from email confirmation
  useEffect(() => {
    if (confirmationMessage === 'true') {
      toast.success('Email confirmed successfully', {
        description: 'You can now log in to your account'
      });
    }
  }, [confirmationMessage]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-6">
            <img 
              src="/lovable-uploads/a6c0688c-3d7c-4c2c-adb3-e41170f23cb4.png" 
              alt="5Y Connect Logo" 
              className="h-8 w-auto mr-2"
            />
            <span className="text-2xl font-bold">5Y Transformation Hub</span>
          </div>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <SecureAuthForm 
            mode="register"
            onSubmit={handleRegister}
            isLoading={loading || isSubmitting}
          />
        </CardContent>
        <CardFooter className="flex flex-col">
          <Separator className="my-4" />
          <p className="text-center text-sm text-muted-foreground mt-2">
            Already have an account?{" "}
            <Link to="/" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
