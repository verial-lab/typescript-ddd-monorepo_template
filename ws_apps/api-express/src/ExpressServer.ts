import { logger } from '@repo-packages/logger';
import { createApp } from './ExpressApp';

/**
 * Starts the Express server
 */
export function startServer(): void {
  // Start the server only if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    const port = process.env.PORT || 3000;
    const app = createApp();
    app.listen(port, () => {
      logger.info({ port }, 'Server is running');
    });
  }
}
