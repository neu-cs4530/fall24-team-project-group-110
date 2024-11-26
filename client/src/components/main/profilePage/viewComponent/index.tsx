import { Switch } from 'antd';
import { User } from '../../../../types';
import FollowComponent from '../../followComponent';
import './index.css';
import CustomAvatar from '../../../customAvatar';

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
        <p>
          <span className='label'>Username:</span>
          <span className='value'>{profile.username}</span>
        </p>
        <p>
          <span className='label'>First Name:</span>
          <span className='value'>{profile.firstName}</span>
        </p>
        <p>
          <span className='label'>Last Name:</span>
          <span className='value'>{profile.lastName}</span>
        </p>
        <p>
          <span className='label'>Email:</span>
          <span className='value'>{profile.email}</span>
        </p>
        {canEdit && (
          <p>
            <span className='label'>Email Notifications:</span>
            <Switch
              checked={profile.emailNotifications}
              checkedChildren='On'
              unCheckedChildren='Off'
              disabled
            />
          </p>
        )}
      </div>
      <CustomAvatar user={profile} size={200} />
    </div>
    <div className='bio-container'>
      <h2>Bio:</h2>
      <p>{profile.bio}</p>
    </div>
    <div></div>
    <div className='view-buttons-container'>
      {canEdit && (
        <button
          className='edit-profile-button'
          style={{ fontSize: '120%', padding: '10px' }}
          onClick={onEdit}>
          Edit Profile
        </button>
      )}
    </div>
  </div>
);

export default ViewProfile;
