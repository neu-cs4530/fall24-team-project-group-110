import api from './config';
import { User } from '../types';

const AUTH_API_URL = `${process.env.REACT_APP_SERVER_URL}/auth`;

/**
 * Sends a request to the server to log in a user.
 * If the request is successful, a cookie is set in the browser.
 *
 * @param username - The ID of the question to which the answer is being added.
 * @param password - The answer object containing the answer details.
 *
 * @returns The user object of the logged-in user.
 * @throws Error Throws an error if the request fails or the response status is not 204.
 */
const login = async (username: string, password: string): Promise<User> => {
  const data = { username, password };

  const res = await api.post(`${AUTH_API_URL}/login`, data);
  if (res.status !== 200) {
    throw new Error('Invalid username or password');
  }

  return res.data;
};

/**
 * Sends a request to the server to validate a user's session.
 *
 * @returns The user object of the validated user.
 * @throws Error Throws an error if the request fails or the response status is not 200.
 */
const validate = async (): Promise<User> => {
  const res = await api.get(`${AUTH_API_URL}/validate`);
  if (res.status !== 200) {
    throw new Error('Error validating session');
  }

  return res.data;
};

/**
 * Sends a request to the server to log out a user.
 * If the request is successful, the cookie is invalidated on the server.
 *
 * @throws Error Throws an error if the request fails or the response status is not 204.
 */
const logout = async (): Promise<void> => {
  const res = await api.post(`${AUTH_API_URL}/logout`);
  if (res.status !== 204) {
    throw new Error('Error logging out');
  }
};

/**
 * Sends a request to the server to resend a verification code to the user's email.
 *
 * @throws Error Throws an error if the request fails or the response status is not 204.
 */
const resendCode = async (email: string): Promise<void> => {
  const res = await api.get(`${AUTH_API_URL}/resendCode?email=${email}`);
  if (res.status !== 204) {
    throw new Error('Error logging out');
  }
};

/**
 * Sends a request to the server to verify a user's code that they got from their email.
 *
 * @returns The user object of the validated user.
 * @throws Error Throws an error if the request fails or the response status is not 204.
 */
const verify = async (code: string): Promise<User> => {
  const res = await api.post(`${AUTH_API_URL}/verify?code=${code}`);
  if (res.status !== 200) {
    throw new Error('Error verifying user');
  }

  return res.data;
};

export { login, validate, logout, verify, resendCode };
