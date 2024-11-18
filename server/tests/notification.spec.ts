import mongoose from 'mongoose';
import supertest from 'supertest';
import { ObjectId } from 'mongodb';
import { app } from '../app';
import * as util from '../models/application';
import { Notification, User } from '../types';

describe('Notification API Tests', () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('POST /addNotification', () => {
    test('should return 200 and the created notification if the response is successful', async () => {
      const now = new Date();
      const mockNotification: Notification = {
        _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fb'),
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
        verified: false,
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
  });

  describe('GET /getNotificationById/:nid', () => {
    test('should return 200 and the requested notification if it exists', async () => {
      const mockNotification: Notification = {
        _id: new mongoose.Types.ObjectId('65e9b58910afe6e94fc6e6fb'),
        targetId: '65e9b58910afe6e94fc6e6fe',
        type: 'question',
        text: 'Test notification',
        dateTime: new Date('2024-11-10T21:03:33.174Z'),
      };

      jest.spyOn(util, 'getNotificationById').mockResolvedValue(mockNotification);

      const response = await supertest(app).get(
        `/notification/getNotificationById/${mockNotification._id}`,
      );

      expect(response.status).toBe(200);
      response.body.dateTime = new Date(response.body.dateTime);
      expect(response.body).toEqual({
        _id: '65e9b58910afe6e94fc6e6fb',
        dateTime: new Date('2024-11-10T21:03:33.174Z'),
        targetId: '65e9b58910afe6e94fc6e6fe',
        text: 'Test notification',
        type: 'question',
      });
    });

    test('should return 500 if an error occurs when fetching the notification', async () => {
      jest.spyOn(util, 'getNotificationById').mockResolvedValueOnce({ error: 'Error' });

      const response = await supertest(app).get(
        '/notification/getNotificationById/65e9b58910afe6e94fc6e6fb',
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error fetching notification');
    });
  });

  describe('DELETE /deleteNotificationById/:uid/:nid', () => {
    test('should return 200 and the updated user if deletion is successful', async () => {
      const mockNotificationId = '65e9b58910afe6e94fc6e6fb';
      const mockUserId = '65e9b58910afe6e94fc6e6fe';

      const updatedUser: User = {
        _id: new mongoose.Types.ObjectId(mockUserId),
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

      jest.spyOn(util, 'deleteNotificationById').mockResolvedValue({
        _id: new mongoose.Types.ObjectId(mockNotificationId),
        targetId: '65e9b58910afe6e6fe',
        type: 'question',
        text: 'Deleted notification',
        dateTime: new Date(),
      });

      jest.spyOn(util, 'deleteNotificationFromUser').mockResolvedValue(updatedUser);

      const response = await supertest(app).delete(
        `/notification/deleteNotificationById/${mockUserId}/${mockNotificationId}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        _id: '65e9b58910afe6e94fc6e6fe',
        answers: [],
        bio: 'Test user bio',
        comments: [],
        email: 'testuser@example.com',
        firstName: 'Test',
        followers: [],
        following: [],
        lastName: 'User',
        notifications: [],
        password: 'password123',
        picture: 'http://example.com/picture.jpg',
        questions: [],
        username: 'testUser',
        verified: false,
      });
    });

    test('should return 500 if an error occurs while deleting notification by ID', async () => {
      const mockNotificationId = '65e9b58910afe6e94fc6e6fb';
      const mockUserId = '65e9b58910afe6e94fc6e6fe';

      jest.spyOn(util, 'deleteNotificationById').mockResolvedValueOnce({ error: 'Error' });

      const response = await supertest(app).delete(
        `/notification/deleteNotificationById/${mockUserId}/${mockNotificationId}`,
      );

      expect(response.status).toBe(500);
      expect(response.text).toBe('Error deleting notification');
    });
  });
});
