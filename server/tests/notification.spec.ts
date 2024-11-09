import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Notification, User } from '../types';

describe('POST /addNotification', () => {
  afterEach(async () => {
    await mongoose.connection.close(); // Ensure the connection is properly closed
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await mongoose.disconnect(); // Ensure mongoose is disconnected after all tests
  });

  test('should return 200 and the created notification if the response is successful', async () => {
    const now = new Date();
    const mockNotification: Notification = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fb'),
      targetId: '65e9b58910afe6e94fc6e6fe',
      type: 'question',
      text: 'Test notification',
      dateTime: now,
    };

    jest.spyOn(util, 'saveNotification').mockResolvedValue(mockNotification);
    jest.spyOn(util, 'addNotificationToUser').mockResolvedValue({
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
      notifications: [mockNotification._id],
    } as User);

    const response = await supertest(app).post('/notification/addNotification').send({
      uid: 'testUserId',
      notif: mockNotification,
    });

    response.body.dateTime = new Date(response.body.dateTime);
    response.body._id = new ObjectId(String(response.body._id));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockNotification);
  });

  test('should return 400 if the request body is empty', async () => {
    const input = {};

    const response = await supertest(app).post('/notification/addNotification').send(input);

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid request');
  });

  test('should return 400 if fields in the notification are invalid', async () => {
    const mockNotification: Notification = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      targetId: '',
      type: '',
      text: '',
      dateTime: new Date(),
    };

    const response = await supertest(app).post('/notification/addNotification').send({
      uid: 'testUserId',
      notif: mockNotification,
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid notification body');
  });

  test('should return 400 if the type is invalid', async () => {
    const mockNotification: Notification = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      targetId: '65e9b58910afe6e94fc6e6fe',
      type: 'invalidType',
      text: 'Test notification',
      dateTime: new Date(),
    };

    const response = await supertest(app).post('/notification/addNotification').send({
      uid: 'testUserId',
      notif: mockNotification,
    });

    expect(response.status).toBe(400);
    expect(response.text).toBe('Invalid notification body');
  });

  test('should return 500 if an error is returned by saveNotification', async () => {
    const mockNotification: Notification = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      targetId: '65e9b58910afe6e6fe',
      type: 'question',
      text: 'Test notification',
      dateTime: new Date(),
    };

    jest.spyOn(util, 'saveNotification').mockResolvedValueOnce({ error: 'Error' });

    const response = await supertest(app).post('/notification/addNotification').send({
      uid: 'testUserId',
      notif: mockNotification,
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error adding notification');
  });

  test('should return 500 if an error is returned by addNotificationToUser', async () => {
    const now = new Date();
    const mockNotification: Notification = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      targetId: '65e9b58910afe6e6fe',
      type: 'question',
      text: 'Test notification',
      dateTime: now,
    };

    jest.spyOn(util, 'saveNotification').mockResolvedValue(mockNotification);
    jest.spyOn(util, 'addNotificationToUser').mockResolvedValueOnce({ error: 'Error' });

    const response = await supertest(app).post('/notification/addNotification').send({
      uid: 'testUserId',
      notif: mockNotification,
    });

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error adding notification');
  });
});
