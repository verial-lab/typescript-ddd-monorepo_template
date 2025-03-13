import type { IIdGenerator } from '@repo-packages/domain-core';
import { logger } from '@repo-packages/logger';
import { v4 as uuidv4 } from 'uuid';

/**
 * UUID v4 implementation of the ID generator
 */
export class UuidGenerator implements IIdGenerator {
  /**
   * Generate a new UUID v4
   * @returns A UUID v4 string
   */
  generate(): string {
    try {
      return uuidv4();
    } catch (error) {
      logger.error({ error }, 'Failed to generate UUID');
      throw error;
    }
  }
}
