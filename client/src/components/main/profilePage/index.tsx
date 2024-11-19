import { useState } from 'react';
import useProfilePage from '../../../hooks/useProfilePage';
import './index.css';
import EditProfile from './editComponent';
import ViewProfile from './viewComponent';
import FollowList from './followList';
import { ProfileTabs } from '../../../types';

const ProfilePage = () => {
  const {
    profile,
    activeTab,
    textErr,
    canEdit,
    setProfile,
    setActiveTab,
    navigateProfile,
    saveProfile,
  } = useProfilePage();
  const [editing, setEditing] = useState<boolean>(false);

  if (!profile || textErr) {
    return <p>{textErr}</p>;
  }

  const handleSave = async () => {
    await saveProfile();
    setEditing(false);
  };

  const handleTabClick = (tab: ProfileTabs) => {
    setActiveTab(tab);
  };

  return (
    <div className='tab-container'>
      <div className='tablinks'>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => handleTabClick('profile')}>
          Profile
        </button>
        <button
          className={activeTab === 'followers' ? 'active' : ''}
          onClick={() => handleTabClick('followers')}>
          Followers
        </button>
        <button
          className={activeTab === 'following' ? 'active' : ''}
          onClick={() => handleTabClick('following')}>
          Following
        </button>
      </div>

      <div className='tab-content'>
        {activeTab === 'profile' && (
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
        )}
        {activeTab === 'followers' && (
          <FollowList
            profile={profile}
            follows={profile.followers}
            navigateProfile={navigateProfile}
          />
        )}
        {activeTab === 'following' && (
          <FollowList
            profile={profile}
            follows={profile.following}
            navigateProfile={navigateProfile}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
