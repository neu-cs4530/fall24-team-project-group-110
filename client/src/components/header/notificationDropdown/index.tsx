import React from 'react';
import { FaBell } from 'react-icons/fa';
import { getMetaData } from '../../../tool';
import useNotification from '../../../hooks/useNotification';
import './index.css';

const NotificationDropdown = () => {
  const {
    isNotifOpen,
    notificationCount,
    nlist,
    dropdownRef,
    handleToggle,
    navigateNotification,
    handleDeleteAllNotifications,
  } = useNotification();

  return (
    <div className='notification-container' ref={dropdownRef}>
      <div className='notification-icon' onClick={handleToggle}>
        <FaBell />
        {notificationCount > 0 && <span className='notification-badge'>{notificationCount}</span>}
      </div>
      {isNotifOpen && (
        <div className='dropdown active'>
          {nlist.length > 0 ? (
            <>
              <button className='notification-clear-button' onClick={handleDeleteAllNotifications}>
                Clear All
              </button>
              <ul className='notification-list'>
                {nlist.map((n, idx) => (
                  <li
                    key={idx}
                    className='notification-item'
                    onClick={() => navigateNotification(n)}>
                    {n.text}{' '}
                    <span className='notification-time'>{getMetaData(new Date(n.dateTime))}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className='notification-none'>No notifications</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
