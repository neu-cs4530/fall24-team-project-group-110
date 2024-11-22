import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Layout, List } from 'antd';
import { Content } from 'antd/es/layout/layout';
import './index.css';
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (!search) {
        return;
      }

      const searchParams = new URLSearchParams();
      searchParams.set('search', e.currentTarget.value);

      navigate(`/users?${searchParams.toString()}`);

      handleSearch();
    }
  };

  return (
    <Layout className='users-layout'>
      <Content className='users-content'>
        <UserHeader search={search} onSearch={handleInputChange} onKeyDown={handleKeyDown} />
        <List
          className='users-list'
          grid={{ gutter: 16, column: 4 }}
          dataSource={ulist}
          renderItem={user => (
            <List.Item>
              <UserView user={user} onClick={() => navigateProfile(user)} />
            </List.Item>
          )}
          locale={{ emptyText: <div className='ant-empty'>Search for users</div> }}
        />
      </Content>
    </Layout>
  );
};

export default UsersPage;
