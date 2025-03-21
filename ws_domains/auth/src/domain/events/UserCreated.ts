import { type BaseEventPayload, type CryptoService, DomainEvent } from '@repo-domains/domain-core';

interface UserCreatedPayload extends BaseEventPayload {
  eventType: 'auth.user.created';
  userId: string;
}

export class UserCreatedEvent extends DomainEvent<UserCreatedPayload> {
  constructor(cryptoService: CryptoService, userId: string) {
    const now = new Date();

    super(cryptoService, {
      eventId: userId,
      eventType: 'auth.user.created',
      occurredOn: now,
      aggregateId: userId,
      version: 1,
      payload: {
        eventType: 'auth.user.created',
        timestamp: now,
        userId,
      },
    });
  }

  get userId(): string {
    return this.payload.userId;
  }
}
