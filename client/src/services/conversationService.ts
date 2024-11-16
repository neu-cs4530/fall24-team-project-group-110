import api from './config';
import { Conversation, NewConversationPayload } from '../types';

const CONVERSATION_API_URL = `${process.env.REACT_APP_SERVER_URL}/conversation`;

/**
 * Function to get conversations which username is part of.
 *
 * @param username - The current user's username.
 * @throws Error if there is an issue fetching the conversations.
 */
const getConversationsByUserId = async (userId: string): Promise<Conversation[]> => {
  const res = await api.get(`${CONVERSATION_API_URL}/getConversations?userId=${userId}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching conversations with username');
  }
  return res.data;
};

/**
 * Function to get a conversation by its id.
 *
 * @param cid - The id of the conversation to retrieve.
 * @throws Error if there is an issue fetching the conversation.
 */
const getConversationById = async (cid: string): Promise<Conversation> => {
  const res = await api.get(`${CONVERSATION_API_URL}/getConversation/${cid}`);
  if (res.status !== 200) {
    throw new Error('Error when fetching conversation by id');
  }
  return res.data;
};

/**
 * Function to add a new conversation.
 *
 * @param c - The conversation object to add.
 * @throws Error if there is an issue creating the new conversation.
 */
const addConversation = async (c: NewConversationPayload): Promise<Conversation> => {
  const res = await api.post(`${CONVERSATION_API_URL}/addConversation`, c);
  if (res.status !== 200) {
    throw new Error('Error while creating a new conversation');
  }
  return res.data;
};

/**
 * Function to add a user to the notify list of a conversation.
 * @param qid - The ID of the conversation to add the user to the notify list.
 * @param username - The username of the user to add to the notify list.
 * @returns The updated conversation object.
 */
const addUserToNotifyListConversation = async (targetId: string, uid: string) => {
  const data = { targetId, uid };
  const res = await api.post(`${CONVERSATION_API_URL}/addUserToNotifyList`, data);
  if (res.status !== 200) {
    throw new Error('Error while adding user to notify list');
  }
  return res.data;
};

/**
 * Function to remove a user from the notify list of a conversation.
 * @param qid - The ID of the conversation to remove the user from the notify list.
 * @param username - The username of the user to remove from the notify list.
 * @returns The updated conversation object.
 */
const removeUserToNotifyListConversation = async (targetId: string, uid: string) => {
  const data = { targetId, uid };
  const res = await api.post(`${CONVERSATION_API_URL}/removeUserToNotifyList`, data);
  if (res.status !== 200) {
    throw new Error('Error while removing user from notify list');
  }
  return res.data;
};

export {
  getConversationsByUserId,
  getConversationById,
  addConversation,
  addUserToNotifyListConversation,
  removeUserToNotifyListConversation,
};
