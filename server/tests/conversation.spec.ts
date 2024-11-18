import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Conversation, User } from '../types';

const user1: User = {
  _id: new ObjectId('65e9b716ff0e892116b2de19'),
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

const user2: User = {
  _id: new ObjectId('65e9b716ff0e892116b2de12'),
  username: 'testUser2',
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

describe('POST /addConversation', () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should return 200 and the created conversation if the response is successful', async () => {
    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: [user1._id!, user2._id!],
      lastMessage: '',
      updatedAt: new Date(),
      notifyList: [],
    };

    const mockPopulatedConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: [
        {
          _id: new ObjectId('65e9b716ff0e892116b2de19'),
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
        },
        {
          _id: new ObjectId('65e9b716ff0e892116b2de12'),
          username: 'testUser2',
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
        },
      ],
      lastMessage: '',
      updatedAt: new Date(),
      notifyList: [],
    };

    jest.spyOn(util, 'getUsersByUsernames').mockResolvedValue([user1, user2]);
    jest.spyOn(util, 'saveConversation').mockResolvedValue(mockConversation);
    jest.spyOn(util, 'populateConversation').mockResolvedValue(mockPopulatedConversation);

    const response = await supertest(app)
      .post('/conversation/addConversation')
      .send(mockConversation);

    response.body.updatedAt = new Date(response.body.updatedAt);
    response.body._id = new ObjectId(String(response.body._id));
    response.body.participants = response.body.participants.map((participant: User) => {
      participant._id = new ObjectId(String(participant._id));
      return participant;
    });
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedConversation);
  });

  test('should return 400 if the request body is empty', async () => {
    const input = {};

    const response = await supertest(app).post('/conversation/addConversation').send(input);

    expect(response.status).toBe(400);
  });

  test('should return 400 if there are less than 2 participants', async () => {
    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: [new ObjectId('64e9b58910afe6e94fc6e6fe')],
      lastMessage: '',
      updatedAt: new Date(),
      notifyList: [],
    };

    const response = await supertest(app)
      .post('/conversation/addConversation')
      .send(mockConversation);

    expect(response.status).toBe(400);
  });

  test('should return 404 if an error is returned by getUsersByUsernames', async () => {
    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: [
        new ObjectId('64e9b58910afe6e94fc6e6fe'),
        new ObjectId('63e9b58910afe6e94fc6e6fe'),
      ],
      lastMessage: '',
      updatedAt: new Date(),
      notifyList: [],
    };

    jest.spyOn(util, 'getConversationById').mockResolvedValueOnce({ error: 'Error' });

    const response = await supertest(app)
      .post('/conversation/addConversation')
      .send(mockConversation);

    expect(response.status).toBe(404);
  });

  test('should return 404 if less than 2 users are returned', async () => {
    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: [
        new ObjectId('64e9b58910afe6e94fc6e6fe'),
        new ObjectId('63e9b58910afe6e94fc6e6fe'),
      ],
      lastMessage: '',
      updatedAt: new Date(),
      notifyList: [],
    };

    jest.spyOn(util, 'getUsersByUsernames').mockResolvedValueOnce([user1]);

    const response = await supertest(app)
      .post('/conversation/addConversation')
      .send(mockConversation);

    expect(response.status).toBe(404);
  });

  test('should return 500 if an error is returned by saveConversation', async () => {
    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: [
        new ObjectId('64e9b58910afe6e94fc6e6fe'),
        new ObjectId('63e9b58910afe6e94fc6e6fe'),
      ],
      lastMessage: '',
      updatedAt: new Date(),
      notifyList: [],
    };

    jest.spyOn(util, 'getUsersByUsernames').mockResolvedValueOnce([user1, user2]);
    jest.spyOn(util, 'saveConversation').mockResolvedValueOnce({ error: 'Error' });

    const response = await supertest(app)
      .post('/conversation/addConversation')
      .send(mockConversation);

    expect(response.status).toBe(500);
  });
});
