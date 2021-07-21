/*
 * @Author: strick
 * @Date: 2020-10-24 15:39:07
 * @LastEditTime: 2021-07-21 15:41:25
 * @LastEditors: strick
 * @Description: umi配置文件
 * @FilePath: /strick/shin-admin/.umirc.js
 */
import routes from './src/routes';
import { join } from 'path';

export default {
  treeShaking: true,
  alias: {
    // '@': join(__dirname, 'src'),
    components: join(__dirname, "./src/components"),
    api: join(__dirname, "./src/api"),
    utils: join(__dirname, "./src/utils"),
    services: join(__dirname, "./src/services"),
    assets: join(__dirname, "./src/assets"),
  },
  routes,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: { webpackChunkName: true },
      title: 'shin-admin',
      dll: true,
      routes: {
        exclude: [
          /models\//,
          /services\//,
          /model\.(t|j)sx?$/,
          /service\.(t|j)sx?$/,
          /components\//,
        ],
      },
    }],
  ],
  //代理请求到shin-server服务器
  proxy: {
    "/api": {
      "target": "http://localhost:6060",
      "changeOrigin": true,
      "pathRewrite": { "^/api" : "" }
    }
  },
}
