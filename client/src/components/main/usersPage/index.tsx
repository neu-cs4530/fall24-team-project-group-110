import React, { useEffect, useState } from 'react';
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
    <div>
      <ul>
        {ulist?.map((u, idx) => (
          <li key={idx} onClick={() => navigateProfile(u)}>
            {u.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersPage;
