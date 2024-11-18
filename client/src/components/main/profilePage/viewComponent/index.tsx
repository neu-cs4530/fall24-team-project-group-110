import { useState } from 'react';
import { User } from '../../../../types';

interface ViewProfileProps {
  profile: User;
  canEdit: boolean;
  onEdit: () => void;
}

const ViewProfile = ({ profile, canEdit, onEdit }: ViewProfileProps) => {
  const [profilePic, setProfilePic] = useState<string>(profile.picture);

  const handleError = () => {
    setProfilePic(
      'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg',
    );
  };

  return (
    <div className='view-container'>
      <div className='basic-picture-container'>
        <div className='basic-container'>
          <p>Username: {profile.username}</p>
          <p>First name: {profile.firstName}</p>
          <p>Last name: {profile.lastName}</p>
          <p>Email: {profile.email}</p>
        </div>
        <div className='image-container'>
          <img className='profile-picture' src={profilePic} onError={handleError} />
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
};

export default ViewProfile;
