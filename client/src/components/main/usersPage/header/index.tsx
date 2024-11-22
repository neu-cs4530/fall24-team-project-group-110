import React, { ChangeEvent, KeyboardEvent } from 'react';
import { Input, Row, Col, Typography } from 'antd';
import { CiSearch } from 'react-icons/ci';
import './index.css';

const { Title } = Typography;

interface UserHeaderProps {
  search: string;
  onSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ search, onSearch, onKeyDown }) => (
  <div className='user-header'>
    <Title level={3} className='page-title'>
      Users
    </Title>
    <Row gutter={16}>
      <Col flex='auto'>
        <Input
          className='search-input'
          addonBefore={<CiSearch />}
          placeholder='Search for users...'
          value={search}
          onChange={onSearch}
          onKeyDown={onKeyDown}
          allowClear
        />
      </Col>
    </Row>
    <Title level={5} className='subheading'>
      Find users across the platform
    </Title>
  </div>
);

export default UserHeader;
