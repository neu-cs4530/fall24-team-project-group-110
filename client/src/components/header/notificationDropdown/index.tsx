import { FaBell, FaTrash } from 'react-icons/fa';
import { getMetaData } from '../../../tool';
import useNotification from '../../../hooks/useNotification';
import './index.css';

const NotificationDropdown = () => {
  const {
    isNotifOpen,
    nlist,
    dropdownRef,
    handleToggle,
    navigateNotification,
    handleDeleteAllNotifications,
    handleDeleteNotification,
  } = useNotification();

  return (
    <div className='notification-container' ref={dropdownRef}>
      <div className='notification-icon' onClick={handleToggle}>
        <FaBell />
        {nlist.length > 0 && <span className='notification-badge'>{nlist.length}</span>}
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
                  <li className='notification-item-container' key={idx}>
                    <div
                      key={idx}
                      className='notification-item'
                      onClick={() => navigateNotification(n)}>
                      {n.text}{' '}
                      <span className='notification-time'>{getMetaData(new Date(n.dateTime))}</span>
                    </div>
                    <FaTrash
                      className='trash-icon'
                      onClick={() => n._id && handleDeleteNotification(n._id)}
                    />
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
