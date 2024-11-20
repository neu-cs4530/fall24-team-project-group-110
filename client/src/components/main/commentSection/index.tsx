import { useState } from 'react';
import { Button, Input, List, Typography, Collapse, Space } from 'antd';
import { getMetaData } from '../../../tool';
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
  const [showComments, setShowComments] = useState<boolean>(false);

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
    // <div className='comment-section'>
    //   <button className='toggle-button' onClick={() => setShowComments(!showComments)}>
    //     {showComments ? 'Hide Comments' : 'Show Comments'}
    //   </button>

    //   {showComments && (
    //     <div className='comments-container'>
    //       <ul className='comments-list'>
    //         {comments.length > 0 ? (
    //           comments.map((comment, index) => (
    //             <li key={index} className='comment-item'>
    //               <p className='comment-text'>{comment.text}</p>
    //               <small className='comment-meta'>
    //                 {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
    //               </small>
    //             </li>
    //           ))
    //         ) : (
    //           <p className='no-comments'>No comments yet.</p>
    //         )}
    //       </ul>

    //       <div className='add-comment'>
    //         <div className='input-row'>
    //           <textarea
    //             placeholder='Comment'
    //             value={text}
    //             onChange={e => setText(e.target.value)}
    //             className='comment-textarea'
    //           />
    //           <button className='add-comment-button' onClick={handleAddCommentClick}>
    //             Add Comment
    //           </button>
    //         </div>
    //         {textErr && <small className='error'>{textErr}</small>}
    //       </div>
    //     </div>
    //   )}
    // </div>
    <div className='comment-section'>
      <Collapse>
        <Panel header={`${comments.length} Comment(s)`} key='1'>
          <List
            dataSource={comments}
            renderItem={comment => (
              <List.Item className='comment-item'>
                <Space direction='vertical'>
                  <Paragraph className='comment-text'>{comment.text}</Paragraph>
                  <Text type='secondary' className='comment-meta'>
                    {comment.commentBy}, {getMetaData(new Date(comment.commentDateTime))}
                  </Text>
                </Space>
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
            {textErr && <Text type='danger'>{textErr}</Text>}
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
