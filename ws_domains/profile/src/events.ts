import { randomUUID } from 'crypto';
import { DomainEvent, type DomainEventCreateProps } from '@repo-domains/domain-core';
import type {
  Profile,
  ProfileCreatedEventPayload,
  ProfileDeletedEventPayload,
  ProfileEvent,
  ProfileUpdatedEventPayload,
} from './types';

export class ProfileCreatedEvent extends DomainEvent<ProfileCreatedEventPayload> {
  constructor(profile: Profile) {
    const now = new Date();
    const props: DomainEventCreateProps<ProfileCreatedEventPayload> = {
      eventType: 'created',
      aggregateId: profile.id,
      version: 1,
      eventId: randomUUID(),
      occurredOn: now,
      payload: {
        eventType: 'created',
        profile,
        timestamp: now,
      },
    };
    super(props);
  }
}

export class ProfileUpdatedEvent extends DomainEvent<ProfileUpdatedEventPayload> {
  constructor(profile: Profile) {
    const now = new Date();
    const props: DomainEventCreateProps<ProfileUpdatedEventPayload> = {
      eventType: 'updated',
      aggregateId: profile.id,
      version: 1,
      eventId: randomUUID(),
      occurredOn: now,
      payload: {
        eventType: 'updated',
        profile,
        timestamp: now,
      },
    };
    super(props);
  }
}

export class ProfileDeletedEvent extends DomainEvent<ProfileDeletedEventPayload> {
  constructor(profileId: string) {
    const now = new Date();
    const props: DomainEventCreateProps<ProfileDeletedEventPayload> = {
      eventType: 'deleted',
      aggregateId: profileId,
      version: 1,
      eventId: randomUUID(),
      occurredOn: now,
      payload: {
        eventType: 'deleted',
        profileId,
        timestamp: now,
      },
    };
    super(props);
  }
}
