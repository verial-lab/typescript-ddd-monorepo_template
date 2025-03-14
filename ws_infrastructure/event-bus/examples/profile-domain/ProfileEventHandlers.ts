import type {
  ProfileCreatedEvent,
  ProfileDeletedEvent,
  ProfileUpdatedEvent,
} from '@repo-domains/profile';
import { ProfileEventTypes } from '@repo-domains/profile';
import type { EventHandler } from '../../src/types';
import type { NotificationService } from './NotificationService';

/**
 * Handles profile domain events
 */
export class ProfileEventHandlers {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * Handle profile created events
   */
  public readonly onProfileCreated: EventHandler<ProfileCreatedEvent> = async (event) => {
    await this.notificationService.sendWelcomeEmail(event.payload.userId);
  };

  /**
   * Handle profile updated events
   */
  public readonly onProfileUpdated: EventHandler<ProfileUpdatedEvent> = async (event) => {
    if (event.payload.changes.displayName) {
      await this.notificationService.notifyDisplayNameChanged(
        event.payload.userId,
        event.payload.changes.displayName
      );
    }
  };

  /**
   * Handle profile deleted events
   */
  public readonly onProfileDeleted: EventHandler<ProfileDeletedEvent> = async (event) => {
    await this.notificationService.sendGoodbyeEmail(event.payload.userId, event.payload.reason);
  };
}
