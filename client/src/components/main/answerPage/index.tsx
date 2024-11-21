import React from 'react';
import { Button, Col, Divider, Row, Typography } from 'antd';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

const { Title } = Typography;

/**
 * AnswerPage component that displays the full content of a question along with its answers.
 * It also includes the functionality to vote, ask a new question, and post a new answer.
 */
const AnswerPage = () => {
  const { questionID, question, handleNewComment, handleNewAnswer } = useAnswerPage();

  if (!question) {
    return null;
  }

  return (
    <div className='answer-page-container'>
      <div className='answer-content'>
        <AnswerHeader
          meta={getMetaData(new Date(question.askDateTime))}
          views={question.views.length}
          title={question.title}
          qid={questionID}
          notifyList={question.notifyList}
        />
        <Divider />
        <Row
          gutter={[16, 16]}
          className='question-section'
          align={'top'}
          style={{ flexWrap: 'nowrap' }}>
          <Col flex='50px' className='vote-column'>
            <VoteComponent question={question} />
          </Col>
          <Col flex='auto' className='question-body-column'>
            <QuestionBody text={question.text} askby={question.askedBy} />
            <Divider />
            <CommentSection
              comments={question.comments}
              handleAddComment={(comment: Comment) =>
                handleNewComment(comment, 'question', questionID)
              }
            />
          </Col>
        </Row>
        <Divider />
        <div className='answers-section'>
          <Title level={4} style={{ margin: 0 }}>
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </Title>
          <Divider style={{ margin: '24px 0 0 0 ' }} />
          {question.answers.map((a, idx) => (
            <AnswerView
              key={idx}
              text={a.text}
              ansBy={a.ansBy}
              meta={getMetaData(new Date(a.ansDateTime))}
              comments={a.comments}
              handleAddComment={(comment: Comment) => handleNewComment(comment, 'answer', a._id)}
            />
          ))}
        </div>
        <div className='answer-button-container'>
          <Button type='primary' size='large' className='answer-button' onClick={handleNewAnswer}>
            Answer Question
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnswerPage;
