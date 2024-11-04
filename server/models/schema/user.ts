import { Schema } from 'mongoose';
/**
 * Mongoose schema for the Answer collection.
 *
 * This schema defines the structure for storing answers in the database.
 * Each answer includes the following fields:
 * - `username`: A string of a user choosen username.
 * - `firstName`: User's first name
 * - `lastName`: User's last name
 * - `email`: User's email address
 * - `password`: User's password
 * - `bio`: String description of user
 * - `picture`: String url of user's profile picture
 * - `comments`: An array of references to `Comment` documents associated with the answer.
 * - `questions`: An array of references to `Question` documents associated with the answer.
 * - `answers`: An array of references to `Answer` documents associated with the answer.
 * - `followers`: An array of references to `User` documents that are following the user.
 * - `following`: An array of references to `User` documents that the user is following.
 */
const userSchema: Schema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    bio: {
      type: String,
    },
    picture: {
      type: String,
    },

    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    answers: [{ type: Schema.Types.ObjectId, ref: 'Answer' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    notifications: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
  },
  { collection: 'User' },
);

export default userSchema;
