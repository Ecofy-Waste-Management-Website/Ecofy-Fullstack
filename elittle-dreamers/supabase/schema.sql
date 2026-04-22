-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES table (extends Supabase auth.users)
CREATE TABLE profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name  TEXT NOT NULL,
  last_name   TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'parent'
                CHECK (role IN ('parent', 'teacher', 'admin')),
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- BRANCHES table
CREATE TABLE branches (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name        TEXT NOT NULL,
  address     TEXT NOT NULL,
  rating      NUMERIC(2,1),
  map_url     TEXT,
  image_url   TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- CHILDREN table
CREATE TABLE children (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name            TEXT NOT NULL,
  date_of_birth   DATE NOT NULL,
  parent_id       UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  branch_id       UUID REFERENCES branches(id),
  notes           TEXT,
  avatar_url      TEXT,
  is_active       BOOLEAN DEFAULT true,
  enrolled_at     TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ENQUIRIES table
CREATE TABLE enquiries (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  first_name    TEXT NOT NULL,
  last_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  message       TEXT NOT NULL,
  status        TEXT DEFAULT 'new'
                  CHECK (status IN ('new', 'read', 'replied')),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- AUTO-CREATE PROFILE on user signup trigger
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, first_name, last_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'parent')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
