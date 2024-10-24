import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns handleInputChange - Function to handle changes in the input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useRegister = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   *
   * @param event - the form event object.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUser({ username });
    navigate('/home');
  };

  return { username, password, handleUsernameChange, handlePasswordChange, handleSubmit };
};

export default useRegister;
