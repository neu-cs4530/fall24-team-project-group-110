import React from 'react';
import { List } from 'antd';
import { User } from '../../../../types';
import UserView from '../../usersPage/user';
import './index.css';

interface FollowListProps {
  emptyTitle: string;
  follows: User[];
  navigateProfile: (uid: string) => void;
}

const FollowList = ({ emptyTitle, follows, navigateProfile }: FollowListProps) => (
  <div className='follow-container'>
    <List
      className='users-list'
      grid={{ gutter: 16, column: 4 }}
      dataSource={follows}
      renderItem={user => (
        <List.Item>
          <UserView user={user} onClick={() => navigateProfile(user._id)} />
        </List.Item>
      )}
      locale={{ emptyText: <div className='follow-empty'> {emptyTitle} </div> }}
    />
  </div>
);

export default FollowList;
