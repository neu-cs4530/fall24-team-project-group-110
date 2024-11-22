import React from 'react';
import { Button, Input, Layout, List, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { FaTrash } from 'react-icons/fa';
import './index.css';
import useConversationPage from '../../../hooks/useConversationPage';
import ChatSection from '../chatSection';
import { getMetaData } from '../../../tool';

const { Title, Text } = Typography;

/**
 * ConversationSection renders a page displaying a list of the current user's conversations
 */
const ConversationPage = () => {
  const {
    user,
    clist,
    selectedConversation,
    participants,
    textErr,
    navigateChat,
    handleCreateConversation,
    newParticipant,
    handleAddParticipant,
    setNewParticipant,
    handleDeleteParticipant,
  } = useConversationPage();

  const getTruncatedMessage = (message: string) =>
    message.length > 15 ? `${message.substring(0, 15)}...` : message;

  return (
    <Layout className='conversation-page'>
      <Content className='chat-section'>
        {selectedConversation ? (
          <ChatSection conversationId={selectedConversation} />
        ) : (
          <div className='empty-chat'>
            {/* <MessageOutlined style={{ fontSize: '48px', color: '#888' }} /> */}
            <Text style={{ color: '#888', marginTop: '16px' }}>
              Select or create a conversation to start chatting
            </Text>
          </div>
        )}
      </Content>
      <Sider className='sidebar' width={300} theme='dark'>
        <Space direction='vertical' size='large' className='sidebar-content'>
          <Title level={3} style={{ color: '#ffffff', textAlign: 'center' }}>
            Chats
          </Title>
          <Space direction='vertical' className='new-conversation'>
            <Space>
              <Input
                placeholder='Enter a username'
                value={newParticipant}
                onChange={e => setNewParticipant(e.target.value)}
                className='conversation-input'
              />
              <Button onClick={handleAddParticipant} className='add-user-button' type='primary'>
                Add User
              </Button>
            </Space>
            <Space direction='vertical' className='added-participants-list'>
              {participants.map((p, idx) => (
                <Space key={idx}>
                  <Input className='added-participant' value={p} disabled />
                  <Button
                    className='delete-participant-button'
                    type='primary'
                    onClick={() => handleDeleteParticipant(idx)}>
                    <FaTrash />
                  </Button>
                </Space>
              ))}
            </Space>
            <Button type='primary' onClick={handleCreateConversation} block>
              Create Conversation
            </Button>
            {textErr && <Text type='danger'>{textErr}</Text>}
          </Space>
          <List
            dataSource={clist}
            renderItem={(c, idx) => (
              <List.Item key={idx} className='conversation-item' onClick={() => navigateChat(c)}>
                <List.Item.Meta
                  className='conversation-meta-container'
                  title={
                    <Text className='conversation-title'>
                      {c.participants
                        .map(p => p.username)
                        .filter(username => username !== user.username)
                        .join(', ')}
                    </Text>
                  }
                  description={
                    <Text className='conversation-meta'>
                      {c.lastMessage && `${getTruncatedMessage(c.lastMessage)} • `}
                      {getMetaData(new Date(c.updatedAt))}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Space>
      </Sider>
    </Layout>
  );
};

export default ConversationPage;
