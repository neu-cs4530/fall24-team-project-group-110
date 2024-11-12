import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Notification } from '../types';

const useNotification = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [nlist, setNlist] = useState<Notification[]>([
    {
      _id: '1',
      type: 'comment',
      text: 'You have a new comment on your answer.',
      targetId: '123',
      dateTime: new Date(),
    },
    {
      _id: '2',
      type: 'upvote',
      text: 'Your question received an upvote!',
      targetId: '456',
      dateTime: new Date(new Date().getTime() - 60000), // 1 minute ago
    },
    {
      _id: '3',
      type: 'conversation',
      text: 'You were texted in a conversation.',
      targetId: '672fbf8d00a23c7cd6b79d44',
      dateTime: new Date(new Date().getTime() - 300000), // 5 minutes ago
    },
  ]);

  const handleToggle = () => {
    setIsNotifOpen(prev => !prev);
  };

  const navigateNotification = (n: Notification) => {
    handleToggle();
    navigate(`/${n.type}/${n.targetId}`);
    // delete notification
  };

  // useEffect(() => {
  //   setNlist(user.notifications);
  //   setNotificationCount(user.notifications.length);
  // }, [user.notifications]);

  return {
    isNotifOpen,
    notificationCount,
    nlist,
    handleToggle,
    navigateNotification,
  };
};

export default useNotification;
