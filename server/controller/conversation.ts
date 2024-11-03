import express, { Response } from 'express';
import { AddConversationRequest } from '../types';
import { getUsersByUsernames, saveConversation } from '../models/application';

const conversationController = () => {
  const router = express.Router();

  /**
   * Adds a new conversation in the database. The conversation request is validated and then saved.
   * If successful, the conversation is associated with the corresponding users. If there is an error,
   * the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addConversation = async (req: AddConversationRequest, res: Response): Promise<void> => {
    if (!req.body.participants || req.body.participants.length !== 2) {
      res.status(400).send('Invalid request');
      return;
    }

    try {
      const users = await getUsersByUsernames(req.body.participants);
      if ('error' in users || users.length !== req.body.participants.length) {
        res.status(404).send('Users not found');
        return;
      }
      
      const result = await saveConversation(req.body);
      if ('error' in result) {
        throw new Error(result.error);
      }

      res.json(result);
    } catch (error) {
      res.status(500).send('Error adding conversation');
    }
  };

  router.post('/addConversation', addConversation);

  return router;
};

export default conversationController;