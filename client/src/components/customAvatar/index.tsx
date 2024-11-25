import { Avatar } from 'antd';
import { useState } from 'react';
import { User } from '../../types';

interface CustomAvatarProps {
  user: User;
  size: number;
}

const CustomAvatar = ({ user, size }: CustomAvatarProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <Avatar size={size}>{user.username.charAt(0).toUpperCase()}</Avatar>;
  }

  return (
    <Avatar
      size={size}
      src={user.picture}
      onError={() => {
        setHasError(true);
        return false;
      }}
    />
  );
};

export default CustomAvatar;
