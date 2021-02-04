/*
 * @Author: strick
 * @Date: 2020-12-13 14:49:19
 * @LastEditTime: 2021-02-03 17:49:52
 * @LastEditors: strick
 * @Description: 修改密码
 * @FilePath: /strick/shin-admin/src/components/Common/ResetPassword.js
 */
import React from 'react';
import { Modal, Form, Input } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Password } = Input;
function ResetPassword({ dispatch, form, visible, id, userName }) {
  const { getFieldDecorator, resetFields } = form;

  // 关闭对话框
  function hideModal() {
    dispatch({
      type: 'resetPassword/hideModal',
    });
  }

  // 修改密码
  function resetPassword() {
    form.validateFields((err, values) => {
      const data = {};
      if (id && userName) {
        data.id = id;
        data.userName = userName;
      }
      if (!err) {
        dispatch({
          type: 'resetPassword/resetPassword',
          payload: Object.assign(data, values),
        });
        resetFields();
      }
    });
  }

  const checkPasswordConfirm = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      return callback('两次输入的密码不一致');
    }
    callback();
  };

  const formItemLayout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 15,
    },
  };

  return (
    <Modal
      title="修改密码"
      visible={visible}
      onOk={resetPassword}
      onCancel={hideModal}
    >
      <Form>
        <FormItem
          {...formItemLayout}
          label="新密码"
          hasFeedback
        >
          {getFieldDecorator('password', {
            rules: [{
              required: true, message: '请输入密码',
            }, {
              pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)(?![0-9A-Za-z]+$)(?![0-9\W]+$)(?![a-zA-Z\W]+$)[0-9A-Za-z\W]{8,16}$/, message: '8到16位，必须包含字母、数字、特殊符号',
            }],
          })(
            <Password />,
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="重复新密码"
          hasFeedback
        >
          {getFieldDecorator('passwordConfirm', {
            rules: [{
              required: true, message: '请输入重复密码',
            }, {
              validator: checkPasswordConfirm,
            }],
          })(
            <Password />,
          )}
        </FormItem>
      </Form>
    </Modal>
  );
}

export default connect(({ resetPassword }) => resetPassword)(Form.create()(ResetPassword));
