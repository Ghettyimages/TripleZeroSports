-- Add final missing columns to complete the schema

-- Add missing columns to _posts_v table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_updated_at') THEN
    ALTER TABLE _posts_v ADD COLUMN version_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v' AND column_name = 'version_created_at') THEN
    ALTER TABLE _posts_v ADD COLUMN version_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
  END IF;
END $$;

-- Add missing users_id column to payload_preferences_rels
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payload_preferences_rels' AND column_name = 'users_id') THEN
    ALTER TABLE payload_preferences_rels ADD COLUMN users_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;