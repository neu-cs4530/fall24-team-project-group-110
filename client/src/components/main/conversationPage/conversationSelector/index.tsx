import React, { useState } from 'react';
import { Button, Input, List, Avatar, Space, Tag } from 'antd';
import './index.css';
import { User } from '../../../../types';

interface ConversationSelectorProps {
  users: User[];
  participants: string[];
  setParticipants: React.Dispatch<React.SetStateAction<string[]>>;
  handleCreateConversation: () => void;
}

const ConversationSelector = ({
  users,
  participants,
  setParticipants,
  handleCreateConversation,
}: ConversationSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const toggleUserSelection = (username: string) => {
    setParticipants((prev: string[]) =>
      prev.includes(username) ? prev.filter(name => name !== username) : [...prev, username],
    );
  };

  const filteredUsers = users.filter(user => user.username.toLowerCase().includes(searchTerm));

  return (
    <Space direction='vertical' className='conversation-selector'>
      <Input.Search
        placeholder='Search users...'
        value={searchTerm}
        onChange={handleSearch}
        className='convo-user-search-bar'
      />
      <List
        className='convo-users-list'
        dataSource={filteredUsers}
        renderItem={user => (
          <List.Item
            onClick={() => toggleUserSelection(user.username)}
            className={`user-item ${participants.includes(user._id) ? 'selected' : ''}`}
            style={{
              cursor: 'pointer',
              padding: '10px 16px',
              backgroundColor: participants.includes(user.username) ? '#e6f7ff' : 'transparent',
            }}>
            <List.Item.Meta
              avatar={
                <Avatar src={user.picture} alt={user.username}>
                  {!user.picture && user.username.charAt(0).toUpperCase()}
                </Avatar>
              }
              title={user.username}
            />
            {participants.includes(user.username) && <Tag color='blue'>Selected</Tag>}
          </List.Item>
        )}
      />
      <Button
        type='primary'
        disabled={participants.length === 0}
        onClick={handleCreateConversation}
        block>
        Create Conversation
      </Button>
    </Space>
  );
};

export default ConversationSelector;
