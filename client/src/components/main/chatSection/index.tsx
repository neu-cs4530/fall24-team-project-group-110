import React, { useEffect, useState } from 'react';
import { List, Space, Typography } from 'antd';
import { getMetaData } from '../../../tool';
import useMessagePage from '../../../hooks/useMessagePage';
import './index.css';
import { getConversationById } from '../../../services/conversationService';
import ChatHeader from './chatHeader';
import ChatSend from './chatSendFooter';

const { Text } = Typography;

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
    <div className='chat-section'>
      <ChatHeader cid={conversationId} notifyList={notifyList} />
      <List
        className='message-list'
        dataSource={[...messages]}
        renderItem={(m, idx) => (
          <List.Item
            key={idx}
            style={{ border: 'none' }}
            className={`message-item ${user._id === m.sender._id ? 'sender' : 'receiver'}`}>
            <Space
              direction='vertical'
              className={`message-bubble ${
                user._id === m.sender._id ? 'bubble-sender' : 'bubble-receiver'
              }`}>
              <Text>{m.text}</Text>
              <Text
                className={`${user._id === m.sender._id ? 'meta-text-sender' : 'meta-text-receiver'}`}>
                {m.sender.username} • {getMetaData(new Date(m.sentAt))}
              </Text>
            </Space>
          </List.Item>
        )}>
        <div ref={messagesEndRef} />
      </List>

      <ChatSend
        message={message}
        setMessage={setMessage}
        handleNewMessage={handleNewMessage}
        textErr={textErr}
      />
    </div>
  );
};

export default ChatSection;
