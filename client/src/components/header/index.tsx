import React from 'react';
import useHeader from '../../hooks/useHeader';
import './index.css';
import useUserContext from '../../hooks/useUserContext';
import NotificationDropdown from './notificationDropdown';

/**
 * Header component that renders the main title and a search bar.
 * The search bar allows the user to input a query and navigate to the search results page
 * when they press Enter.
 */
const Header = () => {
  const { val, handleInputChange, handleKeyDown, handleLogout } = useHeader();
  const { user } = useUserContext();

  return (
    <div id='header' className='header'>
      <div></div>
      <div className='title'>Fake Stack Overflow</div>
      <input
        id='searchBar'
        placeholder='Search ...'
        type='text'
        value={val}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
      <p>{user.username}</p>
      <NotificationDropdown />
      <button className='logout-button' onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Header;
