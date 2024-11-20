import React from 'react';
import { Col, Divider, Row, Space, Typography } from 'antd';
import { FiUser } from 'react-icons/fi';
import { CiCalendar } from 'react-icons/ci';
import './index.css';
import { handleHyperlink } from '../../../../tool';
import NotificationCheckbox from '../../notificationCheckbox';

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
  views: number;
  text: string;
  askby: string;
  meta: string;
  qid: string;
  notifyList: string[];
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
const QuestionBody = ({ views, text, askby, meta, qid, notifyList }: QuestionBodyProps) => (
  <div style={{ padding: '16px', background: '#1f1f1f', borderRadius: '8px', color: '#f5f5f5' }}>
    <Row gutter={[16, 16]} align='middle'>
      <Col span={4}>
        <Space>
          <Text style={{ color: '#f5f5f5', fontWeight: 600 }}>{views} views</Text>
        </Space>
      </Col>

      <Col span={14}>
        <Paragraph
          style={{
            color: '#f5f5f5',
            fontSize: '16px',
            lineHeight: '1.5',
          }}>
          {handleHyperlink(text)}
        </Paragraph>
      </Col>

      <Col span={6}>
        <Space direction='vertical' size='small' style={{ width: '100%' }}>
          <Text style={{ color: '#08c', fontSize: '14px' }}>
            <FiUser /> {askby}
          </Text>
          <Text style={{ color: '#888', fontSize: '14px' }}>
            <CiCalendar /> asked {meta}
          </Text>
          <NotificationCheckbox targetId={qid} notifyList={notifyList} type='question' />
        </Space>
      </Col>
    </Row>
    <Divider style={{ borderColor: '#444' }} />
  </div>
);

export default QuestionBody;
