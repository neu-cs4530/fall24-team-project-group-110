import React from 'react';
import { Input, Button, Row, Col } from 'antd';

interface UserHeaderProps {
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ search, setSearch, onSearch }) => (
  <Row gutter={16} className='user-header'>
    <Col flex='auto'>
      <Input
        placeholder='Search for users'
        value={search}
        onChange={e => setSearch(e.target.value)}
        allowClear
      />
    </Col>
    <Col>
      <Button type='primary' onClick={onSearch}>
        Search
      </Button>
    </Col>
  </Row>
);

export default UserHeader;
