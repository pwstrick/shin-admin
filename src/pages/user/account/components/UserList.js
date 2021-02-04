/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-02-03 11:30:27
 * @LastEditors: strick
 * @Description: 账户列表
 * @FilePath: /strick/shin-admin/src/pages/user/account/components/UserList.js
 */
import React from 'react';
import _ from 'lodash';
import { Table, Popconfirm, Tag, Divider } from 'antd';
import { setPage } from 'utils/tools'
/* eslint-disable */
const UserList = ({
  total,
  curPage,
  dataSource,
  userRoles,
  onQueryChange,
  onUpdateUserStatus,
  onDeleteUser,
  onEditUser,
  resetPassword,
}) => {
  const columns = [{
    title: 'id',
    dataIndex: '_id',
    key: 'id',
  }, {
    title: '姓名',
    dataIndex: 'realName',
    key: 'realName',
  }, {
    title: '账号',
    dataIndex: 'userName',
    key: 'userName',
  }, {
    title: '电话',
    dataIndex: 'cellphone',
    key: 'cellphone',
  }, {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles',
    render: (roles) => {
      const roleNames = roles.map((role) => {
        const roleItem = _.find(userRoles, { value: role });
        return roleItem ? roleItem.label : '未知';
      });
      return <span>{ roleNames.toString() }</span>;
    },
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: status => (
      <Tag
        color={status ? 'green' : 'red'}
      >{ status ? '正常' : '被禁用' }</Tag>
    ),
  }, {
    title: '操作',
    key: 'operation',
    fixed: "right",
    render: (text, record) => (
      <div>
        <a onClick={() => onEditUser(record._id)}>编辑</a>
        <Divider type="vertical" />
        <Popconfirm
          title={`确定要${record.status ? '禁用' : '启用'} ${record.realName} 吗？`}
          onConfirm={() => { onUpdateUserStatus(record._id, !record.status); }}
        >
          <a>{record.status ? '禁用' : '启用'}</a>
        </Popconfirm>
        <Divider type="vertical" />
        <Popconfirm title={`确定要删除 ${record.realName} 吗？`} onConfirm={() => { onDeleteUser(record._id); }}>
          <a>删除</a>
        </Popconfirm>
        <Divider type="vertical" />
        <a onClick={() => resetPassword(record)}>修改密码</a>
      </div>
    ),
  }];
  const pagination = setPage({
    curPage,
    total,
    onChange: onQueryChange,
  });
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={global.loading}
        rowKey="_id"
        pagination={pagination}
        scroll= {{ x: true }}
      />
    </div>
  );
};

export default UserList;
