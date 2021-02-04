/*
 * @Author: strick
 * @Date: 2020-10-24 15:39:07
 * @LastEditTime: 2021-02-02 19:21:36
 * @LastEditors: strick
 * @Description: 运行时配置，全局处理状态码
 * @FilePath: /strick/shin-admin/src/app.js
 */
import { Modal, message } from 'antd';

export const dva = {
  config: {
    onError(error) {
      if (error.status) {
        switch (error.status) {
          case 401:
            window.location = '/login';
            break;
          case 403:
            message.error('403 : 没有权限');
            break;
          case 404:
            message.error('404 : 对象不存在');
            break;
          case 409:
            message.error('409 : 服务升级，请重新登录');
            break;
          case 504:
            message.error('504 : 网络有点问题');
            break;
          default:
            Modal.error({ content: `${error.status} : ${error.response.data.error}` });
        }
      } else {
        Modal.error({ content: error.message });
      }
    },
  },
};

