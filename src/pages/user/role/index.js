/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-02-08 12:07:37
 * @Description: 角色列表 可以对于角色进行增删改查的操作
 * @FilePath: /strick/shin-admin/src/pages/user/role/index.js
 */
import React from 'react';
import { connect } from 'dva';
import { Button, Input, Form } from 'antd';
import RoleList from './components/RoleList';
import RoleModal from './components/RoleModal';
import styles from './list.less';
const FormItem = Form.Item;
function List({ form, dispatch, list, page, modalVisible, title, currentRoleItem, query }) {
  const {
    getFieldDecorator
  } = form;
  // 显示角色编辑框
  function showModal() {
    dispatch({
      type: 'userRole/showModal',
      payload: { title: '创建角色' },
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    form.validateFields((err, values) => {
      dispatch({
        type: 'userRole/query',
        payload: values,
      });
    });
  }
  return (
    <div>
      <div className={styles['role-header']}>
        <Form onSubmit={onSubmit} layout="inline">
          <FormItem>
            <Button
              type="primary"
              onClick={showModal}
              icon="plus-circle-o"
            >添加角色</Button>
          </FormItem>
          <FormItem>
            {getFieldDecorator('role')(
                <Input placeholder="请输入角色" style={{ width: 200, marginLeft: 30 }}/>
            )}
          </FormItem>
          <FormItem>
            <Button onClick={onSubmit} style={{ marginLeft: 30 }} type="primary">查询</Button>
          </FormItem>
        </Form>
      </div>
      <RoleList
        dispatch={dispatch}
        dataSource={list}
        page={page}
        query={query}
      />
      <RoleModal
        dispatch={dispatch}
        title={title}
        visible={modalVisible}
        currentRoleItem={currentRoleItem}
      />
    </div>
  );
}

export default connect(data => data.userRole)(Form.create()(List));
