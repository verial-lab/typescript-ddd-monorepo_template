import { type BaseEventPayload, type CryptoService, DomainEvent } from '@repo-domains/domain-core';
import type { Profile } from '../models/Profile';

export interface ProfileCreatedEventPayload extends BaseEventPayload {
  eventType: 'profile.created';
  profileId: string;
  name: string;
  email: string;
  role: string;
}

export class ProfileCreatedEvent extends DomainEvent<ProfileCreatedEventPayload> {
  static fromProfile(profile: Profile, cryptoService: CryptoService): ProfileCreatedEvent {
    return new ProfileCreatedEvent(cryptoService, {
      eventId: profile.id,
      eventType: 'profile.created',
      occurredOn: new Date(),
      aggregateId: profile.id,
      version: 1,
      payload: {
        eventType: 'profile.created',
        timestamp: new Date(),
        profileId: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
      },
    });
  }

  get eventType(): string {
    return 'profile.created';
  }
}
