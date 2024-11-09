import express, { Response } from 'express';
import { Notification, AddNotificationRequest } from '../types';
import { addNotificationToUser, saveNotification } from '../models/application';

const notificationController = () => {
  const router = express.Router();

  /**
   * Checks if the provided notification request contains the required fields.
   *
   * @param req The request object containing the notification data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddNotificationRequest): boolean =>
    req.body &&
    req.body.notif &&
    typeof req.body.uid === 'string' &&
    typeof req.body.notif._id === 'string' &&
    typeof req.body.notif.targetId === 'string' &&
    typeof req.body.notif.type === 'string' &&
    typeof req.body.notif.text === 'string';

  /**
   * Checks if the provided notification contains the required fields.
   *
   * @param notification The notification object to validate.
   *
   * @returns `true` if the notification is valid, otherwise `false`.
   */
  const isNotificationValid = (notification: Notification): boolean =>
    notification.text !== undefined &&
    notification.text !== '' &&
    notification._id !== undefined &&
    notification._id.toString() !== '' &&
    notification.targetId !== undefined &&
    notification.targetId !== '' &&
    notification.type !== undefined &&
    notification.type !== '';

  /**
   * Adds a new notification in the database. The notification request is validated and then saved.
   *
   * @param req The NotificationRequest object containing the Notification ID and Notification data.
   *
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addNotification = async (req: AddNotificationRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }

    if (!isNotificationValid(req.body.notif)) {
      res.status(400).send('Invalid notification body');
      return;
    }
    const { uid } = req.body;
    const notifInfo: Notification = req.body.notif;

    try {
      const notFromDb = await saveNotification(notifInfo);
      if ('error' in notFromDb) {
        throw new Error(notFromDb.error as string);
      }
      const status = await addNotificationToUser(uid, notFromDb);
      if (status && 'error' in status) {
        throw new Error(status.error);
      }
    } catch (error) {
      res.status(500).send('Error adding notification');
    }
  };

  router.post('/addNotification', addNotification);

  return router;
};

export default notificationController;
