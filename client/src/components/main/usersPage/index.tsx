import React, { useState } from 'react';
import { List } from 'antd';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import { getUsers } from '../../../services/userService';
import UserHeader from './header';
import UserView from './user';

const UsersPage = () => {
  const navigate = useNavigate();
  const [ulist, setUlist] = useState<User[]>();
  const [search, setSearch] = useState<string>('');

  const navigateProfile = (u: User) => {
    navigate(`/profile/${u._id}`);
  };

  const handleSearch = async () => {
    try {
      const users = await getUsers(search);
      setUlist(users);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(`Error fetching all users: ${error}`);
    }
  };

  return (
    <div className='users-container'>
      <UserHeader search={search} setSearch={setSearch} onSearch={handleSearch} />
      <List
        className='users-list'
        grid={{ gutter: 16, column: 3 }}
        dataSource={ulist}
        renderItem={user => (
          <List.Item>
            <UserView user={user} onClick={() => navigateProfile(user)} />
          </List.Item>
        )}
        locale={{ emptyText: <div className='ant-empty'>Search for users</div> }}
      />
    </div>
  );
};

export default UsersPage;
