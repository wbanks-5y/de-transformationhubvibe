
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const useInputValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  const validateEmail = (email: string): ValidationResult => {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      errors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    } else if (email.length > 254) {
      errors.push('Email address is too long');
    }

    return { isValid: errors.length === 0, errors };
  };

  const validatePassword = async (password: string): Promise<ValidationResult> => {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    try {
      setIsValidating(true);
      
      // Use server-side validation function
      const { data, error } = await supabase.rpc('validate_password_complexity', {
        password
      });

      if (error) {
        errors.push('Password validation failed');
        return { isValid: false, errors };
      }

      if (!data) {
        errors.push('Password must be at least 8 characters long');
        errors.push('Password must contain uppercase and lowercase letters');
        errors.push('Password must contain at least one number');
        errors.push('Password must contain at least one special character');
      }

    } catch (error) {
      errors.push('Password validation failed');
    } finally {
      setIsValidating(false);
    }

    return { isValid: errors.length === 0, errors };
  };

  const validateName = (name: string, fieldName: string = 'Name'): ValidationResult => {
    const errors: string[] = [];
    
    if (!name?.trim()) {
      errors.push(`${fieldName} is required`);
    } else if (name.trim().length < 2) {
      errors.push(`${fieldName} must be at least 2 characters long`);
    } else if (name.trim().length > 100) {
      errors.push(`${fieldName} must be less than 100 characters`);
    } else if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
      errors.push(`${fieldName} can only contain letters, spaces, hyphens, and apostrophes`);
    }

    return { isValid: errors.length === 0, errors };
  };

  const validatePhone = (phone: string): ValidationResult => {
    const errors: string[] = [];
    
    if (phone && phone.trim()) {
      const phoneRegex = /^\+?[\d\s\-\(\)]{10,20}$/;
      if (!phoneRegex.test(phone.trim())) {
        errors.push('Please enter a valid phone number');
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  // Enhanced XSS prevention with comprehensive sanitization
  const sanitizeInput = (input: string): string => {
    if (!input) return '';
    
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/data:/gi, '') // Remove data: protocol
      .replace(/vbscript:/gi, '') // Remove vbscript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .replace(/expression\s*\(/gi, '') // Remove CSS expressions
      .replace(/eval\s*\(/gi, '') // Remove eval calls
      .replace(/script/gi, '') // Remove script tags
      .replace(/iframe/gi, '') // Remove iframe tags
      .replace(/object/gi, '') // Remove object tags
      .replace(/embed/gi, '') // Remove embed tags
      .replace(/link/gi, '') // Remove link tags
      .replace(/meta/gi, '') // Remove meta tags
      .replace(/style/gi, '') // Remove style tags
      .replace(/\x00-\x1f\x7f-\x9f/g, '') // Remove control characters
      .trim();
  };

  const validateAndSanitize = (input: string, maxLength: number = 1000): string => {
    const sanitized = sanitizeInput(input);
    return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
  };

  return {
    validateEmail,
    validatePassword,
    validateName,
    validatePhone,
    sanitizeInput,
    validateAndSanitize,
    isValidating
  };
};
