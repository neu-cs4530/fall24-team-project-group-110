import React from 'react';
import { Col, Row, Space, Typography } from 'antd';
import { FiUser } from 'react-icons/fi';
import './index.css';
import { handleHyperlink } from '../../../../tool';

const { Text, Paragraph } = Typography;

/**
 * Interface representing the props for the QuestionBody component.
 *
 * - views - The number of views the question has received.
 * - text - The content of the question, which may contain hyperlinks.
 * - askby - The username of the user who asked the question.
 * - meta - Additional metadata related to the question, such as the date and time it was asked.
 */
interface QuestionBodyProps {
  text: string;
  askby: string;
}

/**
 * QuestionBody component that displays the body of a question.
 * It includes the number of views, the question content (with hyperlink handling),
 * the username of the author, and additional metadata.
 *
 * @param views The number of views the question has received.
 * @param text The content of the question.
 * @param askby The username of the question's author.
 * @param meta Additional metadata related to the question.
 */
const QuestionBody = ({ text, askby }: QuestionBodyProps) => (
  <div style={{ padding: '16px', background: '#dddddd', borderRadius: '8px' }}>
    <Row gutter={[16, 16]} align='middle'>
      <Col flex='auto'>
        <Paragraph>{handleHyperlink(text)}</Paragraph>
      </Col>

      <Col span={6} flex='100px'>
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Text style={{ color: '#08c', fontSize: '14px' }}>
            <FiUser /> {askby}
          </Text>
        </Space>
      </Col>
    </Row>
  </div>
);

export default QuestionBody;
