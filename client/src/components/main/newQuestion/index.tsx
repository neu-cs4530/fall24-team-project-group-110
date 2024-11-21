import React from 'react';
import { Alert, Button } from 'antd';
import useNewQuestion from '../../../hooks/useNewQuestion';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import TextArea from '../baseComponents/textarea';
import './index.css';

/**
 * NewQuestionPage component allows users to submit a new question with a title,
 * description, tags, and username.
 */
const NewQuestionPage = () => {
  const {
    title,
    setTitle,
    text,
    setText,
    tagNames,
    setTagNames,
    titleErr,
    textErr,
    tagErr,
    postQuestion,
  } = useNewQuestion();

  return (
    <div className='form-page-container'>
      <div className='form-container'>
        <Alert
          message={
            <div>
              <strong>Helpful Tips for Asking Questions:</strong>
              <ul>
                <li>
                  Provide a clear and concise <strong>title</strong>.
                </li>
                <li>
                  In the <strong>text</strong> field, provide enough details about your issue or
                  question.
                </li>
                <li>
                  Use relevant <strong>tags</strong> to help others find your question.
                </li>
                <li>
                  <strong>Mandatory fields</strong> are marked with an asterisk (*)
                </li>
              </ul>
            </div>
          }
          type='info'
          showIcon
          className='info-alert'
          style={{ marginBottom: '20px' }}
        />
        <Form>
          <Input
            title={'Question Title'}
            hint={'Limit title to 100 characters or less'}
            id={'formTitleInput'}
            val={title}
            setState={setTitle}
            err={titleErr}
          />
          <TextArea
            title={'Question Text'}
            hint={'Add details'}
            id={'formTextInput'}
            val={text}
            setState={setText}
            err={textErr}
          />
          <Input
            title={'Tags'}
            hint={'Add keywords separated by whitespace'}
            id={'formTagInput'}
            val={tagNames}
            setState={setTagNames}
            err={tagErr}
          />
          <div className='form-footer'>
            <Button
              className='form_postBtn'
              onClick={() => {
                postQuestion();
              }}>
              Post Question
            </Button>
            <div className='mandatory_indicator'>* indicates mandatory fields</div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default NewQuestionPage;
