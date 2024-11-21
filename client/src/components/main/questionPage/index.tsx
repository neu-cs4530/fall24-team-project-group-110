import React, { useEffect } from 'react';
import { Typography, Layout, Spin, Pagination } from 'antd';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import useUserContext from '../../../hooks/useUserContext';

const { Text } = Typography;
const { Content } = Layout;

/**
 * QuestionPage component renders a page displaying a list of questions
 * based on filters such as order and search terms.
 * It includes a header with order buttons and a button to ask a new question.
 */
const QuestionPage = () => {
  const { titleText, qlist, currentPage, setQuestionOrder, handlePageChange } = useQuestionPage();
  const { socket } = useUserContext();

  const pageSize = 15;
  const startIdx = (currentPage - 1) * pageSize;
  const currentQuestions = qlist.slice(startIdx, startIdx + pageSize);

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [socket]);

  return (
    <Layout className='question-page'>
      <Content className='question-content'>
        <QuestionHeader
          titleText={titleText}
          qcnt={qlist.length}
          setQuestionOrder={setQuestionOrder}
        />
        <div className='question-list'>
          {currentQuestions.length > 0 ? (
            currentQuestions.map((q, idx) => <QuestionView q={q} key={idx} />)
          ) : (
            <div className='no-questions'>
              {titleText === 'Search Results' ? (
                <Text className='bold_title'>No Questions Found</Text>
              ) : (
                <Spin size='large' />
              )}
            </div>
          )}
        </div>
        <div className='pagination'>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={qlist.length}
            showQuickJumper
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default QuestionPage;
