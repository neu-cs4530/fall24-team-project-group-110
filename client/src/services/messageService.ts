import api from './config';
import { Message } from '../types';

const MESSAGE_API_URL = `${process.env.REACT_APP_SERVER_URL}/message`;

/**
 * Function to get all messages part of the conversation by its id.
 *
 * @param c_id - The id of the conversation to get messages from.
 * @throws Error if there is an issue fetching the conservation messages.
 */
const getMessagesByConvoId = async (c_id: string): Promise<Message[]> => {
  const res = await api.get(`${MESSAGE_API_URL}/getMessagesByConvoId/${c_id}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching messages by conversation id');
  }
  return res.data;
};

/**
 * Function to add a new message.
 *
 * @param m - The message object to add.
 * @throws Error if there is an issue creating the new message.
 */
const addMessage = async (m: Message): Promise<Message> => {
  const res = await api.post(`${MESSAGE_API_URL}/addMessage`, m);
  if (res.status !== 200) {
    throw new Error('Error while creating a new message');
  }
  return res.data;
};

export { getMessagesByConvoId, addMessage };
