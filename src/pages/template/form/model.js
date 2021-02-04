/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 10:59:56
 * @LastEditTime: 2021-02-02 13:54:42
 * @Description: 列表模板数据处理
 * @FilePath: /strick/shin-admin/src/pages/template/form/model.js
 */
/* eslint-disable */
export default {
    namespace: 'templateForm',
    state: {
    },
    subscriptions: {
      setup({ dispatch, history }) {
        // history.listen((location) => {
        //   if (location.pathname === '/template/list') {
        //     dispatch({
        //       type: 'template/query',
        //       payload: {
        //         url: 'template/query'
        //       }
        //     });
        //   }
        // });
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