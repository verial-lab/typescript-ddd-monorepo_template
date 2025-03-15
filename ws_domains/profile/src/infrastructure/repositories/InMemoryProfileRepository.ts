import type { Logger } from '@repo-domains/domain-core';
import { InMemoryRepository } from '../../domain/interfaces/repositories/InMemoryRepository';
import type { ProfileRepository } from '../../domain/interfaces/repositories/ProfileRepository';
import type { Profile } from '../../domain/models/Profile';

export class InMemoryProfileRepository
  extends InMemoryRepository<Profile, string>
  implements ProfileRepository
{
  constructor(private readonly logger: Logger) {
    super();
  }

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.items.find((item) => item.userId === userId) || null;
  }

  async create(profile: Profile): Promise<Profile> {
    this.logger.info('Creating profile', { profileId: profile.id });
    return super.create(profile);
  }

  async delete(id: string): Promise<boolean> {
    this.logger.info('Deleting profile', { profileId: id });
    return super.delete(id);
  }
}
