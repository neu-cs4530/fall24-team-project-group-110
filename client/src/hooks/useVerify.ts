import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';
import { verify } from '../services/authService';

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

  /**
   * Function to handle the input change event for the code.
   *
   * @param e - the event object.
   */
  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await verify(code);
      setUser(user);
      navigate('/home');
    } catch (e) {
      setError('Error while verifying user');
    }
  };

  return { code, error, handleCodeChange, handleSubmit };
};

export default useVerify;
