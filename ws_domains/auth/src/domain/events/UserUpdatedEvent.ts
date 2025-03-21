import { type BaseEventPayload, type CryptoService, DomainEvent } from '@repo-domains/domain-core';

interface UserUpdatedPayload extends BaseEventPayload {
  eventType: 'auth.user.updated';
  userId: string;
}

export class UserUpdatedEvent extends DomainEvent<UserUpdatedPayload> {
  constructor(cryptoService: CryptoService, userId: string) {
    const now = new Date();

    super(cryptoService, {
      eventId: userId,
      eventType: 'auth.user.updated',
      occurredOn: now,
      aggregateId: userId,
      version: 1,
      payload: {
        eventType: 'auth.user.updated',
        timestamp: now,
        userId,
      },
    });
  }

  get userId(): string {
    return this.payload.userId;
  }
}
