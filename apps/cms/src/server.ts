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
      onInit: () => {
        payload.logger.info("Payload CMS initialized successfully");
        payload.logger.info(`Admin URL: ${process.env.CMS_PUBLIC_URL || 'http://localhost:3001'}/admin`);
      },
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