/*
 * @Author: strick
 * @Date: 2021-02-25 15:54:26
 * @LastEditTime: 2021-09-06 11:23:43
 * @LastEditors: strick
 * @Description: 监控日志数据服务
 * @FilePath: /strick/shin-admin/src/pages/monitor/log/model.js
 */
import { get } from 'utils/request';
import api from "api";
const defaultState = {
  prevId: 0,
  nextId: 0,
  loading: false,
  contextList: [],  //上下文中的列表
  keyword: "",    //关键字
  match: 1,   //检索方式
  chartListStatis: {},  //图表数据
};
export default {
  namespace: 'monitorList',
  state: {
    ...defaultState
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitor/log') {
          dispatch({
            type: 'clear',
          });
        }
      });
    },
  },
  effects: {
    *chart({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(get, api.monitorListChart, payload);
      yield put({
        type: 'chartSuccess',
        payload: {
          data,
        },
      });
    },
    *context({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(get, api.monitorContext, payload);
      yield put({
        type: 'contextSuccess',
        payload: {
          data,
          ...payload
        },
      });
    },
  },
  reducers: {
    contextSuccess(state, { payload }) {
      let { data, nextId, prevId } = payload;
      let contextList = [];
      if(prevId) {  //向上取
        contextList = [...data.data, ...state.contextList];
        nextId = state.nextId;
      }else if(nextId) {  //向下取
        contextList = [...state.contextList, ...data.data];
        prevId = state.prevId;
      }
      return {
        ...state,
        loading: false,    //取消Loading
        contextList: contextList,
        prevId: prevId,
        nextId: nextId,
      };
    },
    initContext(state, { payload }) {
      return {
        ...state,
        contextList: payload.record,
        prevId: payload.prevId,
        nextId: payload.nextId
      };
    },
    chartSuccess(state, { payload }) {
      return {
        ...state,
        loading: false,
        chartListStatis: payload.data.data
      };
    },
    showLoading(state) {
      return {
        ...state,
        loading: true
      };
    },
    hideLoading(state) {
      return {
        ...state,
        loading: false
      };
    },
    // 清空参数
    clear() {
      return {
        ...defaultState
      };
    },
    // 清空图表
    clearChart(state) {
      return {
        ...state,
        chartListStatis: {}
      };
    },
    // 定义关键字，用于着色
    setKeyword(state, { payload }) {
      return {
        ...state,
        keyword: payload.msg,
        chartListStatis: payload.chartListStatis
      };
    },
    // 定义检索模式
    setMatch(state, { payload }) {
      return {
        ...state,
        match: payload.match
      };
    }
  },
};
