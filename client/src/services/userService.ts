import api from './config';
import { EditableUserFields, User } from '../types';

const USER_API_URL = `${process.env.REACT_APP_SERVER_URL}/user`;

/**
 * Adds a new user to the database.
 *
 * @param username - The usename of the new user.
 * @param password - The password of the new user.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const addUser = async (username: string, email: string, password: string): Promise<User> => {
  const data = { username, email, password };

  const res = await api.post(`${USER_API_URL}/addUser`, data);
  if (res.status !== 200) {
    throw new Error('Error while creating a new user');
  }

  return res.data;
};

const getUser = async (id: string): Promise<User> => {
  const res = await api.get(`${USER_API_URL}/getUser/${id}`);
  if (res.status !== 200) {
    throw new Error('Error while fetching user');
  }

  return res.data;
};

const updateUser = async (id: string, updatedFields: EditableUserFields): Promise<User> => {
  const res = await api.put(`${USER_API_URL}/updateUser`, {
    uid: id,
    newUserData: updatedFields,
  });
  if (res.status !== 200) {
    throw new Error('Error while updating user');
  }

  return res.data;
};

export { addUser, getUser, updateUser };
