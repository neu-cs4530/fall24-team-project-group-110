import express, { Response } from 'express';
import { ObjectId } from 'mongodb';
import {
  AddMessageRequest,
  FakeSOSocket,
  FindMessagesByConversationIdRequest,
  Message,
  User,
} from '../types';
import {
  saveMessage,
  getConversationById,
  getMessagesSortedByDateAsc,
  updateConversationWithMessage,
  populateConversation,
  populateMessage,
} from '../models/application';
import NotificationService from '../services/notification';

const messageController = (socket: FakeSOSocket, notificationService: NotificationService) => {
  const router = express.Router();

  /**
   * Retrieves a list of messages by what conversation they are associated with based on the conversation id.
   * If there is an error, the HTTP response's status is updated.
   *
   * @param req The FindMessagesByConversationIdRequest object containing the conversation ID as a parameter
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getMessagesByConversationId = async (
    req: FindMessagesByConversationIdRequest,
    res: Response,
  ): Promise<void> => {
    const { qid } = req.params;

    if (!ObjectId.isValid(qid)) {
      res.status(400).send('Invalid ID format');
      return;
    }

    try {
      const mlist = await getMessagesSortedByDateAsc(qid);

      res.json(mlist);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when fetching messages in order: ${err.message}`);
      } else {
        res.status(500).send(`Error when fetching messages in order`);
      }
    }
  };

  /**
   * Interface representing errors containing the invalid field and error messages.
   */
  interface InvalidMessageFields {
    error: {
      [key: string]: string;
    };
  }

  /**
   * Validates the fields of a message object.
   *
   * @param message The message object to validate.
   *
   * @returns An object containing the invalid fields and their corresponding error messages.
   */
  const validateFields = (message: Message): InvalidMessageFields => {
    const errors: InvalidMessageFields = { error: {} };

    if (!message.conversationId || message.conversationId === '') {
      errors.error.conversationId = 'Conversation ID is required';
    }

    if (!message.sender) {
      errors.error.sender = 'Sender is required';
    }

    if (!message.text || message.text === '') {
      errors.error.text = 'Message text is required';
    }

    return errors;
  };

  /**
   * Adds a new message to a conversation in the database. The message request is validated and then saved.
   * If successful, the message is associated with the corresponding conversation. If there is an error,
   * the HTTP response's status is updated.
   *
   * @param req The AddMessageRequest object containing the conversation ID and message data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addMessage = async (req: AddMessageRequest, res: Response): Promise<void> => {
    if (!req.body) {
      res.status(400).send('Invalid request');
      return;
    }

    const errors = validateFields(req.body);
    if (Object.keys(errors.error).length > 0) {
      res.status(400).json(errors);
      return;
    }

    try {
      const conversation = await getConversationById(req.body.conversationId);
      if ('error' in conversation) {
        throw new Error(conversation.error);
      }

      const result = await saveMessage(req.body);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const populatedMessage = await populateMessage(result._id!.toString());
      if ('error' in populatedMessage) {
        throw new Error(populatedMessage.error);
      }

      const updatedConversation = await updateConversationWithMessage(result);
      if ('error' in updatedConversation) {
        throw new Error(updatedConversation.error);
      }

      const populatedUpdatedConversation = await populateConversation(req.body.conversationId);
      if ('error' in populatedUpdatedConversation) {
        throw new Error(populatedUpdatedConversation.error);
      }

      const recipients = populatedUpdatedConversation.participants.filter(
        user => user._id && user._id.toString() !== result.sender._id!.toString(),
      ) as User[];
      if (process.env.MODE === 'production' || process.env.MODE === 'development') {
        notificationService.sendNotifications(
          recipients,
          'conversation',
          'You have received a message.',
          populatedUpdatedConversation._id!.toString(),
        );
      }

      socket.to(req.body.conversationId).emit('newMessage', populatedMessage);
      socket.emit('conversationUpdate', populatedUpdatedConversation);
      res.json(result);
    } catch (error) {
      res.status(500).send('Error adding message');
    }
  };

  router.get('/getMessagesByConvoId/:qid', getMessagesByConversationId);
  router.post('/addMessage', addMessage);

  return router;
};

export default messageController;
