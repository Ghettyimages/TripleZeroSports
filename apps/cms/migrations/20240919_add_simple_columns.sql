-- Add the missing simple text columns for author_name and tag_names

DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'author_name') THEN
    ALTER TABLE posts ADD COLUMN author_name VARCHAR(255);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'tag_names') THEN
    ALTER TABLE posts ADD COLUMN tag_names VARCHAR(255);
  END IF;
END $$;