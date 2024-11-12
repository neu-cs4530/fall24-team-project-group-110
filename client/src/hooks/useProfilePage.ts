import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { EditableUserFields, User } from '../types';
import { getUser, updateUser } from '../services/userService';
import useLoginContext from './useLoginContext';
import useUserContext from './useUserContext';

const useProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [textErr, setTextErr] = useState<string>('');
  const { setUser } = useLoginContext();
  const { user } = useUserContext();
  const canEdit = uid === user?._id;

  useEffect(() => {
    if (!uid) {
      navigate('/home');
    } else {
      const fetchProfile = async () => {
        try {
          const fetchedUser = await getUser(uid);
          setProfile(fetchedUser);
        } catch (error) {
          setTextErr('Error while fetching profile');
        }
      };

      fetchProfile();
    }
  }, [uid, navigate]);

  const saveProfile = async () => {
    if (profile) {
      try {
        const updatedFields: EditableUserFields = {
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          bio: profile.bio,
          picture: profile.picture,
        };

        const updatedUser = await updateUser(profile._id, updatedFields);
        setUser(updatedUser);
        setProfile(updatedUser);
      } catch (error) {
        setTextErr('Error while updating profile');
      }
    }
  };

  return { profile, textErr, canEdit, setProfile, saveProfile };
};

export default useProfilePage;
