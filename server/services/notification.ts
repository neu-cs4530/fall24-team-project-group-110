import { createNotification } from '../models/application';
import { FakeSOSocket, User } from '../types';
import { EmailContent, EmailService } from './email';

/**
 * Send notifications to users from sender.
 *
 * @param recipients - List of users to send notifications.
 * @param type - The type of notification being sent.
 * @param text - The text content of the notification.
 * @param targetId - The ID associated with the notification.
 */
class NotificationService {
  private _socket: FakeSOSocket;
  private _emailService: EmailService;

  constructor(socket: FakeSOSocket, emailService: EmailService) {
    this._socket = socket;
    this._emailService = emailService;
  }

  async sendNotifications(
    recipients: User[],
    type: string,
    text: string,
    targetId: string,
  ): Promise<void> {
    try {
      await Promise.all(
        recipients.map(async user => {
          if (user._id) {
            const notification = await createNotification(
              user._id.toString(),
              type,
              text,
              targetId,
            );

            if ('error' in notification) {
              throw new Error('Error creating notification');
            }

            this._socket.emit('notificationUpdate', {
              uid: user._id.toString(),
              notification,
            });

            const content: EmailContent = {
              to: user.email,
              subject: 'New Notification',
              text: `You have a new notification: ${text}`,
            };

            if (user.emailNotifications) {
              this._emailService.sendEmail(content);
            }
          }
        }),
      );
    } catch (error) {
      throw new Error(`Error sending notifications: ${error}`);
    }
  }
}

export default NotificationService;
