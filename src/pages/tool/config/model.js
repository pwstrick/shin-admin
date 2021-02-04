/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2020-12-24 10:46:27
 * @LastEditTime: 2021-02-02 15:02:24
 * @Description: 全局通用配置数据处理
 * @FilePath: /strick/shin-admin/src/pages/tool/config/model.js
 */
import { TEMPLATE_MODEL } from "utils/constants";
import api from "api";

export default {
  namespace: 'toolConfig',
  state: {
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/tool/config') {
          dispatch({
            type: TEMPLATE_MODEL.QUERY,
            payload: {
              url: api.toolConfigQuery
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
