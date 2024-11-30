import React, { useState } from 'react';
import { Layout, Space, Typography, Modal } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { IoCreateOutline } from 'react-icons/io5';
import './index.css';
import useConversationPage from '../../../hooks/useConversationPage';
import ChatSection from '../chatSection';
import ConversationView from './conversationView';
import ConversationSelector from './conversationSelector';
import { User } from '../../../types';

const { Title, Text } = Typography;

/**
 * ConversationSection renders a page displaying a list of the current user's conversations
 */
const ConversationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    user,
    clist,
    selectedConversation,
    participants,
    setParticipants,
    navigateChat,
    handleCreateConversation,
  } = useConversationPage();

  const userList: User[] = [...new Set([...(user.followers || []), ...(user.following || [])])];

  const handleCreateConversationAndCloseModal = () => {
    handleCreateConversation();
    setIsModalOpen(false);
  };

  return (
    <Layout className='conversation-page'>
      <Content className='chat-section'>
        {selectedConversation ? (
          <ChatSection conversationId={selectedConversation} />
        ) : (
          <div className='empty-chat'>
            <Text style={{ color: '#888', marginTop: '16px' }}>
              Select or create a conversation to start chatting
            </Text>
          </div>
        )}
      </Content>
      <Sider className='sidebar' width={325} theme='dark'>
        <Space direction='vertical' size='large' className='sidebar-content'>
          <div className='sidebar-header'>
            <Title level={3} className='sidebar-title' style={{ color: '#ffffff', margin: '0' }}>
              Chats
            </Title>
            <IoCreateOutline
              className='create-convo-button-icon'
              onClick={() => setIsModalOpen(true)}
              title='Start a new conversation'
            />
          </div>
          <Modal
            title='Start a New Conversation'
            open={isModalOpen}
            onCancel={() => setIsModalOpen(false)}
            footer={null}
            destroyOnClose>
            <ConversationSelector
              users={userList}
              participants={participants}
              setParticipants={setParticipants}
              handleCreateConversation={handleCreateConversationAndCloseModal}
            />
          </Modal>
          <ConversationView user={user} clist={clist} navigateChat={navigateChat} />
        </Space>
      </Sider>
    </Layout>
  );
};

export default ConversationPage;
