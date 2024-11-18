import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { followUser, getUser } from '../services/userService';
import useUserContext from './useUserContext';
import { User } from '../types';

const useFollowStatus = ({ profile }: { profile: User }) => {
  const { uid } = useParams();
  const { user, socket } = useUserContext();
  const [targetId, setTargetId] = useState<string>('');
  const [targetUser, setTargetUser] = useState<User>();
  const [isFollowed, setIsFollowed] = useState<boolean>();

  const handleFollowUser = async () => {
    if (!user || !targetId || !targetUser) return;

    try {
      await followUser(user, targetUser);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error following user:', error);
    }
  };

  useEffect(() => {
    const fetchTargetUser = async (id: string) => {
      try {
        const fetchedUser = await getUser(id);
        setTargetUser(fetchedUser);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(`Error fetching target user: ${error}`);
      }
    };

    if (uid) {
      setTargetId(uid);
      if (profile.followers.some(u => u._id === user._id)) {
        setIsFollowed(true);
      } else {
        setIsFollowed(false);
      }
      fetchTargetUser(uid);
    }
  }, [uid, user._id, profile.followers, socket]);

  return {
    isFollowed,
    handleFollowUser,
  };
};

export default useFollowStatus;
