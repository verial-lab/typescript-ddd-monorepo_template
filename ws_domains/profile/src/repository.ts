import { randomUUID } from 'crypto';
import type { Profile, ProfileRepository } from './types';

export class InMemoryProfileRepository implements ProfileRepository {
  private profiles: Map<string, Profile> = new Map();

  async create(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile> {
    const id = randomUUID();
    const now = new Date();
    const newProfile: Profile = {
      id,
      ...profile,
      createdAt: now,
      updatedAt: now,
    };
    this.profiles.set(id, newProfile);
    return newProfile;
  }

  async update(
    id: string,
    profile: Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Profile> {
    const existingProfile = await this.findById(id);
    if (!existingProfile) {
      throw new Error(`Profile with id ${id} not found`);
    }

    await new Promise((resolve) => setTimeout(resolve, 1));

    const updatedProfile: Profile = {
      ...existingProfile,
      ...profile,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updatedProfile);
    return updatedProfile;
  }

  async delete(id: string): Promise<void> {
    const exists = this.profiles.has(id);
    if (!exists) {
      throw new Error(`Profile with id ${id} not found`);
    }
    this.profiles.delete(id);
  }

  async findById(id: string): Promise<Profile | null> {
    const profile = this.profiles.get(id);
    return profile || null;
  }
}
