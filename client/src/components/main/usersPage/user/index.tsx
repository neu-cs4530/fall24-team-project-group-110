import React from 'react';
import { Card, Avatar, Typography } from 'antd';
import { FaCircleUser } from 'react-icons/fa6';
import { User } from '../../../../types';
import './index.css';

const { Text } = Typography;

interface UserViewProps {
  user: User;
  onClick: () => void;
}

const UserView = ({ user, onClick }: UserViewProps) => (
  <Card hoverable onClick={onClick} className='user-card-style'>
    <div className='user-card-content'>
      <Avatar
        size={48}
        shape='circle'
        src={user.picture || <FaCircleUser size={'10x'} color='#1e1e2f' />}
        alt={`${user.username} profile`}
        className='user-avator-style'
      />
      <div className='user-card-first-last-name'>
        <Text strong>{user.username}</Text>
        <br />
        <Text type='secondary'>{`${user.firstName} ${user.lastName}`}</Text>
      </div>
    </div>
  </Card>
);

export default UserView;
