import 'dotenv/config';
import app from './app.js';
import prisma from './config/database.js';

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[ProjectFlow Server] Running in ${process.env.NODE_ENV || 'development'} on port ${PORT}`);
});

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`[ProjectFlow Server] Received ${signal}. Shutting down cleanly...`);
  server.close(async () => {
    try {
      await prisma.$disconnect();
      console.log('[ProjectFlow Server] Database disconnected.');
      process.exit(0);
    } catch (err) {
      console.error('[ProjectFlow Server] Error disconnecting database:', err);
      process.exit(1);
    }
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
