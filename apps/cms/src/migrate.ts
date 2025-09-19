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
    
    // Run initial migration
    console.log('Reading initial migration file...');
    const initMigrationPath = path.resolve(__dirname, '../migrations/20240918_init.sql');
    const initMigrationSQL = fs.readFileSync(initMigrationPath, 'utf8');
    
    console.log('Running initial migration...');
    await client.query(initMigrationSQL);
    
    // Run field fix migration
    console.log('Reading field fix migration file...');
    const fixMigrationPath = path.resolve(__dirname, '../migrations/20240919_fix_users_fields.sql');
    const fixMigrationSQL = fs.readFileSync(fixMigrationPath, 'utf8');
    
    console.log('Running field fix migration...');
    await client.query(fixMigrationSQL);
    
    // Run missing tables migration
    console.log('Reading missing tables migration file...');
    const missingTablesMigrationPath = path.resolve(__dirname, '../migrations/20240919_add_missing_tables.sql');
    const missingTablesMigrationSQL = fs.readFileSync(missingTablesMigrationPath, 'utf8');
    
    console.log('Running missing tables migration...');
    await client.query(missingTablesMigrationSQL);
    
    // Run final fixes migration
    console.log('Reading final fixes migration file...');
    const finalFixesMigrationPath = path.resolve(__dirname, '../migrations/20240919_final_fixes.sql');
    const finalFixesMigrationSQL = fs.readFileSync(finalFixesMigrationPath, 'utf8');
    
    console.log('Running final fixes migration...');
    await client.query(finalFixesMigrationSQL);
    
    // Run final columns migration
    console.log('Reading final columns migration file...');
    const finalColumnsMigrationPath = path.resolve(__dirname, '../migrations/20240919_final_columns.sql');
    const finalColumnsMigrationSQL = fs.readFileSync(finalColumnsMigrationPath, 'utf8');
    
    console.log('Running final columns migration...');
    await client.query(finalColumnsMigrationSQL);
    
    // Run complete fix migration
    console.log('Reading complete fix migration file...');
    const completeFixMigrationPath = path.resolve(__dirname, '../migrations/20240919_complete_fix.sql');
    const completeFixMigrationSQL = fs.readFileSync(completeFixMigrationPath, 'utf8');
    
    console.log('Running complete fix migration...');
    await client.query(completeFixMigrationSQL);
    
    // Run simple columns migration
    console.log('Reading simple columns migration file...');
    const simpleColumnsMigrationPath = path.resolve(__dirname, '../migrations/20240919_add_simple_columns.sql');
    const simpleColumnsMigrationSQL = fs.readFileSync(simpleColumnsMigrationPath, 'utf8');
    
    console.log('Running simple columns migration...');
    await client.query(simpleColumnsMigrationSQL);
    
    console.log('All migrations completed successfully!');
    client.release();
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();