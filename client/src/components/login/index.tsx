import './index.css';
import { Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

/**
 * Login Component contains a form that allows the user to input their username and password,
 * which is then submitted to the backend for authentication.
 * if login response from the backend is successful, then the username is submitted
 * to the application's context through the useLoginContext hook.
 * otherwise, an error message is displayed.
 */
const Login = () => {
  const { username, password, error, handleUsernameChange, handlePasswordChange, handleSubmit } =
    useLogin();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter your username.</h4>
      <form onSubmit={handleSubmit}>
        <div className='form-fields-container'>
          <Input
            type='text'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter your username'
            required
            className='input-text'
            id={'usernameInput'}
          />
          <Input
            type='text'
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter your password'
            required
            className='input-text'
            id={'passwordInput'}
          />
          <p className='error-text'>{error}</p>
          <button type='submit' className='login-button'>
            Submit
          </button>
        </div>
      </form>
      <button className='register-button' onClick={() => navigate('/register')}>
        Don&apos;t have an account? Register here!
      </button>
    </div>
  );
};

export default Login;
