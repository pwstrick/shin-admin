/**
 * app用户快捷搜索
 */
import React from 'react';
import { Input, Select } from 'antd';

const InputGroup = Input.Group;
const SearchInput = Input.Search;
const Option = Select.Option;
const QuickSearch = ({ onSearch, onIdTypeChange }) => {
  // const containerStyle = {
  //   float: 'left',
  //   height: 47,
  //   lineHeight: '47px',
  //   marginLeft: 20,
  // };
  return (
    <div style={{ flex: 1, marginLeft: 10 }}>
      <InputGroup compact>
        <Select defaultValue="userId" onChange={onIdTypeChange}>
          <Option value="userId">User ID</Option>
        </Select>
        <SearchInput style={{ width: 180 }} onSearch={onSearch} placeholder="输入ID快捷搜索" />
      </InputGroup>
    </div>
  );
};

export default QuickSearch;

