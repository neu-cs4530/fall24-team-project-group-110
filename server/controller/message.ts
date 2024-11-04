import express, { Response } from 'express';
import { AddMessageRequest, FakeSOSocket, Message } from '../types';
import { saveMessage, getConversationById } from '../models/application';

const messageController = (socket: FakeSOSocket) => {
  const router = express.Router();

  interface InvalidMessageFields {
    error: {
      [key: string]: string;
    };
  }

  /**
   * Validates the fields of a message object.
   *
   * @param message The message object to validate.
   * @returns An object containing the invalid fields and their corresponding error messages.
   */
  const validateFields = (message: Message): InvalidMessageFields => {
    const errors: InvalidMessageFields = { error: {} };

    if (!message.conversationId || message.conversationId === '') {
      errors.error.conversationId = 'Conversation ID is required';
    }

    if (!message.sender || message.sender === '') {
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
   * @param req The AnswerRequest object containing the question ID and answer data.
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

      socket.to(req.body.conversationId).emit('newMessage', result);

      res.json(result);
    } catch (error) {
      res.status(500).send('Error adding message');
    }
  };

  router.post('/addMessage', addMessage);

  return router;
};

export default messageController;
