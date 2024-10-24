import React from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Login = () => {
  const { username, handleSubmit, handleInputChange } = useLogin();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter your username.</h4>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={handleInputChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <button type='submit' className='login-button'>
          Submit
        </button>
      </form>
      <button className='register-button' onClick={() => navigate('/register')}>
        Don&apos;t have an account? Register here!
      </button>
    </div>
  );
};

export default Login;
