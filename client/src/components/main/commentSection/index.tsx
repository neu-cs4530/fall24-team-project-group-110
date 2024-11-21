import { useState } from 'react';
import { Button, Input, List, Typography, Collapse, Alert } from 'antd';
import { getMetaData, handleHyperlink } from '../../../tool';
import { Comment } from '../../../types';
import './index.css';
import useUserContext from '../../../hooks/useUserContext';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

/**
 * Interface representing the props for the Comment Section component.
 *
 * - comments - list of the comment components
 * - handleAddComment - a function that handles adding a new comment, taking a Comment object as an argument
 */
interface CommentSectionProps {
  comments: Comment[];
  handleAddComment: (comment: Comment) => void;
}

/**
 * CommentSection component shows the users all the comments and allows the users add more comments.
 *
 * @param comments: an array of Comment objects
 * @param handleAddComment: function to handle the addition of a new comment
 */
const CommentSection = ({ comments, handleAddComment }: CommentSectionProps) => {
  const { user } = useUserContext();
  const [text, setText] = useState<string>('');
  const [textErr, setTextErr] = useState<string>('');

  /**
   * Function to handle the addition of a new comment.
   */
  const handleAddCommentClick = () => {
    if (text.trim() === '' || user.username.trim() === '') {
      setTextErr(text.trim() === '' ? 'Comment text cannot be empty' : '');
      return;
    }

    const newComment: Comment = {
      text,
      commentBy: user.username,
      commentDateTime: new Date(),
    };

    handleAddComment(newComment);
    setText('');
    setTextErr('');
  };

  return (
    <div className='comment-section'>
      <Collapse>
        <Panel
          header={`${comments.length} ${comments.length === 1 ? 'Comment' : 'Comments'}`}
          key='1'>
          <List
            dataSource={comments}
            renderItem={comment => (
              <List.Item className='comment-item'>
                <Paragraph className='comment-text'>
                  {handleHyperlink(comment.text)}
                  <Text type='secondary' className='comment-meta'>
                    - {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
                  </Text>
                </Paragraph>
              </List.Item>
            )}
            locale={{ emptyText: <Text italic>No comments yet.</Text> }}
          />

          <div className='add-comment'>
            <TextArea
              placeholder='Comment...'
              value={text}
              onChange={e => setText(e.target.value)}
              rows={3}
              className='comment-textarea'
            />
            {textErr && (
              <Alert message={textErr} type='error' showIcon={true} className='add-comment-error' />
            )}
            <Button type='primary' onClick={handleAddCommentClick} className='add-comment-button'>
              Add Comment
            </Button>
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default CommentSection;
