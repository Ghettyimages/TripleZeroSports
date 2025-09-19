-- Add missing Payload CMS system tables

-- Payload preferences table (for UI preferences)
CREATE TABLE IF NOT EXISTS payload_preferences (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) NOT NULL,
  value JSONB,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(key, user_id)
);

-- Posts relationships table (for many-to-many relationships)
CREATE TABLE IF NOT EXISTS posts_rels (
  id SERIAL PRIMARY KEY,
  order_index INTEGER,
  parent_id INTEGER NOT NULL,
  path VARCHAR(255) NOT NULL,
  tags_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  authors_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Posts versions table (for drafts and versions)
CREATE TABLE IF NOT EXISTS _posts_v (
  id SERIAL PRIMARY KEY,
  parent_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
  version_title VARCHAR(255),
  version_slug VARCHAR(255),
  version_description TEXT,
  version_hero VARCHAR(255),
  version_author_id INTEGER REFERENCES authors(id),
  version_featured BOOLEAN DEFAULT FALSE,
  version_published_at TIMESTAMP,
  version_canonical_url VARCHAR(255),
  version_body JSONB,
  version__status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  latest BOOLEAN DEFAULT FALSE,
  autosave BOOLEAN DEFAULT FALSE
);

-- Posts versions relationships table
CREATE TABLE IF NOT EXISTS _posts_v_rels (
  id SERIAL PRIMARY KEY,
  order_index INTEGER,
  parent_id INTEGER REFERENCES _posts_v(id) ON DELETE CASCADE,
  path VARCHAR(255) NOT NULL,
  tags_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  authors_id INTEGER REFERENCES authors(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payload_preferences_user ON payload_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_payload_preferences_key ON payload_preferences(key);
CREATE INDEX IF NOT EXISTS idx_posts_rels_parent ON posts_rels(parent_id);
CREATE INDEX IF NOT EXISTS idx_posts_rels_tags ON posts_rels(tags_id);
CREATE INDEX IF NOT EXISTS idx_posts_rels_authors ON posts_rels(authors_id);
CREATE INDEX IF NOT EXISTS idx_posts_v_parent ON _posts_v(parent_id);
CREATE INDEX IF NOT EXISTS idx_posts_v_latest ON _posts_v(latest);
CREATE INDEX IF NOT EXISTS idx_posts_v_rels_parent ON _posts_v_rels(parent_id);