import React, { useState } from 'react';
import { Button, Menu, MenuProps } from 'antd';
import { CiSquareQuestion } from 'react-icons/ci';
import { GoSidebarCollapse, GoTag } from 'react-icons/go';
import { MdChatBubbleOutline } from 'react-icons/md';
import { FiUsers } from 'react-icons/fi';
import './index.css';
import { useNavigate } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number];

const menuItems = (): MenuItem[] => [
  { key: '/home', icon: <CiSquareQuestion />, label: 'Questions' },
  { key: '/tags', icon: <GoTag />, label: 'Tags' },
  { key: '/conversation', icon: <MdChatBubbleOutline />, label: 'Chat' },
  { key: '/users', icon: <FiUsers />, label: 'Users' },
];

/**
 * The SideBarNav component has two menu items: "Questions" and "Tags".
 * It highlights the currently selected item based on the active page and
 * triggers corresponding functions when the menu items are clicked.
 */
const SideBarNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const handleClick: MenuProps['onClick'] = e => {
    navigate(e.key);
  };

  return (
    <div className={`sideBarNav ${collapsed ? 'collapsed' : ''}`}>
      <div className='toggleButton'>
        <Button onClick={toggleCollapsed}>
          <GoSidebarCollapse
            style={{
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease',
            }}
          />
        </Button>
      </div>
      <Menu
        defaultSelectedKeys={['/home']}
        mode='inline'
        theme='dark'
        inlineCollapsed={collapsed}
        items={menuItems()}
        onClick={handleClick}
      />
    </div>
  );
};

export default SideBarNav;
