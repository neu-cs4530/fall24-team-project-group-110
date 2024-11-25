import React from 'react';
import { Button } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { IoSendOutline } from 'react-icons/io5';
import './index.css';

interface ChatSendFooterProps {
  message: string;
  setMessage: (value: string) => void;
  handleNewMessage: () => void;
  textErr?: string;
}

const ChatSendFooter = ({
  message,
  setMessage,
  handleNewMessage,
  textErr,
}: ChatSendFooterProps) => (
  <div className='chat-footer-container'>
    <TextArea
      className='message-input'
      placeholder='Message...'
      value={message}
      onChange={e => setMessage(e.target.value)}
      autoSize={{ minRows: 1, maxRows: 4 }}
    />
    <Button
      type='primary'
      icon={<IoSendOutline />}
      onClick={() => {
        handleNewMessage();
      }}
      disabled={!message.trim()}
      className='send-button'>
      Send
    </Button>
    {textErr && <div className='error-text'>{textErr}</div>}
  </div>
);

export default ChatSendFooter;
