/*
 * @Author: strick
 * @Date: 2020-10-25 15:35:54
 * @LastEditTime: 2021-09-06 11:19:13
 * @LastEditors: strick
 * @Description: 路由配置
 * @FilePath: /strick/shin-admin/src/routes.js
 */
module.exports = [
  {
    path: '/',
    component: '../layouts/index',    //component 相对于 src/pages 目录
    routes: [
      { path: '/', component: 'index' },
      { path: '/login', component: 'login/', exact: true },
      { path: '/user/account', component: 'user/account/', exact: true },
      { path: '/user/role', component: 'user/role/', exact: true },
      { path: '/template/list', component: 'template/list/', exact: true },
      { path: '/template/form', component: 'template/form/', exact: true },
      { path: '/template/photo', component: 'template/photo/', exact: true },
      { path: '/tool/config', component: 'tool/config/', exact: true },
      { path: '/tool/shortChain', component: 'tool/shortChain/', exact: true },
      { path: '/monitor/dashboard', component: 'monitor/dashboard/', exact: true },  
      { path: '/monitor/log', component: 'monitor/log/', exact: true },  
      { path: '/monitor/performance/dashboard', component: 'monitor/pedashboard/', exact: true },  
      { path: '/monitor/performance/project', component: 'monitor/project/', exact: true },
      { path: '/*', component: '404', exact: true },
    ]
  }
];