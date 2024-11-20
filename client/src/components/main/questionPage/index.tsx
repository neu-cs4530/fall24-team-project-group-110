import React, { useEffect, useState } from 'react';
import { Typography, Layout, Row, Col, Spin, Pagination } from 'antd';
import './index.css';
import QuestionHeader from './header';
import QuestionView from './question';
import useQuestionPage from '../../../hooks/useQuestionPage';
import useUserContext from '../../../hooks/useUserContext';

const { Title, Text } = Typography;
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
    // <>
    //   <QuestionHeader
    //     titleText={titleText}
    //     qcnt={qlist.length}
    //     setQuestionOrder={setQuestionOrder}
    //   />
    //   <div id='question_list' className='question_list'>
    //     {qlist.map((q, idx) => (
    //       <QuestionView q={q} key={idx} />
    //     ))}
    //   </div>
    //   {titleText === 'Search Results' && !qlist.length && (
    //     <div className='bold_title right_padding'>No Questions Found</div>
    //   )}
    // </>
    <Layout className='question-page'>
      <Content style={{ padding: '20px' }}>
        <QuestionHeader
          titleText={titleText}
          qcnt={qlist.length}
          setQuestionOrder={setQuestionOrder}
        />
        <div id='question_list' className='question_list'>
          {currentQuestions.length > 0 ? (
            <Row gutter={[16, 16]}>
              {currentQuestions.map((q, idx) => (
                <Col xs={24} sm={12} md={8} lg={6} key={idx}>
                  <QuestionView q={q} />
                </Col>
              ))}
            </Row>
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
