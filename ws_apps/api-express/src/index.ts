/**
 * API Express application exports
 * This file only exports from other files as per style guide
 */
export { createApp } from './ExpressApp';
export { startServer } from './ExpressServer';
export { start } from './Server';

// Start the server
import { start } from './Server';
start();
