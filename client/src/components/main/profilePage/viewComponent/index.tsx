import { User } from '../../../../types';
import FollowComponent from '../../followComponent';

interface ViewProfileProps {
  profile: User;
  canEdit: boolean;
  onEdit: () => void;
}

const ViewProfile = ({ profile, canEdit, onEdit }: ViewProfileProps) => (
  <div className='view-container'>
    {!canEdit && <FollowComponent profile={profile} />}
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
    <div></div>
    <div className='view-buttons-container'>
      {canEdit && <button onClick={onEdit}>Edit Profile</button>}
    </div>
  </div>
);

export default ViewProfile;
