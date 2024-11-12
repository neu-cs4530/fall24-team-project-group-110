import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure of notifications used in the database.
 * Each notification includes the following fields:
 * - `type`: The type of notification.
 * - `text`: The content of the notification.
 * - `targetId`: The id for the associated object for the notification (ex. Question or Conversation).
 * - `dateTime`: The date and time when the notification was created.
 */
const notificationSchema: Schema = new Schema(
  {
    type: {
      type: String,
      required: true,
    },
    text: {
      type: String,
    },
    targetId: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
    },
  },
  { collection: 'Notification' },
);

export default notificationSchema;
