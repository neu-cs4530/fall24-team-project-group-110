import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import { User } from '../../../../types';

const { Text } = Typography;

interface UserViewProps {
  user: User;
  onClick: () => void;
}

const UserView = ({ user, onClick }: UserViewProps) => (
  <Card hoverable onClick={onClick} style={{ textAlign: 'center', borderRadius: '8px' }}>
    <Avatar
      size={64}
      src={user.picture || 'https://via.placeholder.com/64'}
      alt={`${user.username} profile`}
      style={{ marginBottom: '8px' }}
    />
    <Text strong>{user.username}</Text>
    <div>
      <Text type='secondary'>{`${user.firstName} ${user.lastName}`}</Text>
    </div>
  </Card>
);

export default UserView;
