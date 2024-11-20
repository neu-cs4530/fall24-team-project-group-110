import React from 'react';
import { Button } from 'antd';
import { CiCirclePlus } from 'react-icons/ci';
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
      className='ask-question-btn'
      icon={<CiCirclePlus />}
      onClick={() => {
        handleNewQuestion();
      }}>
      Ask Question
    </Button>
  );
};

export default AskQuestionButton;
