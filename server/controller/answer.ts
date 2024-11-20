import express, { Response } from 'express';
import {
  Answer,
  AnswerRequest,
  AnswerResponse,
  FakeSOSocket,
  QuestionResponse,
  User,
} from '../types';
import {
  addAnswerToQuestion,
  populateDocument,
  populateNotifyList,
  saveAnswer,
} from '../models/application';
import NotificationService from '../services/notification';

const answerController = (socket: FakeSOSocket, notificationService: NotificationService) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  function isRequestValid(req: AnswerRequest): boolean {
    return !!req.body.qid && !!req.body.ans;
  }

  /**
   * Checks if the provided answer contains the required fields.
   *
   * @param ans The answer object to validate.
   *
   * @returns `true` if the answer is valid, otherwise `false`.
   */
  function isAnswerValid(ans: Answer): boolean {
    return !!ans.text && !!ans.ansBy && !!ans.ansDateTime;
  }

  /**
   * Adds a new answer to a question in the database. The answer request and answer are
   * validated and then saved. If successful, the answer is associated with the corresponding
   * question. If there is an error, the HTTP response's status is updated.
   *
   * @param req The AnswerRequest object containing the question ID and answer data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addAnswer = async (req: AnswerRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid request');
      return;
    }
    if (!isAnswerValid(req.body.ans)) {
      res.status(400).send('Invalid answer');
      return;
    }

    const { qid } = req.body;
    const ansInfo: Answer = req.body.ans;

    try {
      const ansFromDb = await saveAnswer(ansInfo);
      if ('error' in ansFromDb) {
        throw new Error(ansFromDb.error as string);
      }

      const updatedQuestion = await addAnswerToQuestion(qid, ansFromDb);
      if (updatedQuestion && 'error' in updatedQuestion) {
        throw new Error(updatedQuestion.error as string);
      }

      // notification handling
      if (process.env.MODE === 'production' || process.env.MODE === 'development') {
        // id is guaranteed to exist because an error would have been thrown before otherwise
        const populatedUpdatedQuestion = (await populateDocument(
          updatedQuestion._id!.toString(),
          'question',
        )) as QuestionResponse;
        if (populatedUpdatedQuestion && 'error' in populatedUpdatedQuestion) {
          throw new Error(populatedUpdatedQuestion.error as string);
        }

        const populatedUpdatedQuestionWithNotifyList = await populateNotifyList(
          populatedUpdatedQuestion._id!.toString(),
          'question',
        );
        if (
          populatedUpdatedQuestionWithNotifyList &&
          'error' in populatedUpdatedQuestionWithNotifyList
        ) {
          throw new Error(populatedUpdatedQuestionWithNotifyList.error as string);
        }

        const recipients = populatedUpdatedQuestionWithNotifyList.notifyList.filter(
          user => user._id && user._id.toString() !== ansInfo.ansBy,
        ) as User[];
        notificationService.sendNotifications(
          recipients,
          'question',
          `A new answer has been posted by ${ansInfo.ansBy}`,
          populatedUpdatedQuestion._id!.toString(),
        );
      }

      const populatedAns = await populateDocument(ansFromDb._id?.toString(), 'answer');
      if (populatedAns && 'error' in populatedAns) {
        throw new Error(populatedAns.error as string);
      }

      // Populates the fields of the answer that was added and emits the new object
      socket.emit('answerUpdate', {
        qid,
        answer: populatedAns as AnswerResponse,
      });
      res.json(ansFromDb);
    } catch (err) {
      res.status(500).send(`Error when adding answer: ${(err as Error).message}`);
    }
  };

  // add appropriate HTTP verbs and their endpoints to the router.
  router.post('/addAnswer', addAnswer);

  return router;
};

export default answerController;
