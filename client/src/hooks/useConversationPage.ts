import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Conversation } from '../types';
import { addConversation, getConversationsByFilter } from '../services/conversationService';

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

    const newConversation: Conversation = {
      participants: [...participantsArray, user.username],
      lastMessage: '',
      updatedAt: new Date(),
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
        const res = await getConversationsByFilter(user.username);
        setClist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, [user.username]);

  useEffect(() => {
    /**
     * Function to handle conversation updates from the socket.
     */
    const handleUpdatedConversation = async (conversation: Conversation) => {
      setClist(prevCList => {
        const conversationExists = prevCList.some(c => c._id === conversation._id);

        if (conversationExists) {
          // Update the existing conversation
          return prevCList.map(c => (c._id === conversation._id ? conversation : c));
        }

        return [conversation, ...prevCList];
      });
    };

    socket.on('conversationUpdate', handleUpdatedConversation);

    return () => {
      socket.off('conversationUpdate', handleUpdatedConversation);
    };
  }, [clist, socket]);

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
