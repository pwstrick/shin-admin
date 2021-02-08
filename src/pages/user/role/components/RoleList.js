/**
 * 角色列表
 */
import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Table, Tag, Popconfirm } from 'antd';
import authority from '@/authority';
/* eslint-disable */
function RoleList({ dispatch, dataSource, page, query }) {
  // 渲染状态
  function renderStatus(status) {
    switch (status) {
      case 0:
        return (<Tag color="red">禁用</Tag>);
      case 1:
        return (<Tag color="green">启用</Tag>);
      default:
        return (<Tag color="yellow">{ `未知状态：${status}` }</Tag>);
    }
  }

  // 渲染权限
  function renderPermission(permissions) {
    if (permissions[0] === '*') return '*';
    const names = permissions.map((pms) => {
      const res = _.find(authority, { id: pms });
      if (res) return res.name;
      return `未知权限：${pms}`;
    });
    return names.join(',');
  }

  // 渲染操作
  function renderOperation(record) {
    return (
      <span>
        <a onClick={() => update(record)}>修改</a>
        <span className="ant-divider" />
        <Popconfirm
          title={`确定${!record.status ? '启用' : '禁用'}吗？`}
          onConfirm={() => updateStatus(record, record.status ? 0 : 1)}
        >
          <a>{record.status ? '禁用' : '启用'}</a>
        </Popconfirm>
        <span className="ant-divider" />
        <Popconfirm
          title={'确定删除吗？'}
          onConfirm={() => remove(record)}
        >
          <a>删除</a>
        </Popconfirm>
      </span>
    );
  }

  // 更新角色信息
  function update(record) {
    dispatch({
      type: 'userRole/showModal',
      payload: { title: '修改角色', record },
    });
  }

  // 禁用/解禁用户
  function updateStatus(record, status) {
    dispatch({
      type: 'userRole/updateStatus',
      payload: {
        roleId: record._id,
        status,
      },
    });
  }

  // 删除角色
  function remove(record) {
    dispatch({
      type: 'userRole/remove',
      payload: {
        roleId: record._id,
      },
    });
  }

  const columns = [{
    title: 'id',
    key: 'id',
    dataIndex: '_id',
  }, {
    title: '角色名称',
    key: 'roleName',
    dataIndex: 'roleName',
  }, {
    title: '角色简介',
    key: 'roleDesc',
    dataIndex: 'roleDesc',
  }, {
    title: '状态',
    key: 'status',
    dataIndex: 'status',
    render: renderStatus,
  }, {
    title: '权限列表',
    key: 'rolePermission',
    dataIndex: 'rolePermission',
    render: renderPermission,
  }, {
    title: '操作',
    fixed: "right",
    key: 'operation',
    render: renderOperation,
  }];
  const pagination = {
    current: page.cursor,
    total: page.total,
    onChange(cursor) {
      dispatch({
        type: 'userRole/query',
        payload: {
          ...query,
          cursor,
        },
      });
    },
  };
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowKey={record => record._id}
      pagination={pagination}
      scroll= {{ x: true }}
    />
  );
}

RoleList.propTypes = {
  dispatch: PropTypes.func,
  dataSource: PropTypes.array,
};

export default RoleList;
