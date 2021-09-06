/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-03-23 13:18:03
 * @LastEditTime: 2021-09-06 11:44:00
 * @Description: 
 * @FilePath: /strick/shin-admin/src/pages/monitor/pedashboard/model.js
 */
import { get } from 'utils/request';
import api from "api";

const defaultState = {
  loading: true,
  chart: {},
  chartLoading: true,
  statistic: [],
  projectList: [],
  performanceList: []
};

export default {
  namespace: 'monitorPeDashboard',
  state: {
    ...defaultState
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitor/performance/dashboard') {
          dispatch({
            type: 'clear',
          });
          dispatch({
            type: 'getProjectList',
          });
        }
      });
    },
  },
  effects: {
    *getProjectList({ payload }, { call, put }) {
      const { data } = yield call(get, api.monitorPerformanceProjectList, payload);
      yield put({
        type: 'getProjectListSuccess',
        payload: {
          projectList: data.data
        },
      });
    },
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(get, api.monitorPerformanceStatistic, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          statistic: data.data
        },
      });
    },
    *chart({ payload }, { call, put }) {
      yield put({ type: 'showChartLoading' });
      const { data } = yield call(get, api.monitorPerformanceChart, payload);
      yield put({
        type: 'chartSuccess',
        payload: {
          chart: data.data
        },
      });
    },
  },
  reducers: {
    // 清空参数
    clear() {
      return {
        ...defaultState
      };
    },
    querySuccess(state, { payload }) {
      return {
        ...state,
        loading: false,    //取消Loading
        statistic: payload.statistic,
        performanceList: []
      };
    },
    getProjectListSuccess(state, { payload }) {
      return {
        ...state,
        projectList: payload.projectList,
      };
    },
    getPerformanceListSuccess(state, { payload }) {
      return {
        ...state,
        performanceList: payload.performanceList.filter(value => value !== 0),
      };
    },
    chartSuccess(state, { payload }) {
      return {
        ...state,
        chartLoading: false,    //取消Loading
        chart: payload.chart,
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
    showChartLoading(state) {
      return {
        ...state,
        chartLoading: true
      };
    },
    hideChartLoading(state) {
      return {
        ...state,
        chartLoading: false
      };
    },
  },
};
