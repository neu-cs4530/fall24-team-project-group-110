import React from 'react';
import { getMetaData } from '../../../tool';
import useMessagePage from '../../../hooks/useMessagePage';
import './index.css';

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
  const { user, messagesEndRef, messages, message, setMessage, textErr, handleNewMessage } =
    useMessagePage(conversationId);

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
        </div>
        {textErr && <small className='error'>{textErr}</small>}
      </div>
    </div>
  );
};

export default ChatSection;
