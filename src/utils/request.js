/*
 * @Author: strick
 * @Date: 2020-12-11 13:29:06
 * @LastEditTime: 2021-07-21 15:36:39
 * @LastEditors: strick
 * @Description: 封装的通信库
 * @FilePath: /strick/shin-admin/src/utils/request.js
 */
import fetch from 'axios';
import config from 'utils/config';
import qs from 'query-string';
import api from '../api/';

function handleError(errorObj) {
  const { response } = errorObj;
  if (!response) {
    const error = new Error('你的网络有点问题');
    error.response = errorObj;
    error.status = 504;
    throw error;
  }
  const error = new Error(response.statusText);
  error.response = response;
  error.status = response.status;
  throw error;
}

function showLoading() {
  global.loading = true;
}

function hideLoading() {
  global.loading = false;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data"
 */
export default function request(url, options) {
  showLoading();
  //拼接JWT字符串
  const AUTH_TOKEN = `Bearer ${localStorage.getItem(config.token)}`;
  fetch.defaults.headers.common.Authorization = AUTH_TOKEN;
  return fetch(url, options)
    .catch(handleError)
    .then((response) => {
      hideLoading();
      return { data: response.data };
    });
}

/**
 * GET请求
 */
export async function get(url, params) {
  return request(`/api/${url}`, { params });
}
/**
 * POST请求
 */
export async function post(url, data) {
  return request(`/api/${url}`, {
    method: 'POST',
    data,
  });
}
/**
 * 跳转，常用于Excel导出
 */
export async function redirect(url, params) {
  window.location.href = `/api/${url}?${qs.stringify(params)}`;
}

/**
 * 配置通用接口的主参数
 */
function setTable(table, data) {
  let params = {};
  if(table) {
    params = {
      [table]: data
    }
  }
  return params;
}
/**
 * 通用get
 * table是服务器model文件的名称，并非数据库表名
 */
export async function apiGet({ table, where={} }) {
  const params = setTable(table, where);
  return request(`/api/${api.get}`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 通用gets
 */
export async function apiGets({ table, where={}, limit, order, curPage }) {
  const params = setTable(table, where);
  return request(`/api/${api.gets}`, {
    method: 'POST',
    data: {
      ...params,
      limit, order, curPage
    },
  });
}
/**
 * 通用head
 */
export async function apiHead({ table, where={}, aggregation, field }) {
  const params = setTable(table, where);
  return request(`/api/${api.head}`, {
    method: 'POST',
    data: {
      ...params,
      aggregation, field
    },
  });
}
/**
 * 通用post
 */
export async function apiPost({ table, data={} }) {
  const params = setTable(table, data);
  return request(`/api/${api.post}`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 通用put
 */
export async function apiPut({ table, set={}, where={} }) {
  const params = setTable(table, where);
  return request(`/api/${api.put}`, {
    method: 'POST',
    data: {
      ...params,
      set
    },
  });
}