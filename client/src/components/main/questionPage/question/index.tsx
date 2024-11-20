import React from 'react';
import { Card, Tag, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { getMetaData } from '../../../../tool';
import { Question } from '../../../../types';

const { Text, Paragraph } = Typography;

/**
 * Interface representing the props for the Question component.
 *
 * q - The question object containing details about the question.
 */
interface QuestionProps {
  q: Question;
}

/**
 * Question component renders the details of a question including its title, tags, author, answers, and views.
 * Clicking on the component triggers the handleAnswer function,
 * and clicking on a tag triggers the clickTag function.
 *
 * @param q - The question object containing question details.
 */
const QuestionView = ({ q }: QuestionProps) => {
  const navigate = useNavigate();

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  return (
    <Card
      hoverable
      onClick={() => q._id && handleAnswer(q._id)}
      style={{
        marginBottom: '16px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '16px' }}>
        <div style={{ textAlign: 'center', width: '100px' }}>
          <Text strong>{q.answers.length || 0}</Text> answers
          <br />
          <Text>{q.views.length || 0} views</Text>
        </div>

        <div style={{ flex: 1 }}>
          <Typography.Title
            level={5}
            style={{ margin: 0, color: '#0050b3', cursor: 'pointer' }}
            onClick={() => q._id && handleAnswer(q._id)}>
            {q.title}
          </Typography.Title>

          <Paragraph
            ellipsis={{ rows: 2, expandable: false }}
            style={{ marginTop: '8px', color: '#595959' }}>
            {q.text}
          </Paragraph>

          <div className='question_tags'>
            {q.tags.map((tag, idx) => (
              <Tag
                key={idx}
                color='geekblue'
                style={{ cursor: 'pointer', marginRight: '4px' }}
                onClick={e => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}>
                {tag.name}
              </Tag>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right', minWidth: '120px' }}>
          <Text strong className='question_author'>
            {q.askedBy}
          </Text>
          <br />
          <Text type='secondary' className='question_meta'>
            asked {getMetaData(new Date(q.askDateTime))}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default QuestionView;
