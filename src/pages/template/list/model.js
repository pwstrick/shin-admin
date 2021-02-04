/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 10:59:56
 * @LastEditTime: 2021-02-02 13:54:50
 * @Description: 列表模板数据处理
 * @FilePath: /strick/shin-admin/src/pages/template/list/model.js
 */
/* eslint-disable */
export default {
    namespace: 'templateList',
    state: {
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen((location) => {
          if (location.pathname === '/template/form') {
            dispatch({
              type: 'template/query',
              payload: {
                url: 'template/query'
              }
            });
          }
        });
      },
    },
    effects: {
      *callback({ payload }, { call, put }) {
        console.log("callback", payload);
      },
    },
    reducers: {
      callbackSuccess(state, { payload }) {
        console.log("callbackSuccess");
        return { ...state };
      },
    },
  };