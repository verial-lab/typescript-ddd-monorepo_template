import { type BaseEventPayload, type CryptoService, DomainEvent } from '@repo-domains/domain-core';
import type { Profile } from '../models/Profile';

export interface ProfileDeletedEventPayload extends BaseEventPayload {
  eventType: 'profile.deleted';
  profileId: string;
  reason?: string;
}

export class ProfileDeletedEvent extends DomainEvent<ProfileDeletedEventPayload> {
  static fromProfile(
    profile: Profile,
    reason: string | undefined,
    cryptoService: CryptoService
  ): ProfileDeletedEvent {
    return new ProfileDeletedEvent(cryptoService, {
      eventId: profile.id,
      eventType: 'profile.deleted',
      occurredOn: new Date(),
      aggregateId: profile.id,
      version: 1,
      payload: {
        eventType: 'profile.deleted',
        timestamp: new Date(),
        profileId: profile.id,
        reason,
      },
    });
  }

  get eventType(): string {
    return 'profile.deleted';
  }

  get profileId(): string {
    return this.payload.profileId;
  }

  get reason(): string | undefined {
    return this.payload.reason;
  }
}
