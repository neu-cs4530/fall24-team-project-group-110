import api from './config';
import { User } from '../types';

const NOTIFICATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Function to delete a notification by the user id and notification id.
 *
 * @param uid - The id of the user the notification belongs to.
 * @param nid - The id of the notification.
 * @throws Error if there is an issue deleting the notification.
 */
const deleteNotification = async (uid: string, nid: string): Promise<User> => {
  const res = await api.delete(`${NOTIFICATION_API_URL}/deleteNotificationById/${uid}/${nid}`);
  if (res.status !== 200) {
    throw new Error('Error while deleting notification');
  }
  return res.data;
};

export default deleteNotification;
