import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  AddConversationRequest,
  Conversation,
  FakeSOSocket,
  FindConversationByIdRequest,
  FindConversationsByUsernameRequest,
} from '../types';
import {
  getConversationById,
  getConversationsByUsernameSortedByDateDesc,
  getUsersByUsernames,
  saveConversation,
} from '../models/application';

const conversationController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Retrieves a list of conversations by the username they are associated in the participants.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindConversationsByUsernameRequest object containing the username as a query parameter.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getConversationsByUsername = async (
    req: FindConversationsByUsernameRequest,
    res: Response,
  ): Promise<void> => {
    const { username } = req.query;

    if (username === undefined) {
      res.status(400).send('Invalid username requesting conversations.');
      return;
    }

    try {
      const clist: Conversation[] = await getConversationsByUsernameSortedByDateDesc(username);
      res.json(clist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

  /**
   * Retrieves a conversation by its unique ID.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindConversationByIdRequest object containing the conversation id as a parameter.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getConversation = async (
    req: FindConversationByIdRequest,
    res: Response,
  ): Promise<void> => {
    const { cid } = req.params;

    if (!ObjectId.isValid(cid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const c = await getConversationById(cid);

      if (c && !('error' in c)) {
        res.json(c);
        return;
      }

      throw new Error('Error while fetching conversation by id');
    } catch (err) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching questions by filter: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching questions by filter`);
      }
    }
  };

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
    if (!req.body.participants || req.body.participants.length < 2) {
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

      socket.emit('conversationUpdate', result);
      res.json(result);
    } catch (error) {
      res.status(500).send('Error adding conversation');
    }
  };

  router.get('/getConversations', getConversationsByUsername);
  router.get('/getConversation/:cid', getConversation);
  router.post('/addConversation', addConversation);

  return router;
};

export default conversationController;
