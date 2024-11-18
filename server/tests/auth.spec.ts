import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import * as util from '../models/application';
import { app } from '../app';

declare module 'express-session' {
  interface SessionData {
    userId?: string;
  }
}

describe('POST /login', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 400 if username is not provided', async () => {
    const mockReqBody = {
      password: 'password',
    };

    const response = await request(app).post('/auth/login').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return 400 if password is not provided', async () => {
    const mockReqBody = {
      username: 'username',
    };

    const response = await request(app).post('/auth/login').send(mockReqBody);

    expect(response.status).toBe(400);
  });

  it('should return 500 if an error is returned from getUserByUsername', async () => {
    const mockReqBody = {
      username: 'username',
      password: 'password',
    };

    jest.spyOn(util, 'getUserByUsername').mockResolvedValueOnce({ error: 'error' });

    const response = await request(app).post('/auth/login').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return 500 if an error occurs during bcrypt.compareSync', async () => {
    const mockReqBody = {
      username: 'username',
      password: 'password',
    };

    const mockUser = {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      bio: 'Test user bio',
      picture: 'http://example.com/picture.jpg',
      comments: [],
      questions: [],
      answers: [],
      followers: [],
      following: [],
      notifications: [],
      verified: false,
    };

    jest.spyOn(util, 'getUserByUsername').mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false);

    const response = await request(app).post('/auth/login').send(mockReqBody);

    expect(response.status).toBe(500);
  });

  it('should return 200 if login is successful', async () => {
    const mockReqBody = {
      username: 'username',
      password: 'password',
    };

    const mockUser = {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      bio: 'Test user bio',
      picture: 'http://example.com/picture.jpg',
      comments: [],
      questions: [],
      answers: [],
      followers: [],
      following: [],
      notifications: [],
      verified: false,
    };

    jest.spyOn(util, 'getUserByUsername').mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true);

    const response = await request(app).post('/auth/login').send(mockReqBody);

    expect(response.status).toBe(200);
  });
});

describe('GET /validate', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 500 if an error is returned by getUserByUsername', async () => {
    jest.spyOn(util, 'getUserByUsername').mockResolvedValueOnce({ error: 'error' });

    const response = await request(app).get('/auth/validate');

    expect(response.status).toBe(500);
  });

  it('should return 200 if validation is successful', async () => {
    const mockUser = {
      _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fe'),
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'password123',
      bio: 'Test user bio',
      picture: 'http://example.com/picture.jpg',
      comments: [],
      questions: [],
      answers: [],
      followers: [],
      following: [],
      notifications: [],
      verified: false,
    };

    jest.spyOn(util, 'getUserById').mockResolvedValueOnce(mockUser);

    const response = await request(app).get('/auth/validate');

    expect(response.status).toBe(200);
  });
});

describe('POST /logout', () => {
  afterEach(async () => {
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should return 204 if logout is successful', async () => {
    const response = await request(app).post('/auth/logout');

    expect(response.status).toBe(204);
  });
});
