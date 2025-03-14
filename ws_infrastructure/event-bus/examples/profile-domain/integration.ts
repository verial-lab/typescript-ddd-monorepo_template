import type { User } from '@repo-domains/auth';
import type { Profile } from '@repo-domains/profile';
import type { ProfileRepository } from '@repo-domains/profile';
import { Role, RoleType } from '@repo-domains/profile';
import { ProfileEventTypes } from '@repo-domains/profile';
import { NotificationService } from './NotificationService';
import { ProfileEventHandlers } from './ProfileEventHandlers';

/**
 * Example integration showing how to use the event bus with the profile domain
 */
export async function example(profile: Profile, repository: ProfileRepository) {
  // Create a new profile
  const newProfile = {
    userId: 'user-123',
    displayName: 'John Doe',
    role: Role.create(RoleType.USER),
  };

  // Update profile
  await repository.create(newProfile);

  // Update display name
  await repository.update(profile.id, {
    displayName: 'Jane Doe',
  });

  // Delete profile
  await repository.delete(profile.id);
}
