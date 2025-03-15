import { type BaseEventPayload, DomainEvent } from '@repo-domains/domain-core';

interface UserDeletedPayload extends BaseEventPayload {
  eventType: 'auth.user.deleted';
  userId: string;
}

export class UserDeletedEvent extends DomainEvent<UserDeletedPayload> {
  constructor(userId: string) {
    const now = new Date();

    super({
      eventId: userId,
      eventType: 'auth.user.deleted',
      occurredOn: now,
      aggregateId: userId,
      version: 1,
      payload: {
        eventType: 'auth.user.deleted',
        timestamp: now,
        userId,
      },
    });
  }

  get userId(): string {
    return this.payload.userId;
  }
}
