import { Notification } from '../types';
import api from './config';

const NOTIFCATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/notification`;

/**
 * Adds a new answer to a specific question.
 *
 * @param uid - The ID of the user to which the notification is being added.
 * @param notif - The notification object containing the notification details.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addNotification = async (uid: string, notif: Notification): Promise<Notification> => {
  const data = { uid, notif };

  const res = await api.post(`${NOTIFCATION_API_URL}/addNotification`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new notification');
  }
  return res.data;
};

export default addNotification;
