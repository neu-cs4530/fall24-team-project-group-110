import React from 'react';
import { User } from '../../../types';
import useFollowStatus from '../../../hooks/useFollowStatus';

/**
 * Interface represents the props for the FollowComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  profile: User;
}

const FollowComponent = ({ profile }: VoteComponentProps) => {
  const { isFollowed, handleFollowUser } = useFollowStatus({ profile });

  return (
    <div className='follow-container'>
      <button
        className={`follow-button ${isFollowed ? 'followed' : 'not-followed'}`}
        onClick={() => handleFollowUser()}>
        {isFollowed ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default FollowComponent;
