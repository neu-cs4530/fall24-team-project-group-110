import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, AddUserRequest, FakeSOSocket, EditUserRequest } from '../types';
import { saveUser, updateUserProfile } from '../models/application';

const userController = (socket: FakeSOSocket) => {
  const router = express.Router();

  /**
   * Validates the user object to ensure it is not empty.
   *
   * @param user The user to validate.
   *
   * @returns `true` if the user is valid, otherwise `false`.
   */
  const isUserValid = (user: User): boolean =>
    user.password !== undefined &&
    user.password !== '' &&
    user.username !== undefined &&
    user.username !== '';

  /**
   * Adds a new user to the database. The user is first validated and then saved.
   *
   * @param req The AddUserRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const addUser = async (req: AddUserRequest, res: Response): Promise<void> => {
    if (!isUserValid(req.body)) {
      res.status(400).send('Invalid user');
      return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    // add default values for new user and hashed password
    const user: User = {
      ...req.body,
      password: hashedPassword,
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
      picture: '',
      comments: [],
      questions: [],
      answers: [],
      followers: [],
      following: [],
    };
    try {
      const result = await saveUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      req.session.username = user.username;
      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when saving user: ${err.message}`);
      } else {
        res.status(500).send(`Error when saving user`);
      }
    }
  };

  /**
   * Updates a user in the database. If there is an error, the HTTP response's status is updated.
   *
   * @param req The EditUserRequest object containing the user ID and the new user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const updateUser = async (req: EditUserRequest, res: Response): Promise<void> => {
    const { qid, newUserData } = req.body;

    if (newUserData.password) {
      newUserData.password = bcrypt.hashSync(newUserData.password, 10);
    }

    try {
      const result = await updateUserProfile(qid, newUserData);

      if ('error' in result) {
        throw new Error(result.error);
      }

      res.json(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).send(`Error when updating user: ${err.message}`);
      } else {
        res.status(500).send(`Error when updating user`);
      }
    }
  };

  router.post('/addUser', addUser);
  router.put('/updateUser', updateUser);

  return router;
};

export default userController;
