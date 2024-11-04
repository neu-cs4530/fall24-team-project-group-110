// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
// startServer() is a function that starts the server
// the server will listen on .env.CLIENT_URL if set, otherwise 8000
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';
import * as http from 'http';
import session from 'express-session';

import answerController from './controller/answer';
import questionController from './controller/question';
import tagController from './controller/tag';
import commentController from './controller/comment';
import { FakeSOSocket } from './types';
import userController from './controller/user';
import conversationController from './controller/conversation';
import messageController from './controller/message';
import authController from './controller/auth';

dotenv.config();

const MONGO_URL = `${process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017'}/fake_so`;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
const port = parseInt(process.env.PORT || '8000');

mongoose
  .connect(MONGO_URL)
  .catch(err => console.log('MongoDB connection error: ', err));

const app = express();
const server = http.createServer(app);
const socket: FakeSOSocket = new Server(server, {
  cors: { origin: '*' },
});

function startServer() {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

socket.on('connection', socket => {
  console.log('A user connected ->', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

process.on('SIGINT', () => {
  server.close(() => {
    mongoose.disconnect();
    console.log('Server closed.');
    process.exit(0);
  });
  socket.close();
});

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  }),
);

app.use(express.json());

declare module 'express-session' {
  interface SessionData {
    username?: string;
  }
}

app.use(session({
  secret: 'fakeso',
  cookie: {
    // 60 minutes
    maxAge: 1000 * 60 * 60,
  },
  resave: false,
  saveUninitialized: false,
}));

// authentication middleware that excludes unprotected routes
// only include in development and production modes so that tests can run
app.use((req: Request, res: Response, next) => {
  if (!(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production')) {
    return next();
  }

  const unprotectedRoutes = new Set([
    '/user/addUser',
    '/auth/login',
  ])

  if (unprotectedRoutes.has(req.path)) {
    return next();
  }

  if (!req.session.username) {
    return res.status(401).send('unauthorized');
  }

  next();
});

app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
  res.end();
});

app.use('/auth', authController());
app.use('/question', questionController(socket));
app.use('/tag', tagController());
app.use('/answer', answerController(socket));
app.use('/comment', commentController(socket));
app.use('/user', userController(socket));
app.use('/conversation', conversationController());
app.use('/message', messageController());

// Export the app instance
export { app, server, startServer };
