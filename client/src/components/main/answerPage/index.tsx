import React from 'react';
import { Button, Col, Divider, Row } from 'antd';
import { getMetaData } from '../../../tool';
import AnswerView from './answer';
import AnswerHeader from './header';
import { Comment } from '../../../types';
import './index.css';
import QuestionBody from './questionBody';
import VoteComponent from '../voteComponent';
import CommentSection from '../commentSection';
import useAnswerPage from '../../../hooks/useAnswerPage';

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
    <div className='answer-page'>
      <AnswerHeader ansCount={question.answers.length} title={question.title} />
      <Row gutter={[16, 16]} className='question-section'>
        <Col flex='50px'>
          <VoteComponent question={question} />
        </Col>
        <Col flex='auto'>
          <QuestionBody
            views={question.views.length}
            text={question.text}
            askby={question.askedBy}
            meta={getMetaData(new Date(question.askDateTime))}
            qid={questionID}
            notifyList={question.notifyList}
          />
        </Col>
      </Row>
      <Divider />
      <CommentSection
        comments={question.comments}
        handleAddComment={(comment: Comment) => handleNewComment(comment, 'question', questionID)}
      />
      <Divider />
      <div className='answers-section'>
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
      <Divider />
      <div className='answer-button-container'>
        <Button type='primary' size='large' className='answer-button' onClick={handleNewAnswer}>
          Answer Question
        </Button>
      </div>
    </div>
  );
};

export default AnswerPage;
