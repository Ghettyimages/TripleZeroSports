-- Complete fix for all remaining missing columns

-- Add missing order column to payload_preferences_rels
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payload_preferences_rels' AND column_name = 'order') THEN
    ALTER TABLE payload_preferences_rels ADD COLUMN "order" INTEGER;
  END IF;
END $$;

-- Add missing posts_id column to _posts_v_rels  
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_rels' AND column_name = 'posts_id') THEN
    ALTER TABLE _posts_v_rels ADD COLUMN posts_id INTEGER REFERENCES posts(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Fix the _posts_v_rels table structure to match what Payload expects
DO $$ 
BEGIN 
  -- Add missing parent column if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_rels' AND column_name = 'parent') THEN
    ALTER TABLE _posts_v_rels ADD COLUMN parent INTEGER REFERENCES _posts_v(id) ON DELETE CASCADE;
  END IF;
  
  -- Rename parent_id to parent if needed
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_rels' AND column_name = 'parent_id') 
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = '_posts_v_rels' AND column_name = 'parent') THEN
    ALTER TABLE _posts_v_rels RENAME COLUMN parent_id TO parent;
  END IF;
END $$;