import React from 'react';
import { Button, Input, Layout, List, Space, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
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
    setParticipants,
    textErr,
    navigateChat,
    handleCreateConversation,
  } = useConversationPage();

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
            <Input
              placeholder='Enter usernames separated by commas'
              value={participants}
              onChange={e => setParticipants(e.target.value)}
              className='conversation-input'
            />
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
                      {c.lastMessage} • {getMetaData(new Date(c.updatedAt))}
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
