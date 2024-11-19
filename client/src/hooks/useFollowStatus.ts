import { useEffect, useState } from 'react';
import { followUser } from '../services/userService';
import useUserContext from './useUserContext';
import { User } from '../types';

const useFollowStatus = ({ profile }: { profile: User }) => {
  const { user } = useUserContext();
  const [isFollowed, setIsFollowed] = useState<boolean>();

  const handleFollowUser = async () => {
    try {
      await followUser(user._id, profile._id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error following user:', error);
    }
  };

  useEffect(() => {
    if (profile.followers.some(u => u._id === user._id)) {
      setIsFollowed(true);
    } else {
      setIsFollowed(false);
    }
  }, [user._id, profile.followers]);

  return {
    isFollowed,
    handleFollowUser,
  };
};

export default useFollowStatus;
