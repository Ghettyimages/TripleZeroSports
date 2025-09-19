-- Fix users table field lengths for password hashing
-- Change VARCHAR(255) to TEXT for fields that can be longer

ALTER TABLE users 
  ALTER COLUMN reset_password_token TYPE TEXT,
  ALTER COLUMN salt TYPE TEXT,
  ALTER COLUMN hash TYPE TEXT;