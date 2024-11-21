import './index.css';
import { Button, Input, Typography, Form, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../hooks/useLogin';

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
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <Form
        layout='vertical'
        labelCol={{ span: 8 }}
        style={{ maxWidth: '30%' }}
        onFinish={handleSubmit}>
        <Form.Item
          label='Username'
          name={'username'}
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input value={username} onChange={handleUsernameChange} />
        </Form.Item>
        <Form.Item
          label='Password'
          name='password'
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password value={password} onChange={handlePasswordChange} />
        </Form.Item>
        <Text type='danger'>{error}</Text>
        <Form.Item>
          <Button type='primary' htmlType='submit'>
            Submit
          </Button>
        </Form.Item>
      </Form>
      <button className='register-button' onClick={() => navigate('/register')}>
        Don&apos;t have an account? Register here!
      </button>
    </div>
  );
};

export default Login;
