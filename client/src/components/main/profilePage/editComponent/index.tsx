import { User } from '../../../../types';

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
        <img className='profile-picture' src={profile.picture} alt='could not find image' />
      </div>
      <div className='edit-basic-field-container'>
        <label>Email Notifications:</label>
        <input
          type='checkbox'
          checked={profile.emailNotifications}
          onChange={e => setProfile({ ...profile, emailNotifications: e.target.checked })}
        />
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

export default EditProfile;
