import React from 'react';
import { FaBell } from 'react-icons/fa';
import { getMetaData } from '../../../tool';
import useNotification from '../../../hooks/useNotification';
import './index.css';

const NotificationDropdown = () => {
  const { isNotifOpen, notificationCount, nlist, handleToggle, navigateNotification } =
    useNotification();

  return (
    <div className='notification-container'>
      <div className='notification-icon' onClick={handleToggle}>
        <FaBell />
        {notificationCount > 0 && <span className='notification-badge'>{notificationCount}</span>}
      </div>
      {isNotifOpen && (
        <div className='dropdown active'>
          <ul className='notification-list'>
            {nlist.length > 0 ? (
              nlist.map((n, idx) => (
                <li key={idx} className='notification-item' onClick={() => navigateNotification(n)}>
                  {n.text}{' '}
                  <span className='notification-time'>{getMetaData(new Date(n.dateTime))}</span>
                </li>
              ))
            ) : (
              <li className='notification-item'>No notifications</li>
            )}
          </ul>
          <button>Delete All Notifications</button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
