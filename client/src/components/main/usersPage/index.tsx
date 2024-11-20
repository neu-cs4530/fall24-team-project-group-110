import React, { useState } from 'react';
import { Avatar, Card, List, Typography } from 'antd';
import { FaUser } from 'react-icons/fa';
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
    // <div className='users-container'>
    //   <input
    //     type='text'
    //     placeholder='Search for users'
    //     value={search}
    //     onChange={e => setSearch(e.target.value)}
    //   />
    //   <button onClick={handleSearch}>Search</button>
    //   <ul className='users-list'>
    //     {ulist?.map((u, idx) => (
    //       <li key={idx} className='user-item' onClick={() => navigateProfile(u)}>
    //         <div className='user-info'>
    //           <div className='user-picture'>
    //             <FaUser />
    //             <img className='user-picture' src={u.picture} alt='profile picture' />
    //           </div>
    //           <div>
    //             {u.username}
    //             <small className='user-meta-name'>
    //               {u.firstName} {u.lastName}
    //             </small>
    //           </div>
    //         </div>
    //       </li>
    //     ))}
    //   </ul>
    // </div>
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
