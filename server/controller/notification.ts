import express, { Response } from 'express';
import { FindNotificationByIdAndUserRequest } from '../types';
import { deleteNotificationById, deleteNotificationFromUser } from '../models/application';

const notificationController = () => {
  const router = express.Router();

  const deleteNotification = async (
    req: FindNotificationByIdAndUserRequest,
    res: Response,
  ): Promise<void> => {
    try {
      const updatedUser = await deleteNotificationFromUser(req.params.uid, req.params.nid);
      if ('error' in updatedUser) {
        throw new Error(updatedUser.error);
      }

      const notification = await deleteNotificationById(req.params.nid);
      if ('error' in notification) {
        throw new Error(notification.error);
      }

      res.json(updatedUser);
    } catch (error) {
      res.status(500).send('Error deleting notification');
    }
  };

  router.delete('/deleteNotificationById/:uid/:nid', deleteNotification);

  return router;
};

export default notificationController;
