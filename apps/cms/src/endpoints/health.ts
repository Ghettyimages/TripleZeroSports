import type { PayloadHandler } from 'payload/config';

const health: PayloadHandler = async (req, res) => {
  try {
    // Check database connection
    await req.payload.db.connection;
    
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export default health;
