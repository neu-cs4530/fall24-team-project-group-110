import './index.css';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, Typography, Space } from 'antd';
import useVerify from '../../hooks/useVerify';

const { Text } = Typography;

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
      <Form layout='vertical' onFinish={handleSubmit} style={{ maxWidth: '30%' }}>
        <Form.Item rules={[{ required: true, message: 'Please input the code!' }]}>
          <Input.OTP length={4} value={code} onChange={handleCodeChange} />
        </Form.Item>
        <Text type='danger'>{error}</Text>
        <Form.Item>
          <Space>
            <Button type='default' onClick={() => navigate('/register')}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit'>
              Submit
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        <button className='resend-button' onClick={() => handleResendCode()}>
          Click here to resend code
        </button>
        <p>{resendText}</p>
      </div>
    </div>
  );
};

export default Verify;
