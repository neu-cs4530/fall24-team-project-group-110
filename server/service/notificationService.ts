import { createNotification } from '../models/application';
import { FakeSOSocket, User } from '../types';

/**
 * Send notifications to users from sender.
 *
 * @param recipients - List of users to send notifications.
 * @param type - The type of notification being sent.
 * @param text - The text content of the notification.
 * @param targetId - The ID associated with the notification.
 */
export const sendNotification = async (
  socket: FakeSOSocket,
  recipients: User[],
  type: string,
  text: string,
  targetId: string,
): Promise<void> => {
  try {
    await Promise.all(
      recipients.map(async user => {
        if (user._id) {
          const notification = await createNotification(user._id.toString(), type, text, targetId);

          if ('error' in notification) {
            throw new Error('Error creating notification');
          }

          socket.emit('notificationUpdate', {
            uid: user._id.toString(),
            notification,
          });
        }
      }),
    );
  } catch (error) {
    throw new Error(`Error sending notifications: ${error}`);
  }
};

export default createNotification;
