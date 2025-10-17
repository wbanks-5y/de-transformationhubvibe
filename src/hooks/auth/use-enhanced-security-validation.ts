import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  securityScore: number;
}

export const useEnhancedSecurityValidation = () => {
  const [isValidating, setIsValidating] = useState(false);

  // Rate limiting for sensitive operations
  const checkRateLimit = (action: string): boolean => {
    const key = `rateLimit_${action}`;
    const lastAttempt = localStorage.getItem(key);
    const now = Date.now();
    const cooldown = 60000; // 1 minute

    if (lastAttempt && (now - parseInt(lastAttempt)) < cooldown) {
      return false;
    }

    localStorage.setItem(key, now.toString());
    return true;
  };

  // Enhanced password validation with security scoring
  const validatePassword = async (password: string): Promise<SecurityValidationResult> => {
    setIsValidating(true);
    const errors: string[] = [];
    let securityScore = 0;

    try {
      // Basic requirements
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      } else {
        securityScore += 20;
      }

      if (!/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      } else {
        securityScore += 20;
      }

      if (!/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      } else {
        securityScore += 20;
      }

      if (!/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number');
      } else {
        securityScore += 20;
      }

      if (!/[^A-Za-z0-9]/.test(password)) {
        errors.push('Password must contain at least one special character');
      } else {
        securityScore += 20;
      }

      // Advanced security checks
      if (password.length >= 12) {
        securityScore += 10;
      }

      if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
        securityScore += 10;
      }

      // Check for common patterns
      const commonPatterns = [
        /123456/,
        /password/i,
        /qwerty/i,
        /admin/i,
        /letmein/i,
        /welcome/i,
        /monkey/i,
        /dragon/i
      ];

      for (const pattern of commonPatterns) {
        if (pattern.test(password)) {
          errors.push('Password contains common patterns that are easily guessable');
          securityScore -= 30;
          break;
        }
      }

      // Check for repeated characters
      if (/(.)\1{2,}/.test(password)) {
        errors.push('Password should not contain repeated characters');
        securityScore -= 10;
      }

      // Ensure score doesn't go below 0
      securityScore = Math.max(0, securityScore);

      // Use Supabase function for additional validation
      const { data: isComplex, error } = await supabase.rpc('validate_password_complexity', {
        password: password
      });

      if (error) {
        console.error('Error validating password complexity:', error);
      } else if (!isComplex) {
        errors.push('Password does not meet complexity requirements');
        securityScore = Math.min(securityScore, 30);
      }

      return {
        isValid: errors.length === 0,
        errors,
        securityScore: Math.min(100, securityScore)
      };
    } catch (error) {
      console.error('Password validation error:', error);
      return {
        isValid: false,
        errors: ['Error validating password'],
        securityScore: 0
      };
    } finally {
      setIsValidating(false);
    }
  };

  // Enhanced email validation with security checks
  const validateEmail = (email: string): SecurityValidationResult => {
    const errors: string[] = [];
    let securityScore = 0;

    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.push('Please enter a valid email address');
    } else {
      securityScore += 50;
    }

    // Check for suspicious patterns
    if (email.includes('..')) {
      errors.push('Email contains invalid consecutive dots');
      securityScore -= 20;
    }

    // Check for length
    if (email.length > 254) {
      errors.push('Email address is too long');
      securityScore -= 30;
    }

    // Check for disposable email domains (basic list)
    const disposableDomains = [
      '10minutemail.com',
      'guerrillamail.com',
      'mailinator.com',
      'tempmail.org',
      'yopmail.com'
    ];

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && disposableDomains.includes(domain)) {
      errors.push('Please use a permanent email address');
      securityScore -= 40;
    }

    return {
      isValid: errors.length === 0,
      errors,
      securityScore: Math.max(0, Math.min(100, securityScore))
    };
  };

  // Input sanitization with security logging
  const sanitizeAndValidateInput = (
    input: string, 
    fieldName: string, 
    maxLength: number = 1000
  ): { sanitized: string; isValid: boolean; warnings: string[] } => {
    const warnings: string[] = [];
    const originalLength = input.length;

    // Advanced sanitization
    let sanitized = input
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

    // Truncate if necessary
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
      warnings.push(`${fieldName} was truncated to ${maxLength} characters`);
    }

    // Check for suspicious content removal
    if (originalLength !== sanitized.length) {
      warnings.push(`Potentially harmful content was removed from ${fieldName}`);
    }

    return {
      sanitized,
      isValid: sanitized.length > 0,
      warnings
    };
  };

  // Security audit logging
  const logSecurityEvent = async (eventType: string, details: Record<string, any>) => {
    try {
      await supabase.rpc('log_security_event_enhanced', {
        p_action: eventType,
        p_resource_type: 'user_input_validation',
        p_resource_id: 'client_side_validation',
        p_details: details,
        p_success: true,
        p_severity: 'info'
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  };

  return {
    validatePassword,
    validateEmail,
    sanitizeAndValidateInput,
    checkRateLimit,
    logSecurityEvent,
    isValidating
  };
};