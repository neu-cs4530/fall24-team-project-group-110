import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { LoginRequest, ResendCodeRequest, VerificationRequest } from '../types';
import { getUserById, getUserByUsername, populateUser, verifyUser } from '../models/application';
import { EmailService } from '../services/email';

const authController = (emailService: EmailService) => {
  const router = express.Router();

  /**
   * Validates the LoginRequest object to ensure it is not empty.
   *
   * @param req The LoginRequest to validate.
   *
   * @returns `true` if the request is valid, otherwise `false`.
   */
  const isRequestValid = (req: LoginRequest): boolean => !!req.body.username && !!req.body.password;

  /**
   * Logs in a user by checking if the username and password match the database.
   *
   * @param req The LoginRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const login = async (req: LoginRequest, res: Response): Promise<void> => {
    if (!isRequestValid(req)) {
      res.status(400).send('invalid login request');
      return;
    }

    try {
      const result = await getUserByUsername(req.body.username);
      if ('error' in result) {
        throw new Error(result.error);
      }

      if (
        (process.env.MODE === 'development' || process.env.MODE === 'production') &&
        result.verified === false
      ) {
        res.status(403).send('User is not verified');
        return;
      }

      if (!bcrypt.compareSync(req.body.password, result.password)) {
        throw new Error('invalid username or password');
      }

      // _id is guaranteed to be set at this point
      const populatedUser = await populateUser(result._id!.toString());
      if ('error' in populatedUser) {
        throw new Error(populatedUser.error);
      }

      // _id is guaranteed to be set at this point
      req.session.userId = populatedUser._id!.toString();
      req.session.verified = populatedUser.verified;
      res.status(200).send(populatedUser);
    } catch (err) {
      res.status(500).send(`Error when logging in`);
    }
  };

  /**
   * Validates the user session by checking if the username is set in the session.
   *
   * @param req The Request object containing the session data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const validate = async (req: Request, res: Response): Promise<void> => {
    try {
      // req.session.userId should be set at this point since auth middleware is called before this
      const result = await getUserById(req.session.userId!);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const populatedUser = await populateUser(result._id!.toString());
      if ('error' in populatedUser) {
        throw new Error(populatedUser.error);
      }

      res.status(200).send(populatedUser);
    } catch (err) {
      res.status(500).send('Error validating session');
    }
  };

  /**
   * Attempts to verify a user by checking if the provided code matches the stored code in the session.
   *
   * @param req The Request object containing the code and the session data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const verify = async (req: VerificationRequest, res: Response): Promise<void> => {
    const { code } = req.query;
    if (!code) {
      res.status(400).send('Missing verification code');
      return;
    }

    if (!req.session.code) {
      res.status(400).send('No verification code stored in session');
      return;
    }

    if (req.session.code !== code) {
      res.status(400).send('Invalid verification code');
      return;
    }

    try {
      const result = await verifyUser(req.session.userId!);
      if ('error' in result) {
        throw new Error(result.error);
      }

      const populatedUser = await populateUser(result._id!.toString());
      if ('error' in populatedUser) {
        throw new Error(populatedUser.error);
      }

      req.session.verified = true;
      res.status(200).send(populatedUser);
    } catch (err) {
      res.status(500).send('Error verifying user');
    }
  };

  /**
   * Resends the verification code to the user's email.
   *
   * @param req The Request object containing the email and the session data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const resendCode = async (req: ResendCodeRequest, res: Response): Promise<void> => {
    if (!req.query.email) {
      res.status(400).send('Missing email');
      return;
    }

    if (!req.session.code) {
      res.status(400).send('Verification code no longer exists');
      return;
    }

    try {
      await emailService.sendEmail({
        to: req.query.email,
        subject: 'FakeSO Verification Code',
        text: `Your verification code is: ${req.session.code}`,
      });

      res.sendStatus(204);
    } catch (err) {
      res.status(500).send('Error verifying user');
    }
  };

  /**
   * Logs out a user by destroying the session.
   *
   * @param req The LoginRequest object containing the user data.
   * @param res The HTTP response object used to send back the result of the operation.
   *
   * @returns A Promise that resolves to void.
   */
  const logout = (req: Request, res: Response): void => {
    req.session.destroy(err => {
      if (err) {
        res.status(500).send('Error when logging out');
      } else {
        res.sendStatus(204);
      }
    });
  };

  router.post('/login', login);
  router.get('/validate', validate);
  router.post('/logout', logout);
  router.post('/verify', verify);
  router.get('/resendCode', resendCode);

  return router;
};

export default authController;
