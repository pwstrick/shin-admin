/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-08-02 17:23:52
 * @LastEditors: strick
 * @Description: 后台通用功能处理
 * @FilePath: /strick/shin-admin/src/models/app.js
 */
import { getUser, logout } from 'services/user';
import { routerRedux } from 'dva';
import config from '../utils/config';

export default {
  namespace: 'app',
  state: {
    siderFold: localStorage.getItem(`${config.prefix}siderFold`) === 'true',
    user: {},
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname !== '/login') {
          sessionStorage.setItem('shin_pathname', location.pathname);   //缓存上一页路径
          dispatch({
            type: 'query',
          });
        }
      });
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      const { data } = yield call(getUser);
      yield put({
        type: 'querySuccess',
        payload: data,
      });
    },
    *logout({ payload }, { call, put }) {
      const { data } = yield call(logout);
      if (data.code === 0) {
        localStorage.removeItem(`${config.prefix}token`);
        localStorage.removeItem('authorities');
        localStorage.removeItem('nodeEnv');
        yield put(routerRedux.push('/login'));
      }
    },
  },
  reducers: {
    switchSider(state) {
      localStorage.setItem(`${config.prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      };
    },
    querySuccess(state, { payload: user }) {
      return {
        ...state,
        user,
      };
    },
  },
};
