import React from 'react';
import { Col, Row, Typography } from 'antd';
import './index.css';
import AskQuestionButton from '../../askQuestionButton';

const { Title, Text } = Typography;

/**
 * Interface representing the props for the AnswerHeader component.
 *
 * - ansCount - The number of answers to display in the header.
 * - title - The title of the question or discussion thread.
 */
interface AnswerHeaderProps {
  ansCount: number;
  title: string;
}

/**
 * AnswerHeader component that displays a header section for the answer page.
 * It includes the number of answers, the title of the question, and a button to ask a new question.
 *
 * @param ansCount The number of answers to display.
 * @param title The title of the question or discussion thread.
 */
const AnswerHeader = ({ ansCount, title }: AnswerHeaderProps) => (
  // <div id='answersHeader' className='space_between right_padding'>
  //   <div className='bold_title'>{ansCount} answers</div>
  //   <div className='bold_title answer_question_title'>{title}</div>
  //   <AskQuestionButton />
  // </div>
  <div style={{ padding: '16px', background: '#fafafa', borderRadius: '8px' }}>
    <Row align='middle' justify='space-between' gutter={[16, 16]}>
      <Col>
        <Title level={4} style={{ margin: 0 }}>
          {ansCount} {ansCount === 1 ? 'Answer' : 'Answers'}
        </Title>
      </Col>

      <Col flex='auto'>
        <Text
          strong
          ellipsis={{
            tooltip: title,
          }}
          style={{ fontSize: '18px', display: 'block', color: '#595959' }}>
          {title}
        </Text>
      </Col>

      <Col>
        <AskQuestionButton />
        {/* <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => AskQuestionButton()}>
          Ask Question
        </Button> */}
      </Col>
    </Row>
  </div>
);

export default AnswerHeader;
