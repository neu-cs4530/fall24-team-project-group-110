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

/**
 * Function to get a conversation by its id.
 *
 * @param qid - The id of the conversation to retrieve.
 * @throws Error if there is an issue fetching the conversation.
 */
const getNotificationById = async (nid: string): Promise<Notification> => {
  const res = await api.get(`${NOTIFICATION_API_URL}/getNotification/${nid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching notification by id');
  }
  return res.data;
};

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

export { getNotificationById, deleteNotification, addNotification };
