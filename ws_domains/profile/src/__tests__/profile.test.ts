import { ProfileCreatedEvent, ProfileDeletedEvent, ProfileUpdatedEvent } from '../events';
import { InMemoryProfileRepository } from '../repository';
import type { Profile } from '../types';

describe('Profile Domain', () => {
  let repository: InMemoryProfileRepository;

  beforeEach(() => {
    repository = new InMemoryProfileRepository();
  });

  describe('Profile Repository', () => {
    it('should create a profile', async () => {
      const profileData = {
        name: 'John Doe',
        email: 'john@example.com',
      };

      const profile = await repository.create(profileData);

      expect(profile.id).toBeDefined();
      expect(profile.name).toBe(profileData.name);
      expect(profile.email).toBe(profileData.email);
      expect(profile.createdAt).toBeInstanceOf(Date);
      expect(profile.updatedAt).toBeInstanceOf(Date);
    });

    it('should update a profile', async () => {
      const profile = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
      });

      const updatedProfile = await repository.update(profile.id, {
        name: 'Jane Doe',
      });

      expect(updatedProfile.id).toBe(profile.id);
      expect(updatedProfile.name).toBe('Jane Doe');
      expect(updatedProfile.email).toBe(profile.email);
      expect(updatedProfile.updatedAt.getTime()).toBeGreaterThan(profile.updatedAt.getTime());
    });

    it('should delete a profile', async () => {
      const profile = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
      });

      await repository.delete(profile.id);
      const deletedProfile = await repository.findById(profile.id);
      expect(deletedProfile).toBeNull();
    });

    it('should throw error when updating non-existent profile', async () => {
      await expect(repository.update('non-existent-id', { name: 'Jane Doe' })).rejects.toThrow(
        'Profile with id non-existent-id not found'
      );
    });

    it('should throw error when deleting non-existent profile', async () => {
      await expect(repository.delete('non-existent-id')).rejects.toThrow(
        'Profile with id non-existent-id not found'
      );
    });
  });

  describe('Profile Events', () => {
    let profile: Profile;

    beforeEach(async () => {
      profile = await repository.create({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });

    it('should create profile created event', () => {
      const event = new ProfileCreatedEvent(profile);

      expect(event.eventType).toBe('created');
      expect(event.aggregateId).toBe(profile.id);
      expect(event.version).toBe(1);
      expect(event.payload.profile).toEqual(profile);
      expect(event.payload.timestamp).toBeInstanceOf(Date);
    });

    it('should create profile updated event', () => {
      const event = new ProfileUpdatedEvent(profile);

      expect(event.eventType).toBe('updated');
      expect(event.aggregateId).toBe(profile.id);
      expect(event.version).toBe(1);
      expect(event.payload.profile).toEqual(profile);
      expect(event.payload.timestamp).toBeInstanceOf(Date);
    });

    it('should create profile deleted event', () => {
      const event = new ProfileDeletedEvent(profile.id);

      expect(event.eventType).toBe('deleted');
      expect(event.aggregateId).toBe(profile.id);
      expect(event.version).toBe(1);
      expect(event.payload.profileId).toBe(profile.id);
      expect(event.payload.timestamp).toBeInstanceOf(Date);
    });
  });
});
