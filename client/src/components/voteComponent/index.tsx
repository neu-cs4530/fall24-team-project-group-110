import { Button, Space, Tooltip, Typography } from 'antd';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';
import { downvoteQuestion, upvoteQuestion } from '../../services/questionService';
import './index.css';
import useUserContext from '../../hooks/useUserContext';
import { Question } from '../../types';
import useVoteStatus from '../../hooks/useVoteStatus';

const { Text } = Typography;

/**
 * Interface represents the props for the VoteComponent.
 *
 * question - The question object containing voting information.
 */
interface VoteComponentProps {
  question: Question;
}

/**
 * A Vote component that allows users to upvote or downvote a question.
 *
 * @param question - The question object containing voting information.
 */
const VoteComponent = ({ question }: VoteComponentProps) => {
  const { user } = useUserContext();
  const { count, voted } = useVoteStatus({ question });

  /**
   * Function to handle upvoting or downvoting a question.
   *
   * @param type - The type of vote, either 'upvote' or 'downvote'.
   */
  const handleVote = async (type: string) => {
    try {
      if (question._id) {
        if (type === 'upvote') {
          await upvoteQuestion(question._id, user.username);
        } else if (type === 'downvote') {
          await downvoteQuestion(question._id, user.username);
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error while voting:', error);
    }
  };

  return (
    // <div className='vote-container'>
    //   <button
    //     className={`vote-button ${voted === 1 ? 'vote-button-upvoted' : ''}`}
    //     onClick={() => handleVote('upvote')}>
    //     Upvote
    //   </button>
    //   <button
    //     className={`vote-button ${voted === -1 ? 'vote-button-downvoted' : ''}`}
    //     onClick={() => handleVote('downvote')}>
    //     Downvote
    //   </button>
    //   <span className='vote-count'>{count}</span>
    // </div>
    <Space direction='vertical' align='center'>
      <Tooltip title={voted === 1 ? 'You upvoted this question' : 'Upvote'}>
        <Button
          type={voted === 1 ? 'primary' : 'default'}
          icon={voted === 1 ? <AiFillLike /> : <AiOutlineLike />}
          onClick={() => handleVote('upvote')}
          size='large'
          shape='circle'
        />
      </Tooltip>

      <Text strong style={{ fontSize: '16px' }}>
        {count}
      </Text>

      <Tooltip title={voted === -1 ? 'You downvoted this question' : 'Downvote'}>
        <Button
          type={voted === -1 ? 'primary' : 'default'}
          danger={voted === -1}
          icon={voted === -1 ? <AiFillDislike /> : <AiOutlineDislike />}
          onClick={() => handleVote('downvote')}
          size='large'
          shape='circle'
        />
      </Tooltip>
    </Space>
  );
};

export default VoteComponent;
