import { BaseDomainEvent } from './BaseDomainEvent';

export class UserAuthenticatedEvent extends BaseDomainEvent {
  userId: string;

  constructor(userId: string) {
    super('user.authenticated');
    this.userId = userId;
  }
}
