import { createNotification, populateUser } from '../models/application';
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
      recipients.map(user => {
        if (user._id) {
          return createNotification(user._id.toString(), type, text, targetId);
        }
        return Promise.resolve();
      }),
    );
    await Promise.all(
      recipients.map(async user => {
        if (user._id) {
          const populatedUser = await populateUser(user._id.toString());
          if ('error' in populatedUser) {
            throw new Error('Error fetching and populating user');
          }
          socket.emit('notificationUpdate', user._id.toString());
        }
      }),
    );
  } catch (error) {
    throw new Error(`Error sending notifications: ${error}`);
  }
};

export default createNotification;
