/*
 * @Author: strick
 * @Date: 2020-12-13 14:59:11
 * @LastEditTime: 2021-02-02 10:22:41
 * @LastEditors: strick
 * @Description: 客户端用户管理
 * @FilePath: /strick/shin-admin/src/services/appuser.js
 */
import request from '../utils/request';

/**
 * 查询 appuser 详情
 */
export async function getAppuserDetail(params) {
  return request(`/api/appuser/detail`, { params });
}
