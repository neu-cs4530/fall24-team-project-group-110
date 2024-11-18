import { useNavigate } from 'react-router-dom';
import { ChangeEvent, useState } from 'react';
import { addUser } from '../services/userService';
import usePreLoginContext from './usePreLoginContext';

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
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string>('');
  const { setUser } = usePreLoginContext();
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
   * Function to handle the input change event for the email field.
   *
   * @param e - the event object.
   */
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const user = await addUser(username, email, password);
      setUser(user);
      navigate('/verify');
    } catch (e) {
      setError('Error while registering user');
    }
  };

  return {
    username,
    email,
    password,
    error,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};

export default useRegister;
