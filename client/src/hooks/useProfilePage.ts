import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { User } from '../types';
import { getUser, updateUser } from '../services/userService';

const useProfilePage = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<User | null>(null);
  const [textErr, setTextErr] = useState<string>('');

  useEffect(() => {
    if (!uid) {
      navigate('/home');
    } else {
      const fetchProfile = async () => {
        try {
          const user = await getUser(uid);
          setProfile(user);
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
        const updatedUser = await updateUser(profile._id, { ...profile });
        setProfile(updatedUser);
      } catch (error) {
        setTextErr('Error while updating profile');
      }
    }
  };

  return { profile, textErr, setProfile, saveProfile };
};

export default useProfilePage;
