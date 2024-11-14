import express, { Response } from 'express';
import bcrypt from 'bcryptjs';
import { User, AddUserRequest, FakeSOSocket, EditUserRequest, GetUserRequest } from '../types';
import { populateUser, saveUser, updateUserProfile } from '../models/application';

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
   * An object containing the invalid fields of a user and basic error messages.
   */
  interface InvalidUserFields {
    error: {
      [key: string]: string;
    };
  }

  /**
   * Validates the user object to ensure all fields are valid.
   *
   * @param user The user to validate.
   *
   * @returns An object containing the invalid fields.
   */
  const validateFields = (user: Partial<User>): InvalidUserFields => {
    const errors: InvalidUserFields = { error: {} };

    if (user.username !== undefined && user.username === '') {
      errors.error.username = 'Username cannot be empty';
    }

    if (user.password !== undefined && user.password === '') {
      errors.error.password = 'Password cannot be empty';
    }

    return errors;
  };

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
      notifications: [],
    };
    try {
      const result = await saveUser(user);
      if ('error' in result) {
        throw new Error(result.error);
      }

      req.session.userId = result._id!.toString();
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
    const { uid, newUserData } = req.body;

    if (
      (process.env.MODE === 'development' || process.env.MODE === 'production') &&
      uid !== req.session.userId
    ) {
      res.status(401).send('Unauthorized');
      return;
    }

    if (!uid || !newUserData) {
      res.status(400).send('Invalid request');
      return;
    }

    const errors = validateFields(newUserData);
    if (Object.keys(errors.error).length > 0) {
      res.status(400).json(errors);
      return;
    }

    if (newUserData.password) {
      newUserData.password = bcrypt.hashSync(newUserData.password, 10);
    }

    try {
      const result = await updateUserProfile(uid, newUserData);

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

  /**
   * Retrieves a user by its unique ID.
   *
   * @param req The GetUserRequest object containing the user ID.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const getUser = async (req: GetUserRequest, res: Response): Promise<void> => {
    const { uid } = req.params;

    try {
      const populatedUser = await populateUser(uid);

      if ('error' in populatedUser) {
        throw new Error(populatedUser.error);
      }

      res.json(populatedUser);
    } catch (err) {
      res.status(500).send('Error when getting user');
    }
  };

  router.post('/addUser', addUser);
  router.put('/updateUser', updateUser);
  router.get('/getUser/:uid', getUser);

  return router;
};

export default userController;
