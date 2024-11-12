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
  <div className='edit-container'>
    <div className='basic-picture-container'>
      <div className='edit-basic-container'>
        <div className='edit-basic-field-container'>
          <label>First Name:</label>
          <input
            value={profile.firstName}
            onChange={e => setProfile({ ...profile, firstName: e.target.value })}
          />
        </div>
        <div className='edit-basic-field-container'>
          <label>Last Name:</label>
          <input
            value={profile.lastName}
            onChange={e => setProfile({ ...profile, lastName: e.target.value })}
          />
        </div>
        <div className='edit-basic-field-container'>
          <label>Email:</label>
          <input
            value={profile.email}
            onChange={e => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className='edit-basic-field-container'>
          <label>Picture:</label>
          <input
            value={profile.picture}
            onChange={e => setProfile({ ...profile, picture: e.target.value })}
          />
        </div>
      </div>
      <div className='image-container'>
        <img className='profile-picture' src={profile.picture} alt='profile picture' />
      </div>
    </div>

    <div className='edit-bio-container'>
      <h2>Bio:</h2>
      <textarea
        value={profile.bio}
        rows={4}
        onChange={e => setProfile({ ...profile, bio: e.target.value })}
      />
    </div>
    <div className='edit-buttons-container'>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onSave}>Save Profile</button>
    </div>
  </div>
);

interface ViewProfileProps {
  profile: User;
  canEdit: boolean;
  onEdit: () => void;
}

const ViewProfile = ({ profile, canEdit, onEdit }: ViewProfileProps) => (
  <div className='view-container'>
    <div className='basic-picture-container'>
      <div className='basic-container'>
        <p>Username: {profile.username}</p>
        <p>First name: {profile.firstName}</p>
        <p>Last name: {profile.lastName}</p>
        <p>Email: {profile.email}</p>
      </div>
      <div className='image-container'>
        <img className='profile-picture' src={profile.picture} alt='profile picture' />
      </div>
    </div>
    <div className='bio-container'>
      <h2>Bio:</h2>
      <p>{profile.bio}</p>
    </div>
    <div className='view-buttons-container'>
      {canEdit && <button onClick={onEdit}>Edit Profile</button>}
    </div>
  </div>
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
