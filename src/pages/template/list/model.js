/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 10:59:56
 * @LastEditTime: 2021-07-21 15:52:40
 * @Description: 列表模板数据处理
 * @FilePath: /strick/shin-admin/src/pages/template/list/model.js
 */
/* eslint-disable */
import { apiGet, apiGets, apiHead, apiPost, apiPut } from 'utils/request';
export default {
    namespace: 'templateList',
    state: {
    },
    subscriptions: {
      setup({ dispatch, history }) {
        history.listen((location) => {
          if (location.pathname === '/template/list') {
            // dispatch({
            //   type: 'template/query',
            //   payload: {
            //     url: 'template/query'
            //   }
            // });
            dispatch({
              type: 'demo'
            });
          }
        });
      },
    },
    effects: {
      *callback({ payload }, { call, put }) {
        console.log("callback", payload);
      },
      *demo({ payload }, { call, put }) {
        yield call(apiGet, { table: "WebShortChain", where: { id: 8 } } );
        yield call(apiGets, { table: "WebShortChain", where: { id: 8 }, limit:10, curPage: 2, order: [["id", "ASC"]] } );
        yield call(apiHead, { table: "WebShortChain", where: { id: 8 }, aggregation: "sum", field: "id" } );
        // yield call(apiPost, { table: "WebShortChain", data: { date: 2022,  rank: "abc"} });
        // yield call(apiPut, { table: "WebShortChain", set: { short: "lmn" }, where: { id: 8 } });
      },
    },
    reducers: {
      callbackSuccess(state, { payload }) {
        console.log("callbackSuccess");
        return { ...state };
      },
    },
  };