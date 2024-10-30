import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');

afterAll(async () => {
  await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
});

describe('POST /addUser', () => {
  const createMockUser = () => ({
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
  });

  const setupMockReqBody = () => ({
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'securepassword123',
    bio: 'Test user bio',
    picture: 'http://example.com/picture.jpg',
    comments: [],
    questions: [],
    answers: [],
    followers: [],
    following: [],
  });

  const assertErrorResponse = async (
    mockReqBody: string | object | undefined,
    expectedStatus: number,
    expectedMessage: string,
  ) => {
    const response = await supertest(app).post('/user/addUser').send(mockReqBody);
    expect(response.status).toBe(expectedStatus);
    expect(response.text).toBe(expectedMessage);
  };

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should add a new user successfully', async () => {
    const mockUser = createMockUser();

    saveUserSpy.mockResolvedValueOnce(mockUser as User);

    const response = await supertest(app).post('/user/addUser').send(setupMockReqBody());

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: '65e9b58910afe6e94fc6e6fe',
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      password: 'password123',
      email: 'testuser@example.com',
      bio: 'Test user bio',
      picture: 'http://example.com/picture.jpg',
      comments: [],
      questions: [],
      answers: [],
      followers: [],
      following: [],
    });
  });

  it('should return bad request error if required fields are missing', async () => {
    const mockReqBody = { username: 'testUser' }; // Missing other required fields
    await assertErrorResponse(mockReqBody, 400, 'Invalid user request');
  });

  it('should return bad request error if email format is invalid', async () => {
    const mockReqBody = {
      ...setupMockReqBody(),
      email: 'invalidEmailFormat',
    };
    await assertErrorResponse(mockReqBody, 400, 'Invalid user');
  });

  it('should return database error in response if saveUser method throws an error', async () => {
    saveUserSpy.mockRejectedValueOnce(new Error('Error when saving a user'));

    const response = await supertest(app).post('/user/addUser').send(setupMockReqBody());

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when saving user: Error when saving a user');
  });
});
