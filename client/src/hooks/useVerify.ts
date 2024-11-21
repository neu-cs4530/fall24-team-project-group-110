import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useLoginContext from './useLoginContext';
import { verify, resendCode } from '../services/authService';
import usePreLoginContext from './usePreLoginContext';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns code - The current value of the code input.
 * @returns error - The current error message.
 * @returns handleCodeChange - Function to handle changes in the code input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useVerify = () => {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();
  const [resendText, setResendText] = useState<string>('');
  const { user } = usePreLoginContext();

  /**
   * Function to handle the input change event for the code.
   *
   * @param e - the event object.
   */
  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  /**
   * Function to handle the form submission event.
   *
   * NOTE: WHEN SUBMIT ACTION HAPPENS VALUES PARAMETER WILL BE PASSED CONTAINING THE FORM DATA
   */
  const handleSubmit = async () => {
    try {
      const verifiedUser = await verify(code);
      setUser(verifiedUser);
      navigate('/home');
    } catch (e) {
      setError('Error while verifying user');
    }
  };

  const handleResendCode = async () => {
    try {
      if (!user) {
        navigate('/register');
        return;
      }

      await resendCode(user.email);
      setResendText('Code sent');
    } catch (e) {
      setResendText('Error while resending code');
    }
  };

  return { code, error, resendText, handleCodeChange, handleSubmit, handleResendCode };
};

export default useVerify;
