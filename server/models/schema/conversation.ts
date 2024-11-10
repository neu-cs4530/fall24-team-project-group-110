import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Conversation collection.
 *
 * This schema defines the structure for storing conversations in the database.
 * Each conversation includes the following fields:
 * - `participants`: An array of the usernames of the users participating in the conversation.
 * - `updatedAt`: The date the conversation was last updated.
 */
const conversationSchema: Schema = new Schema(
  {
    participants: [
      {
        type: String,
      },
    ],
    lastMessage: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { collection: 'Conversation' },
);

export default conversationSchema;
