import React from 'react';
import { Badge, Button, Dropdown, List, Space } from 'antd';
import { FaBell, FaTrash } from 'react-icons/fa';
import { getMetaData } from '../../../tool';
import useNotification from '../../../hooks/useNotification';
import './index.css';

const NotificationDropdown = () => {
  const {
    isNotifOpen,
    nlist,
    handleToggle,
    navigateNotification,
    handleDeleteAllNotifications,
    handleDeleteNotification,
  } = useNotification();

  const menuContent = (
    <div className='notification-dropdown'>
      {nlist.length > 0 ? (
        <>
          <div className='notification-header'>
            <Button
              type='link'
              danger
              onClick={handleDeleteAllNotifications}
              className='clear-all-button'>
              Clear All
            </Button>
          </div>
          <List
            className='notification-list'
            dataSource={nlist}
            renderItem={n => (
              <List.Item className='notification-item' onClick={() => navigateNotification(n)}>
                <Space>
                  {n.text}
                  <span className='notification-time'>{getMetaData(new Date(n.dateTime))}</span>
                </Space>
                <Button
                  className='trash-button'
                  shape='circle'
                  onClick={e => {
                    e.stopPropagation();
                    if (n._id) {
                      handleDeleteNotification(n._id);
                    }
                  }}>
                  <FaTrash className='trash-icon' />
                </Button>
              </List.Item>
            )}
          />
        </>
      ) : (
        <div className='notification-none'>No notifications</div>
      )}
    </div>
  );

  return (
    <div className='notification-container'>
      <Dropdown
        className='custom-dropdown-trigger'
        dropdownRender={() => menuContent}
        trigger={['click']}
        open={isNotifOpen}
        onOpenChange={handleToggle}>
        <div>
          <Badge count={nlist.length} offset={[-2, 2]} overflowCount={99} size='small' color='red'>
            <FaBell className='notification-icon' />
          </Badge>
        </div>
      </Dropdown>
    </div>
  );
};

export default NotificationDropdown;
