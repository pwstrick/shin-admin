/*
 * @Author: strick
 * @Date: 2021-01-19 11:11:34
 * @LastEditTime: 2021-02-02 15:01:37
 * @LastEditors: strick
 * @Description: 短链数据处理
 * @FilePath: /strick/shin-admin/src/pages/tool/shortChain/model.js
 */
import { TEMPLATE_MODEL } from "utils/constants";
import api from "api";

export default {
  namespace: 'ShortChain',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tool/shortChain') {
          dispatch({
            type: TEMPLATE_MODEL.QUERY,
            payload: {
              url: api.shortChainQuery
            }
          });
        }
      });
    },
  },
  effects: {
  },
  reducers: {
  },
};