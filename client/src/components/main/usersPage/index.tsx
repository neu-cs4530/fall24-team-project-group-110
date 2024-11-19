import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { User } from '../../../types';
import { getAllUsers } from '../../../services/userService';

const UsersPage = () => {
  const navigate = useNavigate();
  const [ulist, setUlist] = useState<User[]>();

  const navigateProfile = (u: User) => {
    navigate(`/profile/${u._id}`);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        setUlist(users);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error fetching all users: ${error}`);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className='users-container'>
      <ul className='users-list'>
        {ulist?.map((u, idx) => (
          <li key={idx} className='user-item' onClick={() => navigateProfile(u)}>
            <div className='user-info'>
              <div className='user-picture'>
                <FaUser />
                <img className='user-picture' src={u.picture} alt='profile picture' />
              </div>
              <div>
                {u.username}
                <small className='user-meta-name'>
                  {u.firstName} {u.lastName}
                </small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
