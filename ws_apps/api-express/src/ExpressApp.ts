import { logger } from '@repo-packages/logger';
import cors from 'cors';
import express from 'express';

/**
 * Creates an Express application with all middleware and routes configured
 */
export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Request logging middleware
  app.use((req, _res, next) => {
    logger.info(
      {
        method: req.method,
        url: req.url,
        query: req.query,
        body: req.body,
      },
      'Incoming request'
    );
    next();
  });

  // Routes
  app.get('/', (_req, res) => {
    res.json({ message: 'Welcome to the API' });
  });

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Example API endpoint
  app.get('/api/items', (_req, res) => {
    const items = [
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ];
    res.json(items);
  });

  // Error handling middleware
  app.use(
    (err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      logger.error({ err }, 'Error occurred');
      res.status(500).json({ error: 'Internal server error' });
    }
  );

  return app;
}
