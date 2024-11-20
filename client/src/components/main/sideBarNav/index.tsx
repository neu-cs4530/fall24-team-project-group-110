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

    // <div id='sideBarNav' className='sideBarNav'>
    //   <Menu>
    //     <Menu.Item>
    //       <NavLink to='/home' id='menu_questions'>
    //         Questions
    //       </NavLink>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <NavLink to='/tags' id='menu_tag'>
    //         Tags
    //       </NavLink>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <NavLink to='/conversation' id='menu_chat'>
    //         Chat
    //       </NavLink>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <NavLink to='/users' id='menu_users'>
    //         Users
    //       </NavLink>
    //     </Menu.Item>
    //   </Menu>
    //   <NavLink
    //     to='/home'
    //     id='menu_questions'
    //     className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
    //     Questions
    //   </NavLink>
    //   <NavLink
    //     to='/tags'
    //     id='menu_tag'
    //     className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
    //     Tags
    //   </NavLink>
    //   <NavLink
    //     to='/conversation'
    //     id='menu_chat'
    //     className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
    //     Chat
    //   </NavLink>
    //   <NavLink
    //     to='/users'
    //     id='menu_users'
    //     className={({ isActive }) => `menu_button ${isActive ? 'menu_selected' : ''}`}>
    //     Users
    //   </NavLink>
    // </div>
  );
};

export default SideBarNav;
