-- Supabase policies and schema suggestions for zcraft-blueprint
-- Apply these statements in Supabase SQL editor. Review before running.

/* -------------------------------
   forum_posts policies and trigger
   ------------------------------- */

-- Enable RLS
ALTER TABLE IF EXISTS public.forum_posts ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Posts: allow select (public)" ON public.forum_posts
  FOR SELECT USING (true);

-- Allow inserts only when author_id = auth.uid()
CREATE POLICY "Posts: insert as owner" ON public.forum_posts
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = author_id);

-- Allow update by owner or admin
CREATE POLICY "Posts: modify by owner or admin" ON public.forum_posts
  FOR UPDATE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  )
  WITH CHECK (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Allow delete by owner or admin
CREATE POLICY "Posts: delete by owner or admin" ON public.forum_posts
  FOR DELETE USING (
    auth.uid() = author_id OR
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Optional: helper trigger to populate author_id from auth context when the client doesn't provide it
-- Note: Using auth.uid() in functions requires proper privileges; SECURITY DEFINER is used intentionally.
CREATE OR REPLACE FUNCTION public.set_author_id()
RETURNS trigger AS $$
BEGIN
  IF NEW.author_id IS NULL THEN
    NEW.author_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS forum_posts_set_author ON public.forum_posts;
CREATE TRIGGER forum_posts_set_author
BEFORE INSERT ON public.forum_posts
FOR EACH ROW
EXECUTE FUNCTION public.set_author_id();

/* -------------------------------
   forums table policies
   ------------------------------- */
ALTER TABLE IF EXISTS public.forums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Forums: allow select (public)" ON public.forums
  FOR SELECT USING (true);

CREATE POLICY "Forums: admin insert/update/delete" ON public.forums
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

/* -------------------------------
   news table policies
   ------------------------------- */
ALTER TABLE IF EXISTS public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "News: public select" ON public.news FOR SELECT USING (true);
CREATE POLICY "News: admin write" ON public.news FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

/* -------------------------------
   wiki table policies
   ------------------------------- */
ALTER TABLE IF EXISTS public.wiki ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Wiki: public select" ON public.wiki FOR SELECT USING (true);
CREATE POLICY "Wiki: admin write" ON public.wiki FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

/* -------------------------------
   users table policies
   ------------------------------- */
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users: public select" ON public.users FOR SELECT USING (true);

CREATE POLICY "Users: insert by auth" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users: update self or admin" ON public.users FOR UPDATE USING (
  auth.uid() = id OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  auth.uid() = id OR EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

/* -------------------------------
   status_services table (StatusPage) + policies
   ------------------------------- */

CREATE TABLE IF NOT EXISTS public.status_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  name text NOT NULL,
  status text NOT NULL,
  description text,
  uptime text,
  latency text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.status_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Status: public select" ON public.status_services FOR SELECT USING (true);

CREATE POLICY "Status: admin write" ON public.status_services FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
) WITH CHECK (
  EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
);

/* -------------------------------
   Useful helper: index examples
   ------------------------------- */
CREATE INDEX IF NOT EXISTS idx_forum_posts_forum_id ON public.forum_posts(forum_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_author_id ON public.forum_posts(author_id);

/* -------------------------------
   Notes
   -------------------------------
- Run this script in Supabase -> SQL editor. Review policies to match your exact roles (e.g., 'moderator' allowances).
- If your auth JWT does not expose `auth.uid()` to SQL functions as expected, you may need to adjust trigger function to use
  current_setting('request.jwt.claims.sub', true) or implement author setting via Edge Function.
- After applying policies, test using the app: login, create thread, confirm insert succeeds and appears in queries.
*/
