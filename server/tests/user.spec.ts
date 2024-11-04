import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const updateUserProfileSpy = jest.spyOn(util, 'updateUserProfile');
// const popDocSpy = jest.spyOn(util, 'populateDocument');

describe('POST /addUser', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

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
    notifications: [],
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
    notifications: [],
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

  describe('POST /addUser', () => {
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
        notifications: [],
      });
    });

    it('should return bad request error if required fields are missing', async () => {
      const mockReqBody = { username: 'testUser' }; // Missing other required fields
      await assertErrorResponse(mockReqBody, 400, 'Invalid user');
    });

    it('should return database error in response if saveUser method throws an error', async () => {
      saveUserSpy.mockRejectedValueOnce(new Error('Error when saving a user'));

      const response = await supertest(app).post('/user/addUser').send(setupMockReqBody());

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when saving user: Error when saving a user');
    });
  });

  describe('PUT /updateUser', () => {
    afterEach(async () => {
      await mongoose.connection.close(); // Ensure the connection is properly closed
    });

    afterAll(async () => {
      await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
    });

    it('should update a user successfully', async () => {
      const mockUser = createMockUser();
      mockUser.username = 'newTestUser';
      mockUser.firstName = 'newTest';
      mockUser.lastName = 'newUser';

      const mockNewUserData = {
        username: 'newTestUser',
        firstName: 'newTest',
        lastName: 'newUser',
      };

      const mockReqBody = {
        qid: mockUser._id,
        newUserData: mockNewUserData,
      };

      updateUserProfileSpy.mockResolvedValueOnce(mockUser);

      const response = await supertest(app).put('/user/updateUser').send(mockReqBody);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: '65e9b58910afe6e94fc6e6fe',
        username: 'newTestUser',
        firstName: 'newTest',
        lastName: 'newUser',
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

    it('should return 500 error in the response if updateUserProfile throws an error', async () => {
      updateUserProfileSpy.mockRejectedValueOnce(new Error('Error when updating user'));

      const mockReqBody = {
        qid: createMockUser(),
        newUserData: {},
      };

      const response = await supertest(app).put('/user/updateUser').send(mockReqBody);

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error when updating user: Error when updating user');
    });

    it('should return 400 error if newUserData field is missing', async () => {
      const mockReqBody = { qid: createMockUser()._id };

      const response = await supertest(app).put('/user/updateUser').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request');
    });

    it('should return 400 error if qid field is missing', async () => {
      const mockReqBody = { newUserData: {} };

      const response = await supertest(app).put('/user/updateUser').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.text).toBe('Invalid request');
    });

    it('should return 400 error if newUserData fields are invalid', async () => {
      const mockReqBody = {
        qid: createMockUser()._id,
        newUserData: {
          username: '',
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          bio: '',
          picture: '',
        },
      };

      const expectedResponse = {
        error: {
          username: 'Username cannot be empty',
          firstName: 'Password cannot be empty',
          lastName: 'Last name cannot be empty',
          email: 'Email cannot be empty and must contain an @ symbol',
          password: 'Password cannot be empty',
          bio: 'Bio cannot be empty',
          picture: 'Picture cannot be empty',
        },
      };

      const response = await supertest(app).put('/user/updateUser').send(mockReqBody);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(expectedResponse);
    });
  });
});
