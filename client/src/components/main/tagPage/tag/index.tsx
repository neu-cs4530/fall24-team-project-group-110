import React from 'react';
import { Badge, Card, Typography } from 'antd';
import './index.css';
import { TagData } from '../../../../types';
import useTagSelected from '../../../../hooks/useTagSelected';

const { Title, Text } = Typography;

/**
 * Props for the Tag component.
 *
 * t - The tag object.
 * clickTag - Function to handle the tag click event.
 */
interface TagProps {
  t: TagData;
  clickTag: (tagName: string) => void;
}

/**
 * Tag component that displays information about a specific tag.
 * The component displays the tag's name, description, and the number of associated questions.
 * It also triggers a click event to handle tag selection.
 *
 * @param t - The tag object .
 * @param clickTag - Function to handle tag clicks.
 */
const TagView = ({ t, clickTag }: TagProps) => {
  const { tag } = useTagSelected(t);

  return (
    <Card
      hoverable
      onClick={() => clickTag(t.name)}
      style={{
        textAlign: 'center',
        borderRadius: '0px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        height: '170px',
        position: 'relative',
        paddingTop: '0px',
      }}>
      <Badge.Ribbon
        text={`${t.qcnt} Questions`}
        color='blue'
        style={{ top: '0', right: '0', position: 'absolute' }}></Badge.Ribbon>
      <Title
        level={5}
        style={{
          color: '#1890ff',
          marginBottom: '8px',
          fontSize: '200%',
          marginTop: '16px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
          {tag.name}
        </Title>
      <span
        style={{
          display: '-webkit-box',
          WebkitBoxOrient: 'vertical',
          WebkitLineClamp: 3,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}>
        {tag.description}
      </span>
    </Card>
  );
};

export default TagView;
