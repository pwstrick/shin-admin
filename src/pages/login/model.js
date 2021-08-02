/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-08-02 17:20:05
 * @LastEditors: strick
 * @Description: 登录页面数据处理
 * @FilePath: /strick/shin-admin/src/pages/login/model.js
 */
import { routerRedux } from 'dva';
import { login } from 'services/login';
import config from 'utils/config';
import { message } from 'antd';
import { success } from 'utils/tools';

export default {
  namespace: 'login',
  state: {},
  effects: {
    *login({ payload }, { call, put }) {
      const { data } = yield call(login, payload);
      if(!success(data)) {
        return
      }
      if (data.expireDays) {
        if (data.expireDays > 5) {
          message.info(`密码有效期还剩${data.expireDays}天`);
        } else {
          message.warn(`密码有效期还剩${data.expireDays}天，请及时修改`);
        }
      }
      //将token、权限和环境写入缓存中
      localStorage.setItem(config.token, data.token);
      localStorage.setItem(config.authorities, data.authorities);
      localStorage.setItem(config.nodeEnv, data.nodeEnv);
      const pathname = sessionStorage.getItem("shin_pathname");   //上一页
      // 无上一页就跳转到主页
      if(!pathname) {
        yield put(routerRedux.push('/'));
        return;
      }
      // 跳转到上一页
      yield put(routerRedux.push(pathname));
    },
  },
  reducers: {

  },
};
