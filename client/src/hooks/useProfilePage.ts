import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EditableUserFields, User, ProfileTabs, FollowData } from '../types';
import { getUser, updateUser } from '../services/userService';
import useLoginContext from './useLoginContext';
import useUserContext from './useUserContext';

const useProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileTabs>('profile');
  const [textErr, setTextErr] = useState<string>('');
  const { setUser } = useLoginContext();
  const { user, socket } = useUserContext();
  const canEdit = uid === user?._id;

  useEffect(() => {
    if (!uid) {
      navigate('/home');
    } else {
      const fetchProfile = async () => {
        try {
          const fetchedUser = await getUser(uid);
          setProfile(fetchedUser);
          setActiveTab('profile');
        } catch (error) {
          setTextErr('Error while fetching profile');
        }
      };

      fetchProfile();
    }
  }, [uid, navigate]);

  const navigateProfile = (targetId: string) => {
    navigate(`/profile/${targetId}`);
  };

  const handleCancelEdit = () => {
    setProfile(user);
  };

  const saveProfile = async () => {
    if (profile) {
      try {
        const updatedFields: EditableUserFields = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          bio: profile.bio,
          picture: profile.picture,
          emailNotifications: profile.emailNotifications,
        };

        const updatedUser = await updateUser(profile._id, updatedFields);
        setUser(updatedUser);
        setProfile(updatedUser);
      } catch (error) {
        setTextErr('Error while updating profile');
      }
    }
  };

  useEffect(() => {
    const handleFollowUpdate = (followData: FollowData) => {
      if (followData.uid === uid) {
        setProfile(prevProfile =>
          prevProfile
            ? {
                ...prevProfile,
                followers: followData.followers,
              }
            : prevProfile,
        );
      }
    };

    socket.on('followUpdate', handleFollowUpdate);

    return () => {
      socket.off('followUpdate', handleFollowUpdate);
    };
  }, [uid, socket, user._id]);

  return {
    profile,
    activeTab,
    textErr,
    canEdit,
    setProfile,
    setActiveTab,
    navigateProfile,
    saveProfile,
    handleCancelEdit,
  };
};

export default useProfilePage;
