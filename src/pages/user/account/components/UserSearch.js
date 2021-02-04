/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-02-03 18:12:29
 * @LastEditors: strick
 * @Description: 账号搜索过滤
 * @FilePath: /strick/shin-admin/src/pages/user/account/components/UserSearch.js
 */
import React from 'react';
import { Input, Button, Select } from 'antd';

const Search = Input.Search;
const Option = Select.Option;
const UserSearch = ({ onSearch, onAddUser, userRoles }) => {
  return (
    <div>
      <Search
        placeholder="输入姓名或账号搜索"
        style={{ width: 200, marginRight: 20 }}
        onSearch={value => onSearch({keywords: value})}
      />
      <Select style={{ width: 200, marginRight: 10 }} placeholder="角色筛选" onChange={value => onSearch({roleId: value})}>
        <Option key={0} value="all">全部</Option>
        { userRoles.map((item, index) => {
          return <Option key={index + 1} value={item.value}>{item.label}</Option>;
        }) }
      </Select>
      <Button
        icon="plus-circle-o"
        type="primary"
        onClick={onAddUser}
      >新增账号</Button>
    </div>
  );
};
export default UserSearch;
