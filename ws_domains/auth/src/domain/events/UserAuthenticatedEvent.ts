import { type BaseEventPayload, type CryptoService, DomainEvent } from '@repo-domains/domain-core';

interface UserAuthenticatedPayload extends BaseEventPayload {
  eventType: 'auth.user.authenticated';
  userId: string;
}

export class UserAuthenticatedEvent extends DomainEvent<UserAuthenticatedPayload> {
  constructor(cryptoService: CryptoService, userId: string) {
    const now = new Date();

    super(cryptoService, {
      eventId: userId,
      eventType: 'auth.user.authenticated',
      occurredOn: now,
      aggregateId: userId,
      version: 1,
      payload: {
        eventType: 'auth.user.authenticated',
        timestamp: now,
        userId,
      },
    });
  }

  get userId(): string {
    return this.payload.userId;
  }
}
