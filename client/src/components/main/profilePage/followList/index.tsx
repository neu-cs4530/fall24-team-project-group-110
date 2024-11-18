import React from 'react';
import { User } from '../../../../types';

interface FollowListProps {
  profile: User;
  follows: User[];
  navigateProfile: (uid: string) => void;
}

const FollowList = ({ profile, follows, navigateProfile }: FollowListProps) => (
  <ul>
    {follows.map((u, idx) => (
      <li key={idx} className='short-user-profile' onClick={() => navigateProfile(u._id)}>
        <div>
          {u.picture}
          <div>{u.username}</div>
          <div>
            {u.firstName} {u.lastName}
          </div>
        </div>
      </li>
    ))}
  </ul>
);

export default FollowList;
