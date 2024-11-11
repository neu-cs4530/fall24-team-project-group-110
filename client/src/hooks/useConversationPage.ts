import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Conversation, NewConversationPayload } from '../types';
import { addConversation, getConversationsByUserId } from '../services/conversationService';

const useConversationPage = () => {
  const { user, socket } = useUserContext();
  const [clist, setClist] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [participants, setParticipants] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');

  /**
   * Function to handle creating a new conversation
   */
  const handleCreateConversation = async () => {
    if (!participants) return;

    const participantsArray = Array.from(
      new Set(
        participants
          .split(',')
          .map(name => name.trim())
          .filter(name => user.username !== name),
      ),
    );

    if (participants.length === 0) {
      setTextErr('Cannot create chat with no users');
      return;
    }

    const newConversation: NewConversationPayload = {
      participants: [...participantsArray, user.username],
    };

    try {
      await addConversation(newConversation);
      setParticipants('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding conversation:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch conversations based on the username and update the question list.
     */
    const fetchData = async () => {
      try {
        const res = await getConversationsByUserId(user._id);
        setClist(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, [user._id]);

  useEffect(() => {
    /**
     * Function to handle conversation updates from the socket. When a conversation update is received, we want to:
     * - Check if the conversation is in the user's conversation list
     * - If it is, prepend the updated conversation to the conversation list and remove the old conversation
     * - If it is not, do nothing
     */
    const handleUpdatedConversation = async (conversation: Conversation) => {
      let hasUser = false;

      for (const participant of conversation.participants) {
        if (participant._id === user._id) {
          hasUser = true;
          break;
        }
      }

      if (hasUser) {
        setClist(prevList => [conversation, ...prevList.filter(c => c._id !== conversation._id)]);
      }
    };

    socket.on('conversationUpdate', handleUpdatedConversation);

    return () => {
      socket.off('conversationUpdate', handleUpdatedConversation);
    };
  }, [socket, user._id]);

  return {
    user,
    clist,
    selectedConversation,
    setSelectedConversation,
    participants,
    setParticipants,
    textErr,
    handleCreateConversation,
  };
};

export default useConversationPage;
