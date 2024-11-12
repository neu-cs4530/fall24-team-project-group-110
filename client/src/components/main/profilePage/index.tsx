import { useState } from 'react';
import useProfilePage from '../../../hooks/useProfilePage';
import './index.css';
import { User } from '../../../types';

interface EditProfileProps {
  profile: User;
  setProfile: (profile: User) => void;
  onCancel: () => void;
  onSave: () => void;
}

const EditProfile = ({ profile, setProfile, onCancel, onSave }: EditProfileProps) => (
  <>
    <input
      value={profile.firstName}
      onChange={e => setProfile({ ...profile, firstName: e.target.value })}
    />
    <input
      value={profile.lastName}
      onChange={e => setProfile({ ...profile, lastName: e.target.value })}
    />
    <input
      value={profile.email}
      onChange={e => setProfile({ ...profile, email: e.target.value })}
    />
    <input value={profile.bio} onChange={e => setProfile({ ...profile, bio: e.target.value })} />
    <input
      value={profile.picture}
      onChange={e => setProfile({ ...profile, picture: e.target.value })}
    />
    <button onClick={onCancel}>Cancel</button>
    <button onClick={onSave}>Save Profile</button>
  </>
);

interface ViewProfileProps {
  profile: User;
  canEdit: boolean;
  onEdit: () => void;
}

const ViewProfile = ({ profile, canEdit, onEdit }: ViewProfileProps) => (
  <>
    <p>{profile.username}</p>
    <p>{profile.firstName}</p>
    <p>{profile.lastName}</p>
    <p>{profile.email}</p>
    <p>{profile.bio}</p>
    <p>{profile.picture}</p>
    {canEdit && <button onClick={onEdit}>Edit Profile</button>}
  </>
);

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
