<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/logo.png" width="300"/>
</p>

&emsp;&emsp;shin 的读音是[ʃɪn]，谐音就是行，寓意可行的后台管理系统，它的特点是：

* 站在巨人的肩膀上，依托[Umi 2](https://v2.umijs.org/zh/)、[Dva 2](https://dvajs.com/)、[Ant Design 3](https://3x.ant.design/index-cn)和[React 16.8](https://zh-hans.reactjs.org/)搭建的定制化后台。
* 介于半成品和成品之间，有很强的可塑性，短期内你就能把控全局。
* 借助模板组件可快速交付90%以上的页面。
* 多样的权限粒度，大到菜单，小到接口。
* 容易扩展，例如引入统计用的图表或富文本编辑器等。

&emsp;&emsp;当然它还有一些不友好的地方：

* 大流程绝对能跑起来，但仍潜伏着很多细节BUG有待解决。
* 有一定的学习成本，需要学习Umi配置，Dva数据流方案，Ant Design组件以及React语法等。

# 准备工作
#### 1）安装
&emsp;&emsp;在将项目下载下来后，来到其根目录，运行安装命令，自动将依赖包下载到本地。
```bash
$ npm install
```

#### 2）启动
&emsp;&emsp;启动开发服务器，默认会进入登录页（下图），由于会调用本地的Mock数据，所以即使没有后端服务器，项目也能运行。若要与后端配合，可参考 [shin-server](https://github.com/pwstrick/shin-server)。
```bash
$ npm start
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/login.png" width="300"/>
</p>

&emsp;&emsp;用户名密码可以随意输入，提交后进入系统主页，目前是空白的，可自定义。

![主页](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/main.png)

#### 3）构建
&emsp;&emsp;在开发完成后调用构建命令，可自动生成dist目录，将该目录上传到服务器上用于部署。
```bash
$ npm run build
```
&emsp;&emsp;在 package.json 的 scripts 字段中，还提供了其他命令，例如 lint、test 等。

#### 4）运行流程
&emsp;&emsp;管理系统运行的大致流程，如下图所示，其中账号的登录态认证，基于[JWT的方式](https://jwt.io/)。
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/shin.png" width="600"/>
</p>

# 目录
```
├── shin-admin
│   ├── docs ----------------------------------- 说明文档
│   ├── mock ----------------------------------- MOCK 数据
│   ├── src ------------------------------------ 源码
│   ├───└─── api ------------------------------- 接口API声明
│   ├───└─── assets ---------------------------- 静态资源
│   ├───└─── components ------------------------ 全局通用组件
│   └───└────└──── Common ---------------------- 功能组件
│   └───└────└──── Layout ---------------------- 结构组件
│   └───└──── layouts -------------------------- 页面整体结构
│   └───└──── models --------------------------- 全局 model（数据处理）
│   └───└──── pages ---------------------------- 页面
│   └───└────└──── path ------------------------ 页面路径（任意名称）
│   └───└────└────└──── index.js --------------- 视图逻辑
│   └───└────└────└──── model.js --------------- 页面 model
│   └───└──── services ------------------------- 与后端通信的服务（可选）
│   └───└──── utils ---------------------------- 各类工具辅助代码
│   └───└──── app.js --------------------------- 运行时配置，处理40X状态码
│   └───└──── routes.js ------------------------ 路由
│   └───└──── authority.js --------------------- 权限
│   └───└──── global.less ---------------------- 全局样式
│   ├── .env ----------------------------------- 环境变量
│   ├── .umirc.js ------------------------------ umi 配置
│   ├── package.json --------------------------- 命令和依赖包
```
#### 1）api
&emsp;&emsp;api目录下可包含多个文件，默认只有一个 index.js，声明了与后端通信的 API 地址，例如。
```javascript
export default {
  templateCreate: "template/create",    //模板示例中的创建和编辑
  templateQuery: "template/query",      //模板示例中的查询
  templateHandle: "template/handle",    //模板示例中的数据处理
}
```

#### 2）components
&emsp;&emsp;功能组件包括重置密码、拖动列表、上传按钮和模板组件，具体用法可[参考此处](https://github.com/pwstrick/shin-admin/blob/main/docs/template.md)。

&emsp;&emsp;结构组件包括顶部导航、侧边菜单栏、面包屑导航和快速搜索，在上面的主页图中已体现。

#### 3）models
&emsp;&emsp;model 文件是 [Dva](https://v2.umijs.org/zh/guide/with-dva.html#model-%E6%B3%A8%E5%86%8C) 中的概念，用于处理组件中的数据（下面是数据流向图），典型事例[参考此处](https://dvajs.com/api/#model)。
```javascript
app.model({
  namespace: 'app',  //命名空间，同时也是他在全局 state 上的属性
  state: {},         //初始值
  //处理同步操作，唯一可以修改 state 的地方，由 action 触发
  reducers: {
    add(state, { payload: todo }) {
      return [...state, todo];  // 保存数据到 state
    },
  },
  //处理异步操作和业务逻辑（和服务器交互），不直接修改 state，由 action 触发
  effects: {
    *save({ payload: todo }, { put, call }) {
      // 调用 saveTodoToServer，成功后触发 `add` action 保存到 state
      yield call(saveTodoToServer, todo);
      yield put({ type: 'add', payload: todo });
    },
  },
  //用于订阅一个数据源，然后根据需要 dispatch 相应的 action
  subscriptions: {
    setup({ history, dispatch }) {
      // 监听 history 变化，当进入 `/` 时触发 `load` action
      return history.listen(({ pathname }) => {
        if (pathname === '/') {
          dispatch({ type: 'load' });
        }
      });
    },
  },
});
```
![dva](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/dva.png)

#### 4）pages
&emsp;&emsp;所有页面的逻辑都放在此目录下，例如访问 http://localhost:8000/template/list ，那么就需要先创建 template 目录，然后创建其子目录 list，即路径为 pages/template/list。

&emsp;&emsp;在子目录中会包含 index.js 和 model.js，偶尔也会创建 less 样式文件。

&emsp;&emsp;由于采用了 Dva 数据流方案，因此在 index.js 中就不能直接修改内部状态（state），只能 dispatch 相应的 action，然后在 model.js 文件中更新状态。

&emsp;&emsp;下面是 index.js 的一个示例，App 组件中的 id 参数是 model 文件中的状态，dispatch()函数是Dva的库函数，用于触发 action。

&emsp;&emsp;底部的 connect() 函数用于连接 model 和 component。app 是 model.js 文件中的命名空间，App 是组件名称。
```javascript
import React from 'react';
import { connect } from 'dva';
import { Button } from 'antd';
const App = ({ id, dispatch }) => {
  const onCreate = () => {
    dispatch({
      type: 'app/save',
      payload: {
        id
      },
    });
  };
  return <Button type="primary" onClick={onCreate}>新建</Button>;
};
export default connect(data => data.app)(App);
```

#### 5）services
&emsp;&emsp;用来与后端通信，但在使用过程中发现经常只是做一层中转，内部并没有很多特定的逻辑，例如下面的登录函数。

&emsp;&emsp;其实就是声明一个请求地址，要传递的数据以及请求方法。
```javascript
import request from '../utils/request';
export async function login(data) {
  return request('/api/user/login', {
    method: 'POST',
    data,
  });
}
```
&emsp;&emsp;完全可以提炼出来，直接在 model.js 文件中直接发起请求，例如先在 api 处声明好地址（代码中的 url 参数），redirect、get 和 post 是封装的三种请求方式。
```javascript
import { redirect, get, post } from 'utils/request';
export default {
    namespace: 'template',
    state: {},
    effects: {
      //查询
      *query({ payload }, { call, put }) {
        const { url, params } = payload;
        const { data } = yield call(get, url, params);
      },
      //Excel导出
      *export({ payload }, { call, put }) {
        yield call(redirect, payload.url, payload.params);
      },
      //处理数据，增删改
      *handle({ payload }, { call, put, select }) {
        const { url, params } = payload;
        const { data } = yield call(post, url, params);
      },
    },
  };
```

#### 6）其余
&emsp;&emsp;utils 目录中的文件如下：
* config.js：全局配置参数
* constants.js：全局常量
* menu.js：菜单处理
* request.js：基于 [axios](https://github.com/axios/axios) 封装的通信库
* tools.js：杂七杂八的工具函数

&emsp;&emsp;app.js 在处理各种异常响应时会给出不同的提示，在401时会跳转到登录页。
```javascript
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
```
&emsp;&emsp;routes.js会声明组件和路由之间的映射关系，其实 pages 目录下的各个页面就是一个个的组件。
```javascript
module.exports = [
  {
    path: '/',
    component: '../layouts/index',    //component 相对于 src/pages 目录
    routes: [
      { path: '/', component: 'index' },
      { path: '/login', component: 'login/', exact: true },
      { path: '/template/list', component: 'template/list/', exact: true },
      { path: '/*', component: '404', exact: true },
    ]
  }
];
```
&emsp;&emsp;authority.js 中的权限会形成一棵树形结构，当 type 为 1 时，会在左侧菜单栏中展示，为 2 时就仅做一个接口权限。
```javascript
/**
 * 权限列表
 * @param id      {string} 权限id
 * @param pid     {string} 父级权限id
 * @param status  {number} 是否开启 1 开启 2 关闭
 * @param type    {string} 权限类型 1 菜单 2 接口
 * @param name    {string} 权限名称
 * @param desc    {string} 权限描述
 * @param routers {string} 权限相关路由
 * @param icon    {string} 菜单图标
 */
export default [
    {
      id: 'backend',
      pid: '',
      status: 1,
      type: 1,
      name: '管理后台',
      desc: '',
      routers: '/',
      icon: 'desktop',
    },
    {
      id: 'backend.template',
      pid: 'backend',
      status: 1,
      type: 1,
      name: '全局模板',
      desc: '',
      routers: '/template',
      icon: 'file-text',
    },
    {
      id: 'backend.template.list',
      pid: 'backend.template',
      status: 1,
      type: 1,
      name: '列表模板',
      desc: '',
      routers: '/template/list',
    }
]
```
&emsp;&emsp;在 .umirc.js 中可引入路由信息，配置路径别名，开启代理服务器。

&emsp;&emsp;当配置了路由别名时，就不需要写相对路径了，但是无法使用IDE工具的代码导航了。
```javascript
import request from 'utils/request';
```

# 搭建
#### 1）常规流程
&emsp;&emsp;在 pages 下的 login 和 user 两个目录中，采用了常规的搭建流程。
* 在 index.js 文件中编写视图的各类逻辑，将几个特定组件抽象到当前的 components 子目录中。
* 在 model.js 文件中处理各类组件状态，并且引用 serveices 中声明的函数。

&emsp;&emsp;其实很多后台页面所需的状态和几个特定组件都差不多，例如过滤条件、列表、模态窗口等，没必要每次写页面都重新声明一下。

&emsp;&emsp;在此背景下，提炼出了通用的模板组件（[用法文档](https://github.com/pwstrick/shin-admin/blob/main/docs/template.md)），位于 components/Common 的 Template 和 Upload 两个目录中，效果如下图所示。
![列表模板](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/1.png)
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/3.png" width="500"/>
</p>

#### 2）高速流程
&emsp;&emsp;模板组件就是将一些页面交互和数据处理封装起来，调用的时候只需要定义各类参数，就能快速搭建出一套完整的逻辑，并且能大大减少BUG数量。

&emsp;&emsp;以往搭建下面这样的一张页面（包括列表、分页、创建、查询、模态窗口等部分），熟练的话也得两三个小时以上，而采用模板组件的话，最多半小时就能完成。
![短链服务](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/2.png)

&emsp;&emsp;在 template 目录中演示了三种类型的模板页面：列表、表单和照片墙。

&emsp;&emsp;在 tool 目录中完成了对模板组件的实践。

# 其他
#### 1）MOCK数据
&emsp;&emsp;Umi 框架安装了第三方的[Mock.js](http://mockjs.com/)模拟请求数据甚至逻辑，能够让前端开发独立自主，不会被服务端的开发所阻塞。

&emsp;&emsp;若要关闭，只要在 .env 文件中添加 MOCK=none 或者在 start 命令中将其添加即可。
```bash
MOCK=none umi dev
```

#### 2）ESLint
&emsp;&emsp;在 .eslintrc 中修改默认的配置，无法生效，无奈只能在某个文件顶部显式地声明，以此规避ESLint默认的规则。
```javascript
/* eslint-disable */
```