/**
 * 角色编辑框
 * 用于创建角色或修改角色
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Form, Input, Tree } from 'antd';
import _ from 'lodash';
import authority from '@/authority';
import { array2Tree } from 'utils/menu';

const { TextArea } = Input;
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;

function RoleModal({ dispatch, title, visible, form, currentRoleItem }) {
  const {
    getFieldDecorator,
    validateFields,
    resetFields,
  } = form;

  // 隐藏对话框
  function hideModal() {
    dispatch({
      type: 'userRole/hideModal',
    });
  }

  const tree = array2Tree(authority);
  const loop = (list) => {
    return list.map((item) => {
      // 纯权限用橙色表示
      const titleNode = <span style={item.type === 2 ? { color: 'orange' } : {}}>{item.name}</span>;
      if (item.children) {
        return (
          <TreeNode key={item.id} title={titleNode}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={titleNode} />;
    });
  };

  const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 15 },
  };

  const onSave = () => {
    validateFields((errors, values) => {
      if (errors) {
        return;
      }
      if (currentRoleItem.roleName) {
        const data = values;
        data.rolePermission = values.rolePermission.checked || values.rolePermission;
        // console.log(values.rolePermission)
        dispatch({
          type: 'userRole/update',
          payload: {
            ...data,
            roleId: currentRoleItem._id,
          },
        });
      } else {
        dispatch({
          type: 'userRole/create',
          payload: values,
        });
      }
    });
  };

  // 修改角色时取消父子节点的关联
  let checkStrictly = false;
  if (currentRoleItem.rolePermission) {
    checkStrictly = true;
  }

  function getInitialValue(arr) {
    if (arr) {
      return arr.filter((item) => {
        //如果只留下根节点，那么菜单就没有缩进效果了
        // let index = _.findIndex(authority, (value) => (value.pid == item));
        // if (index >= 0) return false;
        let index = _.findIndex(authority, { id: item });
        if (index !== -1) return item;
        return '';
      });
    }
    return [];
  }
  const afterClose = () => {
    resetFields();
  };
  return (
    <Modal
      title={title}
      visible={visible}
      onCancel={hideModal}
      onOk={onSave}
      afterClose={afterClose}
    >
      <Form>
        <FormItem
          {...formItemLayout}
          label="角色名称"
          hasFeedback
        >
          {getFieldDecorator('roleName', {
            initialValue: currentRoleItem.roleName || '',
            rules: [{
              required: true, message: '请输入角色名称',
            }],
          })(
            <Input />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="角色简介"
        >
          {getFieldDecorator('roleDesc', {
            initialValue: currentRoleItem.roleDesc || '',
          })(
            <TextArea />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="角色权限"
        >
          <i style={{ color: 'orange' }}>(橙色代表纯操作权限)</i>
          <div style={{maxHeight: 300, overflow: "auto"}}>
          {
            (currentRoleItem.rolePermission && currentRoleItem.rolePermission[0] === '*') ?
            '所有权限' :
            getFieldDecorator('rolePermission', {
              initialValue: getInitialValue(currentRoleItem.rolePermission),
              valuePropName: 'checkedKeys',
              trigger: 'onCheck',
            })(
              <Tree
                checkable
                checkStrictly={checkStrictly}
              >
                {loop(tree)}
              </Tree>,
            )
          }
          </div>
        </FormItem>
      </Form>
    </Modal>
  );
}

RoleModal.propTypes = {
  dispatch: PropTypes.func,
  title: PropTypes.string,
  visible: PropTypes.bool,
  currentRoleItem: PropTypes.object,
};

export default Form.create()(RoleModal);
