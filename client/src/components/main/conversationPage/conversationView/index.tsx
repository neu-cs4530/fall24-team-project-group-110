import React from 'react';
import { Avatar, List, Tooltip, Typography } from 'antd';
import './index.css';
import { Conversation, User } from '../../../../types';
import { getMetaData } from '../../../../tool';

const { Text } = Typography;

interface ConversationViewProps {
  clist: Conversation[];
  user: User;
  navigateChat: (c: Conversation) => void;
}

const ConversationView = ({ clist, user, navigateChat }: ConversationViewProps) => {
  const getTruncatedTitle = (title: string) =>
    title.length > 25 ? `${title.substring(0, 25)}...` : title;

  const getTruncatedMessage = (message: string) =>
    message.length > 15 ? `${message.substring(0, 15)}...` : message;

  const filterParticipants = (participants: User[]) => participants.filter(p => p._id !== user._id);

  const renderAvatar = (p: User, idx: number, size: number) => (
    <Avatar key={idx} size={size} src={p.picture} alt={p.username}>
      {!p.picture && p.username.charAt(0).toUpperCase()}
    </Avatar>
  );

  const renderAvatarGroup = (participants: User[]) => {
    const filteredParticipants = filterParticipants(participants);

    if (filteredParticipants.length === 1) {
      return renderAvatar(filteredParticipants[0], 0, 48);
    }

    if (filteredParticipants.length === 2) {
      return (
        <div className='avatar-diagonal'>
          {filteredParticipants.map((p, idx) => renderAvatar(p, idx, 32))}
        </div>
      );
    }

    if (filteredParticipants.length === 3) {
      return (
        <div className='avatar-circle'>
          {filteredParticipants.map((p, idx) => renderAvatar(p, idx, 28))}
        </div>
      );
    }

    return (
      <div className='avatar-circle'>
        {filteredParticipants.slice(0, 2).map((p, idx) => renderAvatar(p, idx, 28))}
        <Tooltip title={filteredParticipants.slice(2).map((p, idx) => renderAvatar(p, idx, 28))}>
          <Avatar size={28} style={{ backgroundColor: '#fde3cf', color: '#f56a00' }}>
            +{filteredParticipants.length - 2}
          </Avatar>
        </Tooltip>
      </div>
    );
  };

  return (
    <List
      dataSource={clist}
      renderItem={(c, idx) => (
        <List.Item key={idx} className='conversation-item' onClick={() => navigateChat(c)}>
          <List.Item.Meta
            className='conversation-container'
            avatar={<div className='avatar-container'>{renderAvatarGroup(c.participants)}</div>}
            title={
              <Text className='conversation-title'>
                {getTruncatedTitle(
                  c.participants
                    .map(p => p.username)
                    .filter(username => username !== user.username)
                    .join(', '),
                )}
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
  );
};

export default ConversationView;
