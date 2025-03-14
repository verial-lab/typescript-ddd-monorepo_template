import type { BaseEventPayload, IDomainEvent } from '@repo-domains/domain-core';

export interface Profile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProfileCreatedEventPayload extends BaseEventPayload {
  eventType: 'created';
  profile: Profile;
}

export interface ProfileUpdatedEventPayload extends BaseEventPayload {
  eventType: 'updated';
  profile: Profile;
}

export interface ProfileDeletedEventPayload extends BaseEventPayload {
  eventType: 'deleted';
  profileId: string;
}

export type ProfileEvent =
  | IDomainEvent<ProfileCreatedEventPayload>
  | IDomainEvent<ProfileUpdatedEventPayload>
  | IDomainEvent<ProfileDeletedEventPayload>;

export interface ProfileRepository {
  create(profile: Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>): Promise<Profile>;
  update(
    id: string,
    profile: Partial<Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<Profile>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Profile | null>;
}
