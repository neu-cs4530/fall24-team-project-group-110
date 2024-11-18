import './index.css';
import { useNavigate } from 'react-router-dom';
import useVerify from '../../hooks/useVerify';

/**
 * Verify Component contains a form that allows the user to input the code they received from their email,
 * which is then submitted to the backend for verification.
 * if verification response from the backend is successful, then the user is navigated to the home page.
 * otherwise, an error message is displayed.
 */
const Verify = () => {
  const { code, error, resendText, handleCodeChange, handleSubmit, handleResendCode } = useVerify();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Verify Here!</h2>
      <h4>Please submit the code you received from your email.</h4>
      <form onSubmit={handleSubmit}>
        <div className='form-fields-container'>
          <input
            type='text'
            value={code}
            onChange={handleCodeChange}
            placeholder='Enter your verification code'
            required
            className='input-text'
            id={'codeInput'}
          />
          <p className='error-text'>{error}</p>
          <div className='form-buttons-container'>
            <button type='button' onClick={() => navigate('/register')} className='cancel-button'>
              Cancel
            </button>
            <button type='submit' className='login-button'>
              Submit
            </button>
          </div>
        </div>
      </form>
      <div>
        <button onClick={() => handleResendCode()}>Click here to resend code</button>
        <p>{resendText}</p>
      </div>
    </div>
  );
};

export default Verify;
