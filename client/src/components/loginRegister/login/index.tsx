import './index.css';
import { Button, Input, Typography, Form } from 'antd';
import { FiUser } from 'react-icons/fi';
import { IoLockClosedOutline } from 'react-icons/io5';
import useLogin from '../../../hooks/useLogin';

const { Text } = Typography;

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

  return (
    <div className='login-container'>
      <h2>Login!</h2>
      <Form
        layout='vertical'
        labelCol={{ span: 8 }}
        style={{ maxWidth: '50%' }}
        onFinish={handleSubmit}>
        <Form.Item
          label='Username'
          name={'username'}
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input
            className='login-input-text'
            prefix={<FiUser />}
            value={username}
            onChange={handleUsernameChange}
            placeholder='Enter your username...'
          />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password
            className='login-input-text'
            prefix={<IoLockClosedOutline />}
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter your password...'
          />
        </Form.Item>
        <Text type='danger'>{error}</Text>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
