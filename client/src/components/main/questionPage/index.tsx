import React, { useEffect, useState } from 'react';
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
  const { titleText, qlist, setQuestionOrder } = useQuestionPage();
  const { socket } = useUserContext();

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    socket.disconnect();
    socket.connect();
  }, [socket]);

  const startIdx = (currentPage - 1) * pageSize;
  const currentQuestions = qlist.slice(startIdx, startIdx + pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Layout className='question-page'>
      <Content style={{ padding: '20px' }}>
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
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={qlist.length}
          showQuickJumper
          onChange={handlePageChange}
          className='pagination'
        />
      </Content>
    </Layout>
  );
};

export default QuestionPage;
