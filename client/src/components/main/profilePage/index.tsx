import { useState } from 'react';
import useProfilePage from '../../../hooks/useProfilePage';
import './index.css';
import EditProfile from './editComponent';
import ViewProfile from './viewComponent';

const ProfilePage = () => {
  const { profile, textErr, canEdit, setProfile, saveProfile } = useProfilePage();
  const [editing, setEditing] = useState<boolean>(false);

  if (!profile || textErr) {
    return <p>{textErr}</p>;
  }

  const handleSave = async () => {
    await saveProfile();
    setEditing(false);
  };

  return (
    <>
      {editing ? (
        <EditProfile
          profile={profile}
          setProfile={setProfile}
          onCancel={() => setEditing(false)}
          onSave={() => handleSave()}
        />
      ) : (
        <ViewProfile profile={profile} canEdit={canEdit} onEdit={() => setEditing(true)} />
      )}
    </>
  );
};

export default ProfilePage;
