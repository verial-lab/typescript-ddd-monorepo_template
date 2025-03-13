import { BaseDomainEvent } from './BaseDomainEvent';

/**
 * User created event
 */
export class UserCreatedEvent extends BaseDomainEvent {
  userId: string;

  constructor(userId: string) {
    super('user.created');
    this.userId = userId;
  }
}
