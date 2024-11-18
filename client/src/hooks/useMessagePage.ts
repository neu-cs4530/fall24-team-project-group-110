import { useEffect, useState, useRef } from 'react';
import useUserContext from './useUserContext';
import { Message } from '../types';
import { getMessagesByConvoId, addMessage } from '../services/messageService';

const useMessagePage = (conversationId: string) => {
  const { user, socket } = useUserContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /**
   * Function to handle creating a new message.
   */
  const handleNewMessage = async () => {
    if (message.trim() === '' || user.username.trim() === '') {
      setTextErr(message.trim() === '' ? 'Message text cannot be empty' : '');
      return;
    }

    const newMessage: Message = {
      conversationId,
      sender: user,
      text: message,
      sentAt: new Date(),
    };

    try {
      await addMessage(newMessage);
      setMessage('');
      setTextErr('');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding message:', error);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch the messages data based on the conversation ID.
     */
    const fetchData = async () => {
      try {
        const res = await getMessagesByConvoId(conversationId);
        setMessages(res);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching messages:', error);
      }
    };

    // eslint-disable-next-line no-console
    fetchData().catch(e => console.log(e));
  }, [conversationId]);

  useEffect(() => {
    /**
     * Function to handle updates to the messages of a conversation.
     *
     * @param message - The new message object.
     */
    const handleMessageUpdate = (m: Message) => {
      setMessages(prevMessages => [...prevMessages, m]);
    };

    socket.emit('joinConversation', conversationId);
    socket.on('newMessage', handleMessageUpdate);

    return () => {
      socket.emit('leaveConversation', conversationId);
      socket.off('newMessage', handleMessageUpdate);
    };
  }, [conversationId, socket]);

  return {
    user,
    messagesEndRef,
    messages,
    message,
    setMessage,
    textErr,
    handleNewMessage,
  };
};

export default useMessagePage;
