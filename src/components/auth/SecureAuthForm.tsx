
import React, { useState } from 'react';
import { useInputValidation } from '@/hooks/auth/use-input-validation';
import { useSecureSession } from '@/hooks/auth/use-secure-session';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface SecureAuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: { email: string; password: string; fullName?: string }) => Promise<void>;
  isLoading: boolean;
}

const SecureAuthForm = ({ mode, onSubmit, isLoading }: SecureAuthFormProps) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState(false);
  const { updateSessionActivity } = useSecureSession();
  const { 
    validateEmail, 
    validatePassword, 
    validateName, 
    validateAndSanitize,
    isValidating 
  } = useInputValidation();

  const validateForm = async () => {
    const newErrors: Record<string, string[]> = {};

    // Validate email
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.errors;
    }

    // Password validation - different rules for login vs register
    if (mode === 'login') {
      // For login, only check if password is provided
      if (!formData.password) {
        newErrors.password = ['Password is required'];
      }
    } else {
      // For registration, apply full password complexity validation
      const passwordValidation = await validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors;
      }
    }

    // Validate full name for registration
    if (mode === 'register' && formData.fullName.trim()) {
      const nameValidation = validateName(formData.fullName, 'Full name');
      if (!nameValidation.isValid) {
        newErrors.fullName = nameValidation.errors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateSessionActivity();

    const isValid = await validateForm();
    if (!isValid) return;

    try {
      // Sanitize inputs before submission
      const sanitizedData = {
        email: validateAndSanitize(formData.email, 254),
        password: formData.password, // Don't sanitize password
        fullName: mode === 'register' ? validateAndSanitize(formData.fullName, 100) : undefined
      };

      await onSubmit(sanitizedData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear errors for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: [] }));
    }
  };

  const renderFieldErrors = (field: string) => {
    if (!errors[field] || errors[field].length === 0) return null;
    
    return (
      <div className="mt-1">
        {errors[field].map((error, index) => (
          <Alert key={index} variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {mode === 'register' && (
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name (Optional)
          </label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            placeholder="Enter your full name"
            maxLength={100}
          />
          {renderFieldErrors('fullName')}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address *
        </label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          placeholder="Enter your email"
          required
          maxLength={254}
          autoComplete="email"
        />
        {renderFieldErrors('email')}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          Password *
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            placeholder="Enter your password"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {renderFieldErrors('password')}
      </div>

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isLoading || (mode === 'register' && isValidating)}
      >
        {isLoading || (mode === 'register' && isValidating) ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
};

export default SecureAuthForm;
