-- Add fallback admin check function that includes hardcoded admin email
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role::text FROM public.user_roles WHERE user_id = _user_id ORDER BY 
      CASE role 
        WHEN 'admin' THEN 1 
        WHEN 'moderator' THEN 2 
        ELSE 3 
      END 
    LIMIT 1),
    -- Fallback: check if user email is the hardcoded admin
    (SELECT CASE 
      WHEN EXISTS (
        SELECT 1 FROM auth.users 
        WHERE id = _user_id 
        AND email = 'zainabusal113@gmail.com'
      ) THEN 'admin'
      ELSE 'user'
    END)
  )
$$;

-- Create a trigger function to auto-assign admin role to hardcoded email
CREATE OR REPLACE FUNCTION public.assign_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- If the new user has the admin email, assign admin role
  IF NEW.email = 'zainabusal113@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for auto admin assignment
DROP TRIGGER IF EXISTS on_auth_user_admin_check ON auth.users;
CREATE TRIGGER on_auth_user_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_admin_on_signup();