/*
 * @Author: strick
 * @Date: 2020-12-13 14:57:45
 * @LastEditTime: 2021-02-03 17:57:37
 * @LastEditors: strick
 * @Description: 用户处理
 * @FilePath: /strick/shin-admin/src/models/appuser.js
 */
// import { Modal, message } from 'antd';
// import _ from 'lodash';
import { getAppuserDetail } from 'services/appuser';

export default {
  namespace: 'appuser',
  state: {
    quickSearchType: 'userId',
    showUserDetail: false,
    loading: false,
  },
  effects: {
    *quickSearch({ payload }, { put, select }) {
      const { appuser } = yield select();
      yield put({
        type: 'getUserDetail',
        payload: {
          type: appuser.quickSearchType,
          id: payload,
        },
      });
    },
    *getUserDetail({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const res = yield call(getAppuserDetail, payload);
      yield put({
        type: 'getUserDetailSuccess',
        payload: {
          data: res.data,
          zIndex: payload.zIndex || 1000,
        },
      });
    },
  },
  reducers: {
    quickSearchTypeChange(state, { payload }) {
      return {
        ...state,
        quickSearchType: payload,
      };
    },
    getUserDetailSuccess(state, { payload }) {
      let appuser = '';
      if (payload.data.user) {
        appuser = payload.data.user;
      }
      return {
        ...state,
        loading: false,
        currentAppuser: appuser,
      };
    },
    showLoading(state) {
      return {
        ...state,
        loading: true,
      };
    },
  },
};
