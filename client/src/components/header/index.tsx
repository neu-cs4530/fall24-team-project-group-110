import React from 'react';
import { Avatar, Dropdown, Input, MenuProps, Typography, Modal } from 'antd';
import { FaConnectdevelop } from 'react-icons/fa';
import { CiSearch } from 'react-icons/ci';
import { IoLogOutOutline } from 'react-icons/io5';
import { FaCircleUser } from 'react-icons/fa6';
import { PiCaretRight } from 'react-icons/pi';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';
import useUserContext from '../../hooks/useUserContext';
import NotificationDropdown from './notificationDropdown';
import CustomAvatar from '../customAvatar';

const { Title } = Typography;
const { confirm } = Modal;

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleLogout } = useHeader();
  const { user } = useUserContext();
  const navigate = useNavigate();

  const showLogoutConfirm = () => {
    confirm({
      title: 'Are you sure you want to logout?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleLogout();
      },
      onCancel() {
        // eslint-disable-next-line no-console
        console.log('OK');
      },
    });
  };

  const menuItems: MenuProps['items'] = [
    {
      key: 'title',
      label: 'My Account',
      disabled: true,
      className: 'dropdown-item-disabled',
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      label: (
        <div onClick={() => navigate(`/profile/${user._id}`)} className='dropdown-item'>
          <span className='dropdown-align'>
            <FaCircleUser className='dropdown-icon' />
            <span>Profile</span>
          </span>
          <PiCaretRight className='dropdown-arrow' />
        </div>
      ),
    },
    {
      key: 'logout',
      label: (
        <div onClick={showLogoutConfirm} className='dropdown-item'>
          <span className='dropdown-align'>
            <IoLogOutOutline className='dropdown-icon' />
            <span>Logout</span>
          </span>
          <PiCaretRight className='dropdown-arrow' />
        </div>
      ),
    },
  ];

  return (
    <div className='custom-header'>
      <div onClick={() => navigate('/home')} className='logo-container'>
        <Title
          level={2}
          className='logo-text'
          style={{ color: '#ffffff', alignItems: 'center', margin: 0 }}>
          <FaConnectdevelop /> Husky Connect
        </Title>
      </div>
      <Input
        id='searchBar'
        addonBefore={<CiSearch />}
        placeholder='Search for questions...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='search-bar'
      />
      <div className='header-actions'>
        <NotificationDropdown />
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement='bottomRight'
          arrow={{ pointAtCenter: true }}>
          <Avatar
            size={36}
            shape='circle'
            src={user.picture}
            icon={<CustomAvatar user={user} size={36} />}
            alt={`${user.username} profile`}
            className='profile-avatar'
          />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
