import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    console.log('Reading migration file...');
    const migrationPath = path.resolve(__dirname, '../migrations/20240918_init.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration...');
    await client.query(migrationSQL);
    
    console.log('Migration completed successfully!');
    client.release();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();