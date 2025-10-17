-- Fix search_path for handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
begin
  begin
    insert into public.profiles (id, email)
    values (new.id, new.email)
    on conflict (id) do nothing;
  exception when others then
    -- Log a notice but don't abort the auth insert (prevents signup 500 errors)
    raise notice 'handle_new_user(): profiles insert failed - %', sqlerrm;
  end;
  return new;
end;
$function$;