import React, { useState } from 'react';
import './index.css';
import { Button } from 'antd';
import Login from './login';
import Register from './register';
import Verify from './verify';

const LoginRegister = () => {
  const [state, setState] = useState<'login' | 'register' | 'verify'>('login');

  const switchToRegister = () => setState('register');
  const switchToLogin = () => setState('login');
  const switchToVerify = () => setState('verify');

  return (
    <div className={`container ${state === 'register' || state === 'verify' ? 'active' : ''}`}>
      <div className={`form-container login`}>
        <Login />
      </div>
      <div className={`${state === 'register' ? '' : 'switch'}`}>
        <div className={`form-container register`}>
          <Register switchToVerify={switchToVerify} />
        </div>
        <div className={`form-container verify`}>
          <Verify cancelToRegister={switchToRegister} />
        </div>
      </div>
      <div className='toggle-container'>
        <div className='toggle'>
          <div className='toggle-panel toggle-left'>
            <h1>Register a New Account!</h1>
            <p>Register with your personal details to use all of site features</p>
            <br />
            <p>Already have an account? Login here!</p>
            <Button className='switch-button' type='primary' id='login' onClick={switchToLogin}>
              Login
            </Button>
          </div>
          <div className='toggle-panel toggle-right'>
            <h1>Welcome!</h1>
            <p>Enter your credentials to use all of the site features</p>
            <br />
            <p>Don&apos;t have an account? Register here!</p>
            <Button
              className='switch-button'
              type='primary'
              id='register'
              onClick={switchToRegister}>
              Register
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
