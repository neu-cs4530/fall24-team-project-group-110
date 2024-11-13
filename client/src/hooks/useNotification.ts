import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Notification } from '../types';
import deleteNotification from '../services/notificationService';

const useNotification = () => {
  const navigate = useNavigate();
  const { user } = useUserContext();
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [nlist, setNlist] = useState<Notification[]>([]);

  const handleToggle = () => {
    setIsNotifOpen(prev => !prev);
  };

  const navigateNotification = (n: Notification) => {
    handleToggle();
    navigate(`/${n.type}/${n.targetId}`);
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await Promise.all(nlist.map(n => deleteNotification(user._id, n._id)));
      setNlist([]);
      setNotificationCount(0);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    setNlist(user.notifications);
    setNotificationCount(user.notifications.length);
  }, [user.notifications]);

  return {
    isNotifOpen,
    notificationCount,
    nlist,
    handleToggle,
    navigateNotification,
    handleDeleteAllNotifications,
  };
};

export default useNotification;
