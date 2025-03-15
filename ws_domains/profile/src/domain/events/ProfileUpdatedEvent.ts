import { type BaseEventPayload, type CryptoService, DomainEvent } from '@repo-domains/domain-core';
import type { Profile } from '../models/Profile';
import type { ProfileCreateProps } from '../models/Profile';

export interface ProfileUpdatedEventPayload extends BaseEventPayload {
  eventType: 'profile.updated';
  profileId: string;
  changes: Partial<ProfileCreateProps>;
  previousValues: Partial<ProfileCreateProps>;
}

export class ProfileUpdatedEvent extends DomainEvent<ProfileUpdatedEventPayload> {
  static fromProfile(
    profile: Profile,
    changes: Partial<ProfileCreateProps>,
    previousValues: Partial<ProfileCreateProps>,
    cryptoService: CryptoService
  ): ProfileUpdatedEvent {
    return new ProfileUpdatedEvent(cryptoService, {
      eventId: profile.id,
      eventType: 'profile.updated',
      occurredOn: new Date(),
      aggregateId: profile.id,
      version: 1,
      payload: {
        eventType: 'profile.updated',
        timestamp: new Date(),
        profileId: profile.id,
        changes,
        previousValues,
      },
    });
  }

  get eventType(): string {
    return 'profile.updated';
  }

  get profileId(): string {
    return this.payload.profileId;
  }

  get changes(): Partial<ProfileCreateProps> {
    return this.payload.changes;
  }

  get previousValues(): Partial<ProfileCreateProps> {
    return this.payload.previousValues;
  }
}
