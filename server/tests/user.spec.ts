import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

const saveUserSpy = jest.spyOn(util, 'saveUser');
const popDocSpy = jest.spyOn(util, 'populateDocument');

afterAll(async () => {
  await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
});

describe('POST /addUser', () => {
  const createMockUser = (userId: mongoose.Types.ObjectId) => ({
    _id: userId,
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'securepassword123',
    bio: 'Test user bio',
    picture: 'http://example.com/picture.jpg',
  });

  const setupMockReqBody = () => ({
    username: 'testUser',
    firstName: 'Test',
    lastName: 'User',
    email: 'testuser@example.com',
    password: 'securepassword123',
    bio: 'Test user bio',
    picture: 'http://example.com/picture.jpg',
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
    const validUid = new mongoose.Types.ObjectId();
    const mockUser = createMockUser(validUid);

    saveUserSpy.mockResolvedValueOnce(mockUser as User);

    const response = await supertest(app).post('/user/addUser').send(setupMockReqBody());

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      _id: validUid.toString(),
      username: 'testUser',
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      bio: 'Test user bio',
      picture: 'http://example.com/picture.jpg',
    });
  });

  it('should return bad request error if required fields are missing', async () => {
    const mockReqBody = { username: 'testUser' }; // Missing other required fields
    await assertErrorResponse(mockReqBody, 400, 'Invalid request');
  });

  it('should return bad request error if email format is invalid', async () => {
    const mockReqBody = {
      ...setupMockReqBody(),
      email: 'invalidEmailFormat',
    };
    await assertErrorResponse(mockReqBody, 400, 'Invalid email format');
  });

  it('should return database error in response if saveUser method throws an error', async () => {
    saveUserSpy.mockRejectedValueOnce(new Error('Error when saving a user'));

    const response = await supertest(app).post('/user/addUser').send(setupMockReqBody());

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding user: Error when saving a user');
  });

  it('should return database error in response if populateDocument method throws an error', async () => {
    const validUid = new mongoose.Types.ObjectId();
    const mockUser = createMockUser(validUid);

    saveUserSpy.mockResolvedValueOnce(mockUser as User);
    popDocSpy.mockRejectedValueOnce(new Error('Error when populating document'));

    const response = await supertest(app).post('/user/addUser').send(setupMockReqBody());

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error when adding user: Error when populating document');
  });
});
