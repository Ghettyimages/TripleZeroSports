import express from "express";
import payload from "payload";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Simple health endpoint for Render
app.get("/api/health", (_req, res) => res.status(200).json({ ok: true }));

const start = async () => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET!,
    express: app,
    onInit: () => {
      payload.logger.info("Payload CMS initialized");
    },
  });

  const port = process.env.PORT || 3001;
  app.listen(port, () => {
    payload.logger.info(`CMS listening on :${port}`);
  });
};

start();