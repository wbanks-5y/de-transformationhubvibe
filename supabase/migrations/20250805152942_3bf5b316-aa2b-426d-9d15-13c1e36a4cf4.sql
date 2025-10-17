-- Create function to handle bootstrap admin assignment
CREATE OR REPLACE FUNCTION public.handle_bootstrap_admin_assignment(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_role_id uuid;
  user_profile_id uuid;
  admin_exists boolean;
  bootstrap_email text;
BEGIN
  -- Check if any admin users already exist
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
  ) INTO admin_exists;
  
  -- If admin already exists, no bootstrap needed
  IF admin_exists THEN
    RETURN false;
  END IF;
  
  -- Get bootstrap admin email from environment (would be set via dashboard)
  -- For now, we'll implement the first user fallback
  
  -- Get admin role ID
  SELECT id INTO admin_role_id
  FROM public.roles
  WHERE name = 'admin'
  LIMIT 1;
  
  -- Create admin role if it doesn't exist
  IF admin_role_id IS NULL THEN
    INSERT INTO public.roles (name, description)
    VALUES ('admin', 'System Administrator - Bootstrap assigned')
    RETURNING id INTO admin_role_id;
  END IF;
  
  -- Find the user profile by email
  SELECT p.id INTO user_profile_id
  FROM public.profiles p
  WHERE p.id IN (
    SELECT u.id 
    FROM auth.users u 
    WHERE u.email = user_email
  )
  LIMIT 1;
  
  -- If user found, assign admin role
  IF user_profile_id IS NOT NULL THEN
    -- Check if user already has admin role
    IF NOT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = user_profile_id AND role_id = admin_role_id
    ) THEN
      -- Assign admin role
      INSERT INTO public.user_roles (user_id, role_id)
      VALUES (user_profile_id, admin_role_id);
      
      -- Update user status to approved
      UPDATE public.profiles
      SET status = 'approved', tier = 'admin'
      WHERE id = user_profile_id;
      
      -- Log the bootstrap admin assignment
      PERFORM log_security_event_enhanced(
        'bootstrap_admin_assigned',
        'user_role',
        user_profile_id::text,
        jsonb_build_object(
          'email', user_email,
          'assignment_type', 'bootstrap',
          'role_id', admin_role_id,
          'note', 'First admin user assigned during system bootstrap'
        ),
        true,
        'info'
      );
      
      RETURN true;
    END IF;
  END IF;
  
  RETURN false;
  
EXCEPTION
  WHEN OTHERS THEN
    PERFORM log_security_event_enhanced(
      'bootstrap_admin_assignment_error',
      'user_role',
      user_email,
      jsonb_build_object(
        'error', SQLERRM,
        'error_code', SQLSTATE
      ),
      false,
      'error'
    );
    RETURN false;
END;
$$;

-- Create function to check if system needs bootstrap admin
CREATE OR REPLACE FUNCTION public.needs_bootstrap_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
  SELECT NOT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
  );
$$;

-- Create function to handle automatic admin assignment for first user
CREATE OR REPLACE FUNCTION public.auto_assign_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  admin_role_id uuid;
  admin_exists boolean;
BEGIN
  -- Check if any admin users already exist
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE r.name = 'admin'
  ) INTO admin_exists;
  
  -- If no admin exists, make this user the first admin
  IF NOT admin_exists THEN
    -- Get or create admin role
    SELECT id INTO admin_role_id
    FROM public.roles
    WHERE name = 'admin'
    LIMIT 1;
    
    IF admin_role_id IS NULL THEN
      INSERT INTO public.roles (name, description)
      VALUES ('admin', 'System Administrator - Auto-assigned to first user')
      RETURNING id INTO admin_role_id;
    END IF;
    
    -- Assign admin role to this user
    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (NEW.id, admin_role_id);
    
    -- Update user status and tier
    NEW.status := 'approved';
    NEW.tier := 'admin';
    
    -- Log the first admin assignment
    PERFORM log_security_event_enhanced(
      'first_admin_auto_assigned',
      'user_role',
      NEW.id::text,
      jsonb_build_object(
        'assignment_type', 'first_user_auto',
        'role_id', admin_role_id,
        'note', 'First user automatically assigned admin role during system setup'
      ),
      true,
      'info'
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to auto-assign first admin
DROP TRIGGER IF EXISTS auto_assign_first_admin_trigger ON public.profiles;
CREATE TRIGGER auto_assign_first_admin_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_assign_first_admin();