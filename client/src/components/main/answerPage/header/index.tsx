import React from 'react';
import { Col, Row, Typography } from 'antd';
import './index.css';
import AskQuestionButton from '../../askQuestionButton';
import NotificationCheckbox from '../../notificationCheckbox';

const { Title, Text } = Typography;

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  meta: string;
  views: number;
  title: string;
  qid: string;
  notifyList: string[];
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ meta, views, title, qid, notifyList }: AnswerHeaderProps) => (
  <div className='answer-header-container'>
    <Row gutter={16} align='middle'>
      <Col flex='auto'>
        <Title level={3}>{title}</Title>
        <Text>
          Asked {meta} &emsp; {views} views &emsp;{' '}
          <NotificationCheckbox targetId={qid} notifyList={notifyList} type='question' />
        </Text>
      </Col>
      <Col>
        <AskQuestionButton />
      </Col>
    </Row>
  </div>
);

export default AnswerHeader;
