import './index.css';
import { useNavigate } from 'react-router-dom';
import useRegister from '../../hooks/useRegister';

/**
 * Login Component contains a form that allows the user to input their username, which is then submitted
 * to the application's context through the useLoginContext hook.
 */
const Register = () => {
  const navigate = useNavigate();
  const { username, password, handleUsernameChange, handlePasswordChange, handleSubmit } =
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
