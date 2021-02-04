/**
 * 账号管理弹窗
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Checkbox, Modal } from 'antd';

const FormItem = Form.Item;
const { Password } = Input;
const CheckboxGroup = Checkbox.Group;
const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 15,
  },
};

const UserModal = ({
    modalVisible, handleCancel, handleAdd,
    currentItem, form, userRoles, handleUpdate,
  }) => {
  // 不允许选择超级管理员，所以过滤掉超级管理员
  const validRoles = userRoles.filter(role => role.label !== '超级管理员');
  const { getFieldDecorator, validateFields, resetFields } = form;
  const onOk = () => {
    if (currentItem.userName) {
      validateFields(['realName', 'userName',
        'cellphone', 'roles'], (errors, values) => {
        if (errors) {
          return;
        }
        handleUpdate(currentItem._id, values);
      });
    } else {
      validateFields((errors, values) => {
        if (errors) {
          return;
        }
        handleAdd(values);
      });
    }
  };
  const checkPasswordConfirm = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('password')) {
      return callback('两次输入的密码不一致');
    }
    callback();
  };
  const afterClose = () => {
    resetFields();
  };
  return (
    <div>
      <Modal
        visible={modalVisible}
        title="编辑用户信息"
        onCancel={handleCancel}
        afterClose={afterClose}
        onOk={onOk}
        okText="保存"
      >
        <div style={{ padding: 20 }}>
          <Form>
            <FormItem
              {...formItemLayout}
              label="姓名"
              hasFeedback
            >
              {getFieldDecorator('realName', {
                initialValue: currentItem.realName,
                rules: [{
                  required: true, message: '请输入姓名',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="账号"
              hasFeedback
            >
              {getFieldDecorator('userName', {
                initialValue: currentItem.userName,
                rules: [{
                  type: 'email', message: '账号为邮箱',
                }, {
                  required: true, message: '请输入账号',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="电话"
              hasFeedback
            >
              {getFieldDecorator('cellphone', {
                initialValue: currentItem.cellphone,
                rules: [{
                  pattern: /^\d{11}$/, message: '请输入正确的电话号码',
                }, {
                  required: true, message: '请输入电话号码',
                }],
              })(
                <Input />,
              )}
            </FormItem>
            {
              !currentItem.userName ?
                <FormItem
                  {...formItemLayout}
                  label="密码"
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
                </FormItem> : null
            }
            {
              !currentItem.userName ?
                <FormItem
                  {...formItemLayout}
                  label="重复密码"
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
                </FormItem> : null
            }
            <FormItem
              {...formItemLayout}
              label="角色"
            >
              {getFieldDecorator('roles', {
                initialValue: currentItem.roles,
                rules: [{
                  required: true, message: '选择一个角色',
                }],
              })(
                <CheckboxGroup
                  options={validRoles}
                />,
              )}
            </FormItem>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

UserModal.propTypes = {
  modalVisible: PropTypes.bool,
  handleCancel: PropTypes.func,
  handleAdd: PropTypes.func,
  currentItem: PropTypes.object,
  form: PropTypes.object,
  userRoles: PropTypes.array,
  handleUpdate: PropTypes.func,
};

export default Form.create()(UserModal);
