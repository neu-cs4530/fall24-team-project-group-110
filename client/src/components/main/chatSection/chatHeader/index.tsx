import React, { useState } from 'react';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import { CiSettings } from 'react-icons/ci';
import './index.css';
import NotificationCheckbox from '../../notificationCheckbox';

interface ChatHeaderProps {
  cid: string;
  notifyList: string[];
}

const ChatHeader = ({ cid, notifyList }: ChatHeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const settingsMenu: MenuProps['items'] = [
    {
      key: 'title',
      label: 'Chat Settings',
      disabled: true,
      className: 'dropdown-item-disabled',
    },
    {
      key: 'notifications',
      label: (
        <div
          onClick={e => {
            e.stopPropagation();
          }}>
          <NotificationCheckbox targetId={cid} notifyList={notifyList} type='conversation' />
        </div>
      ),
    },
  ];

  const toggleSettingsClick = () => {
    setIsSpinning(prev => !isSpinning);
  };

  const handleDropdownVisibleChange = (visible: boolean) => {
    setIsOpen(visible);
  };

  return (
    <div className='chat-header'>
      <Space direction='horizontal' size='large' align='center'>
        <Dropdown
          className='settings-container'
          menu={{ items: settingsMenu }}
          trigger={['click']}
          open={isOpen}
          onOpenChange={handleDropdownVisibleChange}>
          <Button
            className='chat-setting-button'
            onClick={toggleSettingsClick}
            icon={
              <CiSettings
                style={{
                  transform: isSpinning ? 'rotate(360deg)' : 'rotate(0deg)',
                  transition: 'transform 0.5s ease',
                }}
              />
            }
            type='link'
          />
        </Dropdown>
      </Space>
    </div>
  );
};

export default ChatHeader;
