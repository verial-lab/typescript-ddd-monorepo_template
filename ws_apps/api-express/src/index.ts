/**
 * API Express application exports
 * This file only exports from other files as per style guide
 */
export { createApp } from './ExpressApp';
export { startServer } from './ExpressServer';

// Start the server
import { startServer } from './ExpressServer';
startServer();
