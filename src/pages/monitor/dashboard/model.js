/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-03-12 11:07:43
 * @LastEditTime: 2021-09-06 11:23:22
 * @Description: 前端监控面板服务
 * @FilePath: /strick/shin-admin/src/pages/monitor/dashboard/model.js
 */
import { get } from 'utils/request';
import api from "api";

export default {
  namespace: 'monitorDashboard',
  state: {
    loading: true,
    chartLoading: true,
    dateLoading: false,
    statistic: {},
    chart: {},
    dateStatis: []  //按天读取历史数据
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/monitor/dashboard') {
          dispatch({
            type: 'query',
          });
          dispatch({
            type: 'chart',
          });
          dispatch({
            type: 'clear',
          });
        }
      });
    },
  },
  effects: {
    *query({ payload }, { call, put }) {
      yield put({ type: 'showLoading' });
      const { data } = yield call(get, api.monitorStatistic, payload);
      yield put({
        type: 'querySuccess',
        payload: {
          statistic: data.data
        },
      });
    },
    *chart({ payload }, { call, put }) {
      yield put({ type: 'showChartLoading' });
      const { data } = yield call(get, api.monitorChart, payload);
      yield put({
        type: 'chartSuccess',
        payload: {
          chart: data.data
        },
      });
    },
  },
  reducers: {
    clear(state) {
      return {
        ...state,
        dateStatis: []
      }
    },
    setDateStatis(state, { payload }) {
      return {
        ...state,
        dateStatis: payload.list,
      };
    },
    querySuccess(state, { payload }) {
      return {
        ...state,
        loading: false,    //取消Loading
        statistic: payload.statistic,
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
