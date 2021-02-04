/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-02-02 13:57:29
 * @LastEditors: strick
 * @Description: 登录页面交互处理
 * @FilePath: /strick/shin-admin/src/pages/login/index.js
 */
import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon } from 'antd';
import logo from 'assets/logo.png';
import styles from './login.less';
const { Password } = Input;
const FormItem = Form.Item;
const Login = ({ dispatch, form }) => {
  const {
    getFieldDecorator,
    validateFieldsAndScroll,
  } = form;
  // 登录
  function handleLogin(e) {
    e.preventDefault();
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      dispatch({
        type: 'login/login',
        payload: {
          __userName__: values.userName,
          __password__: values.password,
        },
      });
    });
  }

  return (
    <div className={styles.loginForm}>
      <div className={styles.title}>
        <img src={logo} alt="logo" />
      </div>
      <Form onSubmit={handleLogin} >
        <FormItem>
          {getFieldDecorator('userName', {
            rules: [{ required: true, message: '请输入用户名' }],
          })(
            <Input
              placeholder="用户名"
              prefix={<Icon type="user" />}
              size="large"
            />,
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [
              { required: true, message: '请输入密码' },
            ],
          })(
            <Password
              placeholder="密码"
              prefix={<Icon type="lock" />}
              size="large"
            />,
          )}
        </FormItem>
        <FormItem>
          <Button
            type="primary"
            className={styles.loginButton}
            size="large"
            htmlType="submit"
            onClick={handleLogin}
          >登录</Button>
        </FormItem>
      </Form>
    </div>
  );
}

export default connect(data => data.login)(Form.create()(Login));
