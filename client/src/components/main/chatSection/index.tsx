import React, { useEffect, useState } from 'react';
import { getMetaData } from '../../../tool';
import useMessagePage from '../../../hooks/useMessagePage';
import './index.css';
import NotificationCheckbox from '../notificationCheckbox';
import { getConversationById } from '../../../services/conversationService';
import { Conversation } from '../../../types';

/**
 * Interface representing the props for the Chat Section component.
 *
 * - conversationId - The id of the conversation.
 */
interface ChatSectionProps {
  conversationId: string;
}

/**
 * ChatSection component shows the messages of the conversation and allows the users to message other users.
 *
 * @param param conversationId: The id of the conversation.
 */
const ChatSection = ({ conversationId }: ChatSectionProps) => {
  const [notifyList, setNotifyList] = useState<string[]>([]);
  const { user, messagesEndRef, messages, message, setMessage, textErr, handleNewMessage } =
    useMessagePage(conversationId);

  useEffect(() => {
    /**
     * Function to fetch notifyList based on the conversation id.
     */
    const fetchData = async () => {
      try {
        const res = await getConversationById(conversationId);
        setNotifyList(res.notifyList);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchData();
  }, [conversationId]);

  return (
    <div className='chat-body'>
      <div className='message-list'>
        {messages.map((m, idx) => (
          <li
            key={idx}
            className={`message-block ${
              user.username === m.sender ? 'message-sent-by-sender' : 'message-sent-by-receiver'
            }`}>
            <p className='message-text'>{m.text}</p>
            <small
              className={`${user.username === m.sender ? 'message-meta-by-sender' : 'message-meta-by-receiver'}`}>
              {m.sender}, {getMetaData(new Date(m.sentAt))}
            </small>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className='send-message'>
        <div className='input-row'>
          <textarea
            placeholder='Message'
            value={message}
            onChange={e => setMessage(e.target.value)}
            className='message-textarea'
          />
          <button className='send-message-button' onClick={handleNewMessage}>
            Send
          </button>
          <NotificationCheckbox
            targetId={conversationId}
            notifyList={notifyList}
            type='conversation'
          />
        </div>
        {textErr && <small className='error'>{textErr}</small>}
      </div>
    </div>
  );
};

export default ChatSection;
