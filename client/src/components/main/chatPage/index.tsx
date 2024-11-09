import React, { useState } from 'react';
import { Message, User } from '../../../types';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';
import { getMetaData } from '../../../tool';

const ChatPage = () => {
  const { user, socket } = useUserContext();
  const [conversation, setConversation] = useState();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');

  const handleSendMessageClick = () => {
    if (message.trim() === '' || user.username.trim() === '') {
      setTextErr(message.trim() === '' ? 'Message text cannot be empty' : '');
      return;
    }

    // const newMessage: Comment = {
    //   text,
    //   commentBy: user.username,
    //   commentDateTime: new Date(),
    // };

    // handleAddMessage(newMessage);
    setMessage('');
    setTextErr('');
  };

  return (
    <div>
      {/** <ChatHeader/> *}

      {/** TODO: Scroll Bar */}
      <div className='message-list'>
        {messages.map((m, idx) => (
          // <Message q={m} key={idx} />
          <div key={idx} className={`message-block ${user.username === m.sender ? '' : ''}`}>
            <p>m.text</p>
            <small className='message-meta'>
              {m.sender}, {getMetaData(new Date(m.sentAt))}
            </small>
          </div>
        ))}
      </div>

      <div className='send-message'>
        <div className='input-row'>
          <textarea
            placeholder='Message'
            value={message}
            onChange={e => setMessage(e.target.value)}
            className='message-textarea'
          />
          <button className='send-message-button' onClick={handleSendMessageClick}>
            Send
          </button>
        </div>
        {textErr && <small className='error'>{textErr}</small>}
      </div>
    </div>
  );
};

export default ChatPage;
