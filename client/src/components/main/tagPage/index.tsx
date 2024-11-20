import React from 'react';
import { Col, Divider, Row, Typography } from 'antd';
import './index.css';
import TagView from './tag';
import useTagPage from '../../../hooks/useTagPage';
import AskQuestionButton from '../askQuestionButton';

const { Title } = Typography;

/**
 * Represents the TagPage component which displays a list of tags
 * and provides functionality to handle tag clicks and ask a new question.
 */
const TagPage = () => {
  const { tlist, clickTag } = useTagPage();

  return (
    // <>
    //   <div className='space_between right_padding'>
    //     <div className='bold_title'>{tlist.length} Tags</div>
    //     <div className='bold_title'>All Tags</div>
    //     <AskQuestionButton />
    //   </div>
    //   <div className='tag_list right_padding'>
    //     {tlist.map((t, idx) => (
    //       <TagView key={idx} t={t} clickTag={clickTag} />
    //     ))}
    //   </div>
    // </>
    <div style={{ padding: '24px' }} className='tag-container'>
      <Row justify='space-between' align='middle' style={{ marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>
          {tlist.length} Tags
        </Title>
        <AskQuestionButton />
      </Row>
      <Divider />
      <Row gutter={[16, 16]}>
        {tlist.map((t, idx) => (
          <Col key={idx} xs={24} sm={12} md={8} lg={6}>
            <TagView t={t} clickTag={clickTag} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TagPage;
