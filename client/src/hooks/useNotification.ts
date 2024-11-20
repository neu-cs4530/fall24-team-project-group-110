import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Notification } from '../types';
import deleteNotification from '../services/notificationService';

const useNotification = () => {
  const navigate = useNavigate();
  const { user, socket } = useUserContext();
  const [isNotifOpen, setIsNotifOpen] = useState<boolean>(false);
  const [nlist, setNlist] = useState<Notification[]>(
    user.notifications.sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
    ),
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleToggle = () => {
    setIsNotifOpen(prev => !prev);
  };

  const navigateNotification = (n: Notification) => {
    handleToggle();
    navigate(`/${n.type}/${n.targetId}`);
  };

  const handleDeleteAllNotifications = async () => {
    try {
      await Promise.all(nlist.map(n => deleteNotification(user._id, n._id || '')));
      setNlist([]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting notifications:', error);
    }
  };

  const handleDeleteNotification = async (nid: string) => {
    try {
      await deleteNotification(user._id, nid);
      setNlist(prevList => prevList.filter(n => n._id !== nid));
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting notification:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        isNotifOpen
      ) {
        handleToggle();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isNotifOpen]);

  useEffect(() => {
    /**
     * Function to fetch user notifications based on the user id and update the notification list.
     */
    const handleNewNotifications = ({
      uid,
      notification,
    }: {
      uid: string;
      notification: Notification;
    }) => {
      if (user._id === uid) {
        setNlist(prevList => [notification, ...prevList]);
      }
    };

    socket.on('notificationUpdate', handleNewNotifications);

    return () => {
      socket.off('notificationUpdate', handleNewNotifications);
    };
  }, [user._id, socket]);

  return {
    isNotifOpen,
    nlist,
    dropdownRef,
    handleToggle,
    navigateNotification,
    handleDeleteAllNotifications,
    handleDeleteNotification,
  };
};

export default useNotification;
