import express, { Response } from 'express';
import { LoginRequest } from '../types';
import { getUserByUsername } from '../models/application';
import bcrypt from 'bcryptjs';

const authController = () => {
  const router = express.Router();

  const isRequestValid = (req: LoginRequest): boolean =>
    !!req.body.username && !!req.body.password;

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

      if (!bcrypt.compareSync(req.body.password, result.password)) {
        res.status(401).send('invalid username or password');
        return;
      }

      req.session.username = req.body.username;
      res.sendStatus(204);
    } catch (err) {
      res.status(500).send(`Error when logging in`);
    }
  };

  const logout = (req: LoginRequest, res: Response): void => {
    req.session.destroy((err) => {
      if (err) {
        res.status(500).send('Error when logging out');
      } else {
        res.sendStatus(204);
      }
    });
  }

  router.post('/login', login);
  router.post('/logout', logout);

  return router;
}

export default authController;