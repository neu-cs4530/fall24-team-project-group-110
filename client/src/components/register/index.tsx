import './index.css';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Typography, Form, Space } from 'antd';
import useRegister from '../../hooks/useRegister';

const { Text } = Typography;

/**
 * Register Component contains a form that allows the user to input their username and password,
 * which is then submitted to the backend for registration.
 * if registration response from the backend is successful, then the username is submitted
 * to the application's context through the useLoginContext hook.
 * otherwise, an error message is displayed.
 */
const Register = () => {
  const navigate = useNavigate();
  const {
    username,
    email,
    password,
    error,
    handleUsernameChange,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  } = useRegister();

  return (
    <div className='container'>
      <h2>Register Here!</h2>
      <h4>Please fill out the following fields.</h4>
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
          label='Email'
          name={'email'}
          rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input value={email} onChange={handleEmailChange} />
        </Form.Item>
        <Form.Item
          label='Password'
          name={'password'}
          rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password value={password} onChange={handlePasswordChange} />
        </Form.Item>
        <Text type='danger'>{error}</Text>
        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
            <Button type='default' onClick={() => navigate('/')}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
