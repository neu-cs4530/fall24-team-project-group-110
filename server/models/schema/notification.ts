import { Schema } from 'mongoose';

/**
 * Mongoose schema for the Notification collection.
 *
 * This schema defines the structure of notifications used in the database.
 * Each notification includes the following fields:
 * - `type`: The type of notification.
 * - `text`: The content of the notification.
 * - `read`: A boolean value indicating whether the notification has been read.
 * - `link`: A link to the resource associated with the notification.
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
    read: {
      type: Boolean,
    },
    link: {
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
