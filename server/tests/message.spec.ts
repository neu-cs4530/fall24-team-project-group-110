import mongoose from "mongoose";
import supertest from "supertest";
import { app } from "../app";
import * as util from "../models/application";
import { Conversation, Message } from "../types";
import { ObjectId } from "mongodb";

describe("POST /addMessage", () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await mongoose.connection.close();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  test('should return 200 and the created message if the response is successful', async () => {
    const now = new Date();
    const mockMessage: Message = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      conversationId: '65e9b58910afe6e94fc6e6fe',
      sender: 'testUser',
      text: 'Hello, world!',
      sentAt: now,
    };

    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: ['testUser', 'anotherUser'],
      updatedAt: now,
    }

    jest.spyOn(util, 'getConversationById').mockResolvedValue(mockConversation);
    jest.spyOn(util, 'saveMessage').mockResolvedValue(mockMessage);

    const response = await supertest(app).post('/message/addMessage').send(mockMessage);

    response.body.sentAt = new Date(response.body.sentAt);
    response.body._id = new ObjectId(String(response.body._id));
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockMessage);
  });

  test('should return 400 if the request body is empty', async () => {
    const input = {};

    const response = await supertest(app).post('/message/addMessage').send(input);

    expect(response.status).toBe(400);
  });

  test('should return 400 if fields are invalid', async () => {
    const mockMessage: Message = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      conversationId: '',
      sender: '',
      text: '',
      sentAt: new Date(),
    };

    const response = await supertest(app).post('/message/addMessage').send(mockMessage);

    expect(response.status).toBe(400);
  });

  test('should return 500 if an error is returned by getConversationById', async () => {
    const mockMessage: Message = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      conversationId: '65e9b58910afe6e94fc6e6fe',
      sender: 'testUser',
      text: 'Hello, world!',
      sentAt: new Date(),
    };

    jest.spyOn(util, 'getConversationById').mockResolvedValueOnce({ error: 'Error' });

    const response = await supertest(app).post('/message/addMessage').send(mockMessage);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error adding message');
  });

  test('should return 500 if an error is returned by saveMessage', async () => {
    const now = new Date();
    const mockMessage: Message = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      conversationId: '65e9b58910afe6e94fc6e6fe',
      sender: 'testUser',
      text: 'Hello, world!',
      sentAt: now,
    };

    const mockConversation: Conversation = {
      _id: new ObjectId('65e9b58910afe6e94fc6e6fe'),
      participants: ['testUser', 'anotherUser'],
      updatedAt: now,
    }

    jest.spyOn(util, 'getConversationById').mockResolvedValueOnce(mockConversation);

    jest.spyOn(util, 'saveMessage').mockResolvedValueOnce({ error: 'Error' });

    const response = await supertest(app).post('/message/addMessage').send(mockMessage);

    expect(response.status).toBe(500);
    expect(response.text).toBe('Error adding message');
  });
});