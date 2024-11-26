import './index.css';
import { Button, Form, Input, Typography, Space } from 'antd';
import useVerify from '../../../hooks/useVerify';

const { Text } = Typography;

interface VerifyProps {
  cancelToRegister: () => void;
}

/**
 * Verify Component contains a form that allows the user to input the code they received from their email,
 * which is then submitted to the backend for verification.
 * if verification response from the backend is successful, then the user is navigated to the home page.
 * otherwise, an error message is displayed.
 */
const Verify = ({ cancelToRegister }: VerifyProps) => {
  const { code, error, resendText, handleCodeChange, handleSubmit, handleResendCode } = useVerify();

  return (
    <div className='verify-container'>
      <h2>Verify Here!</h2>
      <h4>Please submit the code you received from your email.</h4>
      <Form layout='vertical' onFinish={handleSubmit} style={{ maxWidth: '30%' }}>
        <Form.Item rules={[{ required: true, message: 'Please input the code!' }]}>
          <Input.OTP length={4} value={code} onChange={handleCodeChange} />
        </Form.Item>
        <Text type='danger'>{error}</Text>
        <Form.Item>
          <Space>
            <Button type='default' onClick={cancelToRegister}>
              Cancel
            </Button>
            <Button type='primary' htmlType='submit'>
              Verify
            </Button>
          </Space>
        </Form.Item>
      </Form>
      <div>
        <button className='resend-button' onClick={() => handleResendCode()}>
          Resend Code
        </button>
        <p className='resend-text'>{resendText}</p>
      </div>
    </div>
  );
};

export default Verify;
