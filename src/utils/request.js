/*
 * @Author: strick
 * @Date: 2020-12-11 13:29:06
 * @LastEditTime: 2021-02-02 19:22:38
 * @LastEditors: strick
 * @Description: 封装的通信库
 * @FilePath: /strick/shin-admin/src/utils/request.js
 */
import fetch from 'axios';
import config from 'utils/config';
import qs from 'query-string';

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