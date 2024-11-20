import React from 'react';
import { Badge, Button, Dropdown, Menu, Space } from 'antd';
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

  const menu = (
    <Menu>
      {nlist.length > 0 ? (
        <>
          <Menu.Item key='clear' onClick={handleDeleteAllNotifications}>
            Clear All
          </Menu.Item>
          {nlist.map((n, idx) => (
            <Menu.Item key={idx} onClick={() => navigateNotification(n)}>
              <Space>
                {n.text}
                <span className='notification-time'>{getMetaData(new Date(n.dateTime))}</span>
              </Space>
            </Menu.Item>
          ))}
        </>
      ) : (
        <Menu.Item disabled>No notifications</Menu.Item>
      )}
    </Menu>
  );

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
      <Dropdown overlay={menu} trigger={['click']}>
        <Button icon={<FaBell />} className='notification-icon' shape='circle' size='large'>
          {nlist.length > 0 && <Badge count={nlist.length} />}
        </Button>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;
