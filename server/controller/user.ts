import express, { Response } from 'express';
import { User, AddUserRequest, FakeSOSocket } from '../types';
import { populateDocument, saveUser } from '../models/application';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Checks if the provided answer request contains the required fields.
   *
   * @param req The request object containing the answer data.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: AddUserRequest): boolean =>
    !!req.body.firstName &&
    !!req.body.lastName &&
    !!req.body.questions &&
    !!req.body.answers &&
    !!req.body.comments;

  /**
   * Validates the comment object to ensure it is not empty.
   *
   * @param user The user to validate.
   *
   * @returns `true` if the user is valid, otherwise `false`.
   */
  const isUserValid = (user: User): boolean =>
    user._id !== undefined &&
    user.firstName !== '' &&
    user.lastName !== '' &&
    user.questions !== undefined &&
    user.answers !== undefined &&
    user.comments !== undefined;

  /**
   * Adds a new user to the database. The user is first validated and then saved.
   *
   * @param req The AddUserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUser = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('Invalid user request');
      return;
    }

    if (!isUserValid(req.body)) {
      res.status(400).send('Invalid user');
      return;
    }

    const user: User = req.body;
    try {
      const result = await saveUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Populates the fields of the user that was added, and emits the new object
      const populatedUser = await populateDocument(result._id?.toString(), 'user');

      if (populatedUser && 'error' in populatedUser) {
        throw new Error(populatedUser.error);
      }

      socket.emit('userUpdate', populatedUser as User);
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  router.post('/addUser', addUser);

  return router;
};

export default userController;
