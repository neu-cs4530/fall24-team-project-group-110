import './index.css';
import { useNavigate } from 'react-router-dom';
import useRegister from '../../hooks/useRegister';

/**
 * Register Component contains a form that allows the user to input their username and password,
 * which is then submitted to the backend for registration.
 * if registration response from the backend is successful, then the username is submitted
 * to the application's context through the useLoginContext hook.
 * otherwise, an error message is displayed.
 */
const Register = () => {
  const navigate = useNavigate();
  const { username, password, error, handleUsernameChange, handlePasswordChange, handleSubmit } =
    useRegister();

  return (
    <div className='container'>
      <h2>Register Here!</h2>
      <h4>Please fill out the following fields.</h4>
      <form onSubmit={handleSubmit}>
        <div className='form-fields-container'>
          <input
            type='text'
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter your username'
            required
            className='input-text'
            id={'usernameInput'}
          />
          <input
            type='text'
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter your password'
            required
            className='input-text'
            id={'passwordInput'}
          />
          <p className='error-text'>{error}</p>
          <div className='form-buttons-container'>
            <button onClick={() => navigate('/')} className='cancel-button'>
              Cancel
            </button>
            <button type='submit' className='login-button'>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Register;
