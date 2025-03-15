import type { Logger } from '@repo-domains/domain-core';
import { Entity } from '@repo-domains/domain-core';
import type { CryptoService } from '@repo-domains/domain-core';
import { beforeEach, describe, expect, it } from 'vitest';
import { InMemoryProfileRepository } from '../../infrastructure/repositories/InMemoryProfileRepository';
import { ProfileCreatedEvent, ProfileDeletedEvent, ProfileUpdatedEvent } from '../events';
import { ProfileCreatedEvent as NewProfileCreatedEvent } from '../events/ProfileCreatedEvent';
import { ProfileDeletedEvent as NewProfileDeletedEvent } from '../events/ProfileDeletedEvent';
import { ProfileUpdatedEvent as NewProfileUpdatedEvent } from '../events/ProfileUpdatedEvent';
import { Profile } from './Profile';

class MockCryptoService implements CryptoService {
  generateId(): string {
    return 'mock-id';
  }
}

describe('Profile', () => {
  const cryptoService = new MockCryptoService();

  describe('Events', () => {
    it('should create a ProfileCreatedEvent', () => {
      const profile = new Profile(
        {
          userId: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        'test-id'
      );

      const event = ProfileCreatedEvent.fromProfile(profile, cryptoService);

      expect(event.eventType).toBe('profile.created');
      expect(event.payload.profileId).toBe(profile.id);
      expect(event.payload.name).toBe(profile.name);
      expect(event.payload.email).toBe(profile.email);
      expect(event.payload.role).toBe(profile.role);
    });

    it('should create a ProfileUpdatedEvent', () => {
      const profile = new Profile(
        {
          userId: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        'test-id'
      );

      const changes = {
        name: 'Jane Doe',
        role: 'admin',
      };

      const previousValues = {
        name: profile.name,
        role: profile.role,
      };

      const event = ProfileUpdatedEvent.fromProfile(
        profile,
        changes,
        previousValues,
        cryptoService
      );

      expect(event.eventType).toBe('profile.updated');
      expect(event.payload.profileId).toBe(profile.id);
      expect(event.payload.changes).toEqual(changes);
      expect(event.payload.previousValues).toEqual(previousValues);
    });

    it('should create a ProfileDeletedEvent', () => {
      const profile = new Profile(
        {
          userId: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        'test-id'
      );

      const event = ProfileDeletedEvent.fromProfile(
        profile,
        'User requested deletion',
        cryptoService
      );

      expect(event.eventType).toBe('profile.deleted');
      expect(event.payload.profileId).toBe(profile.id);
      expect(event.payload.reason).toBe('User requested deletion');
    });
  });

  describe('Repository', () => {
    let repository: InMemoryProfileRepository;
    const logger = {
      info: (message: string, context?: Record<string, unknown>) => {
        console.log(`[INFO] ${message}`, context);
      },
      error: (message: string, context?: Record<string, unknown>) => {
        console.error(`[ERROR] ${message}`, context);
      },
      warn: (message: string, context?: Record<string, unknown>) => {
        console.warn(`[WARN] ${message}`, context);
      },
      debug: (message: string, context?: Record<string, unknown>) => {
        console.debug(`[DEBUG] ${message}`, context);
      },
    };

    beforeEach(() => {
      repository = new InMemoryProfileRepository(logger);
    });

    it('should create a profile', async () => {
      const profile = new Profile(
        {
          userId: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        'test-id'
      );

      const savedProfile = await repository.create(profile);
      expect(savedProfile.id).toBe('test-id');
      expect(savedProfile.name).toBe('John Doe');
      expect(savedProfile.email).toBe('john@example.com');
    });

    it('should update a profile', async () => {
      const profile = new Profile(
        {
          userId: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        'test-id'
      );

      await repository.create(profile);
      const updatedProfile = await repository.updateById(profile.id, { name: 'Jane Doe' });
      expect(updatedProfile.name).toBe('Jane Doe');
      expect(updatedProfile.email).toBe('john@example.com');
    });

    it('should delete a profile', async () => {
      const profile = new Profile(
        {
          userId: 'test-user-id',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
        },
        'test-id'
      );

      await repository.create(profile);
      const result = await repository.delete(profile.id);
      expect(result).toBe(true);
      const deletedProfile = await repository.findById(profile.id);
      expect(deletedProfile).toBeNull();
    });

    it('should return false when deleting non-existent profile', async () => {
      const result = await repository.delete('non-existent-id');
      expect(result).toBe(false);
    });

    it('should throw error when updating non-existent profile', async () => {
      await expect(repository.updateById('non-existent-id', { name: 'Jane Doe' })).rejects.toThrow(
        'Entity with id non-existent-id not found'
      );
    });
  });
});
