import mongoose from 'mongoose';
import supertest from 'supertest';
import { app } from '../app';
import * as util from '../models/application';
import { User } from '../types';

describe('Notification API Tests', () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
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
