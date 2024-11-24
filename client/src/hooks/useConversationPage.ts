import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Conversation, NewConversationPayload } from '../types';
import { addConversation, getConversationsByUserId } from '../services/conversationService';

const useConversationPage = () => {
  const navigate = useNavigate();
  const { cid } = useParams();
  const { user, socket } = useUserContext();
  const [clist, setClist] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string>('');
  const [participants, setParticipants] = useState<string[]>([]);
  const [newParticipant, setNewParticipant] = useState<string>('');
  const [notifyList, setNotifyList] = useState<string[]>([]);
  const [textErr, setTextErr] = useState<string>('');

  const navigateChat = (c: Conversation) => {
    if (c._id) {
      setSelectedConversation(c._id);
      navigate(`/conversation/${c._id}`);
    }
  };

  const handleDeleteParticipant = (index: number) => {
    setParticipants(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddParticipant = () => {
    if (!newParticipant) return;

    setParticipants(prev => [...prev, newParticipant]);
    setNewParticipant('');
  };

  /**
   * Function to handle creating a new conversation
   */
  const handleCreateConversation = async () => {
    if (!participants) return;

    if (participants.length === 0) {
      setTextErr('Cannot create chat with no users');
      return;
    }

    const newConversation: NewConversationPayload = {
      participants: [...participants, user.username],
    };

    try {
      await addConversation(newConversation);
      setParticipants([]);
      setTextErr('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding conversation:', error);
      setTextErr('Error creating conversation');
    }
  };

  useEffect(() => {
    if (cid) {
      setSelectedConversation(cid);
    }
  }, [cid]);

  useEffect(() => {
    /**
     * Function to fetch conversations based on the username and update the conversation list.
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
        setClist(prevList => [
          { ...conversation, notifyList: conversation.notifyList || [] },
          ...prevList.filter(c => c._id !== conversation._id),
        ]);
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
    participants,
    setParticipants,
    notifyList,
    setNotifyList,
    textErr,
    navigateChat,
    handleCreateConversation,
    newParticipant,
    handleAddParticipant,
    setNewParticipant,
    handleDeleteParticipant,
  };
};

export default useConversationPage;
