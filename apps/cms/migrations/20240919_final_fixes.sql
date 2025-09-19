-- Final fixes for remaining missing tables and columns

-- Payload preferences relationships table
CREATE TABLE IF NOT EXISTS payload_preferences_rels (
  id SERIAL PRIMARY KEY,
  order_index INTEGER,
  parent_id INTEGER REFERENCES payload_preferences(id) ON DELETE CASCADE,
  path VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add missing 'order' column to posts_rels if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts_rels' AND column_name = 'order') THEN
    ALTER TABLE posts_rels ADD COLUMN "order" INTEGER;
  END IF;
END $$;

-- Add missing 'order' column to _posts_v_rels if it doesn't exist  
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_rels' AND column_name = 'order') THEN
    ALTER TABLE _posts_v_rels ADD COLUMN "order" INTEGER;
  END IF;
END $$;

-- Create indexes for the new table
CREATE INDEX IF NOT EXISTS idx_payload_preferences_rels_parent ON payload_preferences_rels(parent_id);
CREATE INDEX IF NOT EXISTS idx_posts_rels_order ON posts_rels("order");
CREATE INDEX IF NOT EXISTS idx_posts_v_rels_order ON _posts_v_rels("order");