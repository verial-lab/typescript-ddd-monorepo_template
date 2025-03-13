import type express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from './index';

// Mock the logger to avoid actual logging during tests
vi.mock('@repo-packages/logger', () => ({
  logger: {
    info: vi.fn(),
    error: vi.fn(),
  },
}));

interface RouterLayer {
  name: string;
  handle?: (req: express.Request, res: express.Response, next: express.NextFunction) => void;
  regexp?: RegExp;
}

describe('API Server', () => {
  const app = createApp();
  const agent = request(app);

  it('should return welcome message at root endpoint', async () => {
    const response = await agent.get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the API' });
  });

  it('should return health status', async () => {
    const response = await agent.get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return items from the items endpoint', async () => {
    const response = await agent.get('/api/items');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body).toHaveLength(3);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
  });
});

describe('API Express App', () => {
  it('should create an express app', () => {
    const app = createApp();
    expect(app).toBeDefined();
    expect(typeof app.listen).toBe('function');
  });

  it('should have CORS enabled', async () => {
    const app = createApp();
    const response = await request(app).get('/');
    expect(response.headers['access-control-allow-origin']).toBe('*');
  });

  it('should return welcome message', async () => {
    const app = createApp();
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Welcome to the API' });
  });

  it('should return health status', async () => {
    const app = createApp();
    const response = await request(app).get('/api/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return items', async () => {
    const app = createApp();
    const response = await request(app).get('/api/items');
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      { id: 1, name: 'Item 1' },
      { id: 2, name: 'Item 2' },
      { id: 3, name: 'Item 3' },
    ]);
  });

  it('should have all required middleware', () => {
    const app = createApp();
    const middlewares = app._router.stack
      .filter((layer: RouterLayer) => layer.name !== '<anonymous>')
      .map((layer: RouterLayer) => layer.name);

    console.log('Available middleware names:', middlewares);

    expect(middlewares).toContain('corsMiddleware');
    expect(middlewares).toContain('jsonParser');
    expect(middlewares).toContain('query');
    expect(middlewares).toContain('expressInit');
  });
});
