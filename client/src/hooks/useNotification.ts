import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Notification } from '../types';
import { deleteNotification } from '../services/notificationService';
import { getUser } from '../services/userService';

const useNotification = () => {
  const navigate = useNavigate();
  const { user, socket } = useUserContext();
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
      console.error('Error deleting notifications:', error);
    }
  };

  const fetchUserNotifs = useCallback(async () => {
    try {
      const res = await getUser(user._id);
      setNlist(res.notifications);
      setNotificationCount(res.notifications.length);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting notifications:', error);
    }
  }, [user._id]);

  useEffect(() => {
    fetchUserNotifs();
  }, [fetchUserNotifs, user._id]);

  useEffect(() => {
    /**
     *
     */
    const handleNewNotifications = (uid: string) => {
      if (user._id === uid) {
        fetchUserNotifs();
      }
    };

    socket.on('notificationUpdate', handleNewNotifications);

    return () => {
      socket.off('notificationUpdate', handleNewNotifications);
    };
  }, [fetchUserNotifs, user._id, socket]);

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
