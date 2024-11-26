import './index.css';
import { Button, Input, Typography, Form, Space } from 'antd';
import { FiUser } from 'react-icons/fi';
import { IoLockClosedOutline } from 'react-icons/io5';
import { MdOutlineMailOutline } from 'react-icons/md';
import useRegister from '../../../hooks/useRegister';

const { Text } = Typography;

interface RegisterProps {
  switchToVerify: () => void;
}

/**
 * Register Component contains a form that allows the user to input their username and password,
 * which is then submitted to the backend for registration.
 * if registration response from the backend is successful, then the username is submitted
 * to the application's context through the useLoginContext hook.
 * otherwise, an error message is displayed.
 */
const Register = ({ switchToVerify }: RegisterProps) => {
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

  const onSubmit = async () => {
    await handleSubmit();
    switchToVerify();
  };

  return (
    <div className='register-container'>
      <h2>Register!</h2>
      <h4>Please fill out the following fields.</h4>
      <Form
        layout='vertical'
        labelCol={{ span: 8 }}
        style={{ maxWidth: '50%' }}
        onFinish={onSubmit}>
        <Form.Item
          label='Username'
          name={'username'}
          rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input
            className='register-input-text'
            prefix={<FiUser />}
            value={username}
            onChange={handleUsernameChange}
          />
        </Form.Item>
        <Form.Item
          label='Email'
          name={'email'}
          rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input
            className='register-input-text'
            prefix={<MdOutlineMailOutline />}
            value={email}
            onChange={handleEmailChange}
          />
        </Form.Item>
        <Form.Item
          label='Password'
          name={'password'}
          rules={[
            { required: true, message: 'Please input your password and meet requirements!' },
          ]}>
          <Input.Password
            className='register-input-text'
            prefix={<IoLockClosedOutline />}
            value={password}
            onChange={handlePasswordChange}
          />
        </Form.Item>
        <Text type='danger'>{error}</Text>
        <Form.Item>
          <Space>
            <Button type='primary' htmlType='submit'>
              Register
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
