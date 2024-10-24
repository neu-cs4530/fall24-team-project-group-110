import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import useLoginContext from './useLoginContext';

/**
 * Custom hook to handle login input and submission.
 *
 * @returns username - The current value of the username input.
 * @returns password - The current value of the password input.
 * @returns error - The current error message.
 * @returns handleUsernameChange - Function to handle changes in the username input field.
 * @returns handlePasswordChange - Function to handle changes in the password input field.
 * @returns handleSubmit - Function to handle login submission
 */
const useRegister = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setUser } = useLoginContext();
  const navigate = useNavigate();

  /**
   * Function to handle the input change event for the username field.
   *
   * @param e - the event object.
   */
  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  /**
   * Function to handle the input change event for the password field.
   *
   * @param e - the event object.
   */
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  /**
   * Function to handle the form submission event.
   * This function will call the backend to register the user.
   * If the registration is successful, the user will be set in the context
   * and navigated to the home page.
   * If the registration fails, an error message will be displayed.
   *
   * @param event - the form event object.
   */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: need to call api to register user
    // if successful, set user in context and navigate to home
    // else, set error message
    // setError('Error while registering user');
    setUser({ username });
    navigate('/home');
  };

  return { username, password, error, handleUsernameChange, handlePasswordChange, handleSubmit };
};

export default useRegister;
