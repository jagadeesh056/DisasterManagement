CREATE TABLE disasters (
  id UUID PRIMARY KEY,
  title TEXT,
  location_name TEXT,
  location GEOGRAPHY(POINT),
  description TEXT,
  tags TEXT[],
  owner_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  audit_trail JSONB
);
CREATE INDEX disasters_location_idx ON disasters USING GIST (location);
CREATE INDEX disasters_tags_idx ON disasters USING GIN (tags);

CREATE TABLE reports (
  id UUID PRIMARY KEY,
  disaster_id UUID REFERENCES disasters(id),
  user_id TEXT,
  content TEXT,
  image_url TEXT,
  verification_status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE resources (
  id UUID PRIMARY KEY,
  disaster_id UUID REFERENCES disasters(id),
  name TEXT,
  location_name TEXT,
  location GEOGRAPHY(POINT),
  type TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX resources_location_idx ON resources USING GIST (location);

CREATE TABLE cache (
  key TEXT PRIMARY KEY,
  value JSONB,
  expires_at TIMESTAMP
);