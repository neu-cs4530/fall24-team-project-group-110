import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  AddConversationRequest,
  changeUserToNotifyListRequest,
  Conversation,
  FakeSOSocket,
  FindConversationByIdRequest,
  FindConversationsByUsernameRequest,
} from '../types';
import {
  changeUserToNotifyListConversation,
  getConversationById,
  getConversationsByUserIdSortedByDateDesc,
  getUsersByUsernames,
  populateConversation,
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
    const { userId } = req.query;

    if (userId === undefined) {
      res.status(400).send('Invalid username requesting conversations.');
      return;
    }

    try {
      const clist: Conversation[] = await getConversationsByUserIdSortedByDateDesc(userId);

      const promises = clist.map(async conversation => {
        const populatedConversation = await populateConversation(conversation._id?.toString());
        if ('error' in populatedConversation) {
          throw new Error(populatedConversation.error);
        }
        return populatedConversation;
      });

      const populatedList = await Promise.all(promises);

      res.json(populatedList);
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
        const populatedConversation = await populateConversation(c._id?.toString());
        if ('error' in populatedConversation) {
          throw new Error(populatedConversation.error);
        }

        res.json(populatedConversation);
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

      const participants = users.map(u => u._id!);
      const conversation: Conversation = {
        participants,
        lastMessage: '',
        updatedAt: new Date(),
        notifyList: [],
      };

      const result = await saveConversation(conversation);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const populatedConversation = await populateConversation(result._id?.toString());
      if ('error' in populatedConversation) {
        throw new Error(populatedConversation.error);
      }

      socket.emit('conversationUpdate', populatedConversation);
      res.json(populatedConversation);
    } catch (error) {
      res.status(500).send('Error adding conversation');
    }
  };

  const changeUserToNotifyList = async (
    req: changeUserToNotifyListRequest,
    res: Response,
    type: 'add' | 'remove',
  ): Promise<void> => {
    if (!req.body.targetId || !req.body.uid) {
      res.status(400).send('Invalid request');
      return;
    }

    const { targetId, uid } = req.body;

    try {
      const result = await changeUserToNotifyListConversation(uid, targetId, type);

      if (result && 'error' in result) {
        throw new Error(result.error as string);
      }

      res.json(result);
    } catch (err) {
      res.status(500).send(`Error when ${type}ing user to notify list: ${(err as Error).message}`);
    }
  };

  /**
   * Handles adding a user to the notify list of a question.
   * @param req - The request object containing the question ID and the username.
   * @param res - The response object used to send back the result of the operation.
   */
  const addUserToNotifyList = async (
    req: changeUserToNotifyListRequest,
    res: Response,
  ): Promise<void> => {
    changeUserToNotifyList(req, res, 'add');
  };

  /**
   * Handles removing a user from the notify list of a question.
   * @param req - The request object containing the question ID and the username.
   * @param res - The response object used to send back the result of the operation.
   */
  const removeUserToNotifyList = async (
    req: changeUserToNotifyListRequest,
    res: Response,
  ): Promise<void> => {
    changeUserToNotifyList(req, res, 'remove');
  };

  router.get('/getConversations', getConversationsByUsername);
  router.get('/getConversation/:cid', getConversation);
  router.post('/addConversation', addConversation);
  router.post('/addUserToNotifyList', addUserToNotifyList);
  router.post('/removeUserToNotifyList', removeUserToNotifyList);

  return router;
};

export default conversationController;
