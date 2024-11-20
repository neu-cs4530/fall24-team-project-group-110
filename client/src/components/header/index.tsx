import React from 'react';
import { Button, Input, Typography } from 'antd';
import { CiLogin } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';
import useHeader from '../../hooks/useHeader';
import './index.css';
import useUserContext from '../../hooks/useUserContext';
import NotificationDropdown from './notificationDropdown';

const { Title } = Typography;

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleLogout } = useHeader();
  const { user } = useUserContext();
  const navigate = useNavigate();

  return (
    <div className='custom-header'>
      <div onClick={() => navigate('/home')}>
        <Title level={2} className='logo-text'>
          Fake Stack Overflow
        </Title>
      </div>
      <Input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className='search-bar'
        style={{ maxWidth: 300 }}
      />
      <div className='header-actions'>
        <NotificationDropdown />
        <Button className='username-button' onClick={() => navigate(`/profile/${user._id}`)}>
          {user.username}
        </Button>
        <Button className='logout-button' icon={<CiLogin />} onClick={handleLogout} />
      </div>
    </div>
  );
};

export default Header;
