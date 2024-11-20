import React from 'react';
import { Button } from 'antd';
import { User } from '../../../types';
import useFollowStatus from '../../../hooks/useFollowStatus';

/**
 * Interface represents the props for the FollowComponent.
 *
 * question - The question object containing voting information.
 */
interface FollowComponentProps {
  profile: User;
}

const FollowComponent = ({ profile }: FollowComponentProps) => {
  const { isFollowed, handleFollowUser } = useFollowStatus({ profile });

  return (
    <div className='follow-container'>
      <Button
        type={isFollowed ? 'primary' : 'default'}
        className={`follow-button ${isFollowed ? 'followed' : 'not-followed'}`}
        onClick={() => handleFollowUser()}>
        {isFollowed ? 'Following' : 'Follow'}
      </Button>
    </div>
  );
};

export default FollowComponent;
