import React from 'react';
import './index.css';
import { Col, Row, Segmented, Typography } from 'antd';
import { OrderType, orderTypeDisplayName } from '../../../../types';
import AskQuestionButton from '../../askQuestionButton';

const { Title, Text } = Typography;

/**
 * Interface representing the props for the QuestionHeader component.
 *
 * titleText - The title text displayed at the top of the header.
 * qcnt - The number of questions to be displayed in the header.
 * setQuestionOrder - A function that sets the order of questions based on the selected message.
 */
interface QuestionHeaderProps {
  titleText: string;
  qcnt: number;
  setQuestionOrder: (order: OrderType) => void;
}

/**
 * QuestionHeader component displays the header section for a list of questions.
 * It includes the title, a button to ask a new question, the number of the quesions,
 * and buttons to set the order of questions.
 *
 * @param titleText - The title text to display in the header.
 * @param qcnt - The number of questions displayed in the header.
 * @param setQuestionOrder - Function to set the order of questions based on input message.
 */
const QuestionHeader = ({ titleText, qcnt, setQuestionOrder }: QuestionHeaderProps) => (
  <div className='question-header'>
    <Row gutter={16} align='middle'>
      <Col flex='auto'>
        <Title level={3}>{titleText}</Title>
      </Col>
      <Col>
        <AskQuestionButton />
      </Col>
    </Row>
    <Row gutter={16} align='middle' justify='space-between'>
      <Col>
        <Text>{qcnt} questions</Text>
      </Col>
      <Col>
        <div className='segmented-container'>
          <Segmented
            options={Object.keys(orderTypeDisplayName).map(order => ({
              label: orderTypeDisplayName[order as OrderType],
              value: order as OrderType,
            }))}
            onChange={setQuestionOrder}
            defaultValue={Object.keys(orderTypeDisplayName)[0] as OrderType}
          />
        </div>
      </Col>
    </Row>
  </div>
);

export default QuestionHeader;
