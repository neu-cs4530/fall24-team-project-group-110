import React from 'react';
import { Divider, Space, Typography } from 'antd';
import { handleHyperlink } from '../../../../tool';
import CommentSection from '../../commentSection';
import './index.css';
import { Comment } from '../../../../types';

const { Text } = Typography;

/**
 * Interface representing the props for the AnswerView component.
 *
 * - text The content of the answer.
 * - ansBy The username of the user who wrote the answer.
 * - meta Additional metadata related to the answer.
 * - comments An array of comments associated with the answer.
 * - handleAddComment Callback function to handle adding a new comment.
 */
interface AnswerProps {
  text: string;
  ansBy: string;
  meta: string;
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * AnswerView component that displays the content of an answer with the author's name and metadata.
 * The answer text is processed to handle hyperlinks, and a comment section is included.
 *
 * @param text The content of the answer.
 * @param ansBy The username of the answer's author.
 * @param meta Additional metadata related to the answer.
 * @param comments An array of comments associated with the answer.
 * @param handleAddComment Function to handle adding a new comment.
 */
const AnswerView = ({ text, ansBy, meta, comments, handleAddComment }: AnswerProps) => (
  <div className='answer'>
    <Space direction='vertical' style={{ width: '100%' }}>
      <div className='answer-text'>
        <Text>{handleHyperlink(text)}</Text>
      </div>
      <Space direction='horizontal' style={{ justifyContent: 'space-between', width: '100%' }}>
        <Text strong>
          Answered by: <Text style={{ color: '#52c41a' }}>{ansBy}</Text>
        </Text>
        <Text type='secondary'>{meta}</Text>
      </Space>
      <Divider style={{ margin: '0 0' }} />
      <CommentSection comments={comments} handleAddComment={handleAddComment} />
      <Divider style={{ margin: '0 0' }} />
    </Space>
  </div>
);

export default AnswerView;
