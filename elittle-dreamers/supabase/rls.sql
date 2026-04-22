-- Enable RLS on all tables
ALTER TABLE profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE children  ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches  ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- CHILDREN policies
CREATE POLICY "Parents can view own children"
  ON children FOR SELECT
  USING (parent_id = auth.uid());

CREATE POLICY "Parents can insert own children"
  ON children FOR INSERT
  WITH CHECK (parent_id = auth.uid());

CREATE POLICY "Parents can update own children"
  ON children FOR UPDATE
  USING (parent_id = auth.uid());

CREATE POLICY "Teachers and admins can view all children"
  ON children FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );

-- ENQUIRIES policies
CREATE POLICY "Anyone can insert enquiry"
  ON enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view all enquiries"
  ON enquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update enquiry status"
  ON enquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- BRANCHES policies (public read, admin write)
CREATE POLICY "Anyone can view branches"
  ON branches FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage branches"
  ON branches FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
