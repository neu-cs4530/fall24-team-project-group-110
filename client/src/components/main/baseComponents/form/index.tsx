import React, { ReactNode } from 'react';
import './index.css';
import { Card } from 'antd';

/**
 * Interface representing the props for the Form component.
 *
 * - children - The React nodes (elements) to be rendered inside the form container.
 */
interface FormProps {
  children: ReactNode;
}

/**
 * Form component that renders a container for form elements.
 * It wraps its children with a div styled as a form container.
 *
 * @param children The React nodes to be displayed inside the form container.
 */
const Form: React.FC<FormProps> = ({ children }) => (
  <Card className='form-card' bordered={true}>
    {children}
  </Card>
);

export default Form;
