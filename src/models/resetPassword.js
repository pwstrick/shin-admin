/*
 * @Author: strick
 * @Date: 2020-12-13 14:51:51
 * @LastEditTime: 2021-02-03 18:00:01
 * @LastEditors: strick
 * @Description: 密码处理
 * @FilePath: /strick/shin-admin/src/models/resetPassword.js
 */
import { Modal } from 'antd';
import { resetPassword } from 'services/user';
import { success } from 'utils/tools';

export default {
  namespace: 'resetPassword',
  state: {
    visible: false,
    id: '',
    userName: '',
    type: '',
  },
  effects: {
    *resetPassword({ payload }, { call, put }) {
      const { data } = yield call(resetPassword, payload);
      if(!success(data)) {
        return;
      }
      Modal.success({
        title: '修改密码成功',
        content: '请重新登录',
      });
      yield put({
        type: 'resetPasswordSuccess',
      });
    },
  },
  reducers: {
    // 显示对话框
    showModal(state, action) {
      const { type } = action.payload;
      if (type === 'reset') {
        return { visible: true };
      } else if (type === 'forget') {
        const { _id, userName } = action.payload.record;
        return { ...state, visible: true, id: _id, userName };
      }
    },
    // 隐藏对话框
    hideModal(state) {
      return { ...state, visible: false };
    },
    // 修改密码成功
    resetPasswordSuccess(state) {
      return { ...state, visible: false };
    },
  },
};
