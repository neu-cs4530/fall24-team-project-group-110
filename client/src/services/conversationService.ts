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
 * @param qid - The id of the conversation to retrieve.
 * @throws Error if there is an issue fetching the conversation.
 */
const getConversationById = async (qid: string): Promise<Conversation> => {
  const res = await api.get(`${CONVERSATION_API_URL}/getConversation/${qid}`);
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

export { getConversationsByUserId, getConversationById, addConversation };
