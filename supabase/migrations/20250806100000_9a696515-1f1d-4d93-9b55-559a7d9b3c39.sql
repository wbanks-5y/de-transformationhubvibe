-- Create function to check if current user is the first admin
CREATE OR REPLACE FUNCTION public.is_first_admin()
RETURNS boolean
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO ''
AS $$
DECLARE
  first_admin_id uuid;
  current_user_is_admin boolean;
BEGIN
  -- Check if current user is admin first
  SELECT is_admin_secure() INTO current_user_is_admin;
  
  IF NOT current_user_is_admin THEN
    RETURN false;
  END IF;
  
  -- Get the first admin user (earliest created_at among admin users)
  SELECT ur.user_id INTO first_admin_id
  FROM public.user_roles ur
  JOIN public.roles r ON ur.role_id = r.id
  JOIN public.profiles p ON ur.user_id = p.id
  WHERE r.name = 'admin'
  ORDER BY p.created_at ASC
  LIMIT 1;
  
  -- Return true if current user is the first admin
  RETURN (auth.uid() = first_admin_id);
END;
$$;