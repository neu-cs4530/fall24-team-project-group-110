import React from 'react';
import { Card, Typography } from 'antd';
import { User } from '../../../../types';
import './index.css';
import CustomAvatar from '../../../customAvatar';

const { Text } = Typography;

interface UserViewProps {
  user: User;
  onClick: () => void;
}

const UserView = ({ user, onClick }: UserViewProps) => (
  <Card hoverable onClick={onClick} className='user-card-style'>
    <div className='user-card-content'>
      <CustomAvatar user={user} size={48} />
      <div className='user-card-first-last-name'>
        <Text strong>{user.username}</Text>
        <br />
        <Text type='secondary'>{`${user.firstName} ${user.lastName}`}</Text>
      </div>
    </div>
  </Card>
);

export default UserView;
