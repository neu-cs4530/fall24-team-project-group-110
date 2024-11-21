import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

/**
 * AskQuestionButton component that renders a button for navigating to the
 * "New Question" page. When clicked, it redirects the user to the page
 * where they can ask a new question.
 */
const AskQuestionButton = () => {
  const navigate = useNavigate();

  /**
   * Function to handle navigation to the "New Question" page.
   */
  const handleNewQuestion = () => {
    navigate('/new/question');
  };

  return (
    <Button
      type='primary'
      size='large'
      className='ask-question-btn'
      onClick={() => {
        handleNewQuestion();
      }}>
      Ask Question
    </Button>
  );
};

export default AskQuestionButton;
