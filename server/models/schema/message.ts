import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Message collection.
 *
 * This schema defines the structure for storing messages in the database.
 * Each message includes the following fields:
 * - `conversationId`: A reference to the `Conversation` document associated with the message.
 * - `sender`: A reference to the `User` document that sent the message.
 * - `text`: The content of the message.
 * - `sentAt`: The date the message was sent.
 */
const messageSchema: Schema = new Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'Message' },
);

export default messageSchema;
