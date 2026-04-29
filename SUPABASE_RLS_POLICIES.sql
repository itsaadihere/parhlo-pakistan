-- Run this exact SQL script in your Supabase SQL Editor to secure your database!

-- 1. Secure the 'courses' table (Public can READ, only Authenticated Admins can INSERT/UPDATE/DELETE)
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to courses"
ON courses FOR SELECT
TO public
USING (true);

-- Assuming admins have a specific role or we just restrict write to service role
CREATE POLICY "Allow service role write access to courses"
ON courses FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 2. Secure the 'users' table (Users can only READ/UPDATE their own data)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow service role all access to users"
ON users FOR ALL
TO service_role
USING (true)
WITH CHECK (true);


-- 3. Secure the 'purchases' table (Students can only see their own purchases)
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own purchases"
ON purchases FOR SELECT
TO authenticated
USING (student_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Students can insert own purchases"
ON purchases FOR INSERT
TO authenticated
WITH CHECK (student_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Allow service role all access to purchases"
ON purchases FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- IMPORTANT: This guarantees that a hacker cannot query the 'users' or 'purchases' table 
-- using the public anon key to steal email addresses, transaction IDs, or passwords.
