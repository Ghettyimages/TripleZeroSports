import express from "express";
import payload from "payload";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health endpoint for Render
app.get("/api/health", (_req: any, res: any) => res.status(200).json({ ok: true }));

// Debug endpoint to check environment variables
app.get("/api/debug", (_req: any, res: any) => {
  res.json({
    hasDatabase: !!process.env.DATABASE_URL,
    hasSecret: !!process.env.PAYLOAD_SECRET,
    nodeEnv: process.env.NODE_ENV,
    databaseUrlLength: process.env.DATABASE_URL?.length || 0
  });
});

// Redirect root to admin
app.get("/", (_req: any, res: any) => res.redirect("/admin"));

const start = async () => {
  try {
    console.log("Starting Payload CMS...");
    console.log(`DATABASE_URL exists: ${!!process.env.DATABASE_URL}`);
    console.log(`PAYLOAD_SECRET exists: ${!!process.env.PAYLOAD_SECRET}`);
    
    await payload.init({
      secret: process.env.PAYLOAD_SECRET!,
      express: app,
      onInit: async () => {
        payload.logger.info("Payload CMS initialized successfully");
        payload.logger.info(`Admin URL: ${process.env.CMS_PUBLIC_URL || 'http://localhost:3001'}/admin`);
        
        // Test database connection by trying to count users
        try {
          const userCount = await payload.count({
            collection: 'users',
          });
          payload.logger.info(`Database connection test: Found ${userCount.totalDocs} users`);
        } catch (dbError) {
          payload.logger.error("Database connection test failed - this is expected if tables don't exist yet:", dbError);
          
          // Try to run migrations programmatically
          try {
            payload.logger.info("Attempting to run migrations...");
            await payload.db.migrate();
            payload.logger.info("Migrations completed successfully");
            
            // Test again after migration
            const userCountAfterMigration = await payload.count({
              collection: 'users',
            });
            payload.logger.info(`After migration: Found ${userCountAfterMigration.totalDocs} users`);
          } catch (migrationError) {
            payload.logger.error("Migration failed:", migrationError);
          }
        }
      },
    });

    // Add error handling middleware after Payload is initialized
    app.use((err: any, req: any, res: any, next: any) => {
      if (req.path.startsWith('/api/')) {
        console.error(`API Error on ${req.path}:`, err);
        payload.logger.error(`API Error on ${req.path}:`, err);
      }
      next(err);
    });

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      payload.logger.info(`CMS listening on :${port}`);
    });
  } catch (error) {
    console.error("Failed to start Payload CMS:", error);
    process.exit(1);
  }
};

start();