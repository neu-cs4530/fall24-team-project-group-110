import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Conversation collection.
 *
 * This schema defines the structure for storing conversations in the database.
 * Each conversation includes the following fields:
 * - `participants`: An array of the usernames of the users participating in the conversation.
 * - `updatedAt`: The date the conversation was last updated.
 * - 'notifyList': An array of user IDs to notify when a new message is sent.
 */
const conversationSchema: Schema = new Schema(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lastMessage: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    notifyList: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { collection: 'Conversation' },
);

export default conversationSchema;
