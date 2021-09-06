/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2020-12-24 10:46:27
 * @LastEditTime: 2021-09-06 11:25:22
 * @Description: 
 * @FilePath: /strick/shin-admin/src/pages/monitor/project/model.js
 */
// import _ from 'lodash';
// import {
//   createConfig,
//   getConfigList
// } from 'services/tool';
// import { success } from "utils/tools";
import { TEMPLATE_MODEL } from "utils/constants";
import api from "api";

export default {
  namespace: 'monitorProject',
  state: {
    // visible: false,
    // record: {},
    // dataSource: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitor/performance/project') {
          dispatch({
            type: TEMPLATE_MODEL.QUERY,
            payload: {
              url: api.monitorPerformanceProjectList
            }
          });
        }
      });
    },
  },
  effects: {
    // *create({ payload }, { call, put }) {
    //   const { data } = yield call(createConfig, payload);
    //   if(!success(data)) {
    //     return;
    //   }
    //   yield put({
    //     type: 'createSuccess',
    //     payload: data.data,
    //   });
    // },
    // *getList({ payload }, { call, put }) {
    //   const { data } = yield call(getConfigList);
    //   yield put({
    //     type: 'getListSuccess',
    //     payload: data.list,
    //   });
    // },
  },
  reducers: {
    // show(state) {
    //   return { ...state, visible: true };
    // },
    // hide(state) {
    //   return { ...state, visible: false, record: {} };
    // },
    // edit(state, { payload }) {
    //   return { ...state, visible: true, record: payload };
    // },
    // createSuccess(state, { payload }) {
    //   const dataSource = _.cloneDeep(state.dataSource);
    //   if(!("nModified" in payload)) {  //创建操作
    //     dataSource.push(payload);
    //   }
    //   return { ...state, dataSource, visible: false, record: {} };
    // },
    // getListSuccess(state, { payload }) {
    //   return { ...state, dataSource: payload };
    // },
  },
};
