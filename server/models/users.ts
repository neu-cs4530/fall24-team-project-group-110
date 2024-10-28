// Question Document Schema
import mongoose, { Model } from 'mongoose';
import userSchema from './schema/user';
import { User } from '../types';

/**
 * Mongoose model for the `Question` collection.
 *
 * This model is created using the `Question` interface and the `questionSchema`, representing the
 * `Question` collection in the MongoDB database, and provides an interface for interacting with
 * the stored questions.
 *
 * @type {Model<User>}
 */
const UserModel: Model<User> = mongoose.model<User>('User', userSchema);

export default UserModel;
