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
* 有一定的学习成本，需要学习Umi配置，Dva数据流方案，Ant Design组件以及React、ES6+等语法。

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
└───└── package.json --------------------------- 命令和依赖包
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

#### 6）utils
&emsp;&emsp;utils 目录中的文件如下：
* config.js：全局配置参数
* constants.js：全局常量
* menu.js：菜单处理
* request.js：基于 [axios](https://github.com/axios/axios) 封装的通信库
* tools.js：杂七杂八的工具函数

#### 7）app.js
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

#### 8）routes.js
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

#### 9）authority.js
&emsp;&emsp;authority.js 中的权限会形成一棵树形结构，当 type 为 1 时，会在左侧菜单栏中展示，为 2 时就仅做一个接口权限。图标的选择可[参考此处](https://3x.ant.design/components/icon-cn/)。
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

#### 10）.umirc.js
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

&emsp;&emsp;其实很多后台页面所需的状态（例如Loading、列表、数量等）和几个特定组件都差不多，例如过滤条件、列表、模态窗口等，没必要每次写页面都重新声明一下。

&emsp;&emsp;在此背景下，提炼出了通用的模板组件（[用法文档](https://github.com/pwstrick/shin-admin/blob/main/docs/template.md)），位于 components/Common 的 Template 和 Upload 两个目录中，效果如下面两张图所示。
![列表模板](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/1.png)
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/3.png" width="500"/>
</p>

#### 2）高速流程
&emsp;&emsp;模板组件（[用法文档](https://github.com/pwstrick/shin-admin/blob/main/docs/template.md)）就是将一些页面交互和数据处理封装起来，调用的时候只需要定义各类参数，就能快速搭建出一套完整的逻辑，并且能大大减少BUG数量。

&emsp;&emsp;以往搭建下面这样的一张页面（包括列表、分页、创建、查询、模态窗口等部分），熟练的话也得两三个小时以上，而采用模板组件的话，最多半小时就能完成。
![短链服务](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/2.png)

&emsp;&emsp;在 template 目录中演示了三种类型的模板页面：列表、表单和照片墙。

&emsp;&emsp;在 tool 目录中完成了对模板组件的实践。

#### 3）开发步骤
1. 在 [pages](#4pages) 目录中创建页面模块，分别新建 index.js 和 model.js。
2. 在 [api](#1api) 目录中声明路由或在 [services](#5services) 目录中创建通信服务。
3. 如果需要新增菜单栏，得需要三步走。
    * 在 src 目录的 [routes.js](#8routesjs) 路由文件中声明路径。保证 path 唯一性，component以 ”/“ 结尾，默认取该文件夹下 index.js。
    * 在 src 目录的 [authority.js](#9authorityjs) 文件中配置权限列表项，routes 属性的值对应上面的 component 属性， id 会与后端权限中间件调用的关键字保持一致。
    * 在用户管理 -》 角色管理 -》角色列表中，为当前角色增加该菜单的访问权限，然后退出登录重进。
4. 重启项目。

#### 4）通用接口
&emsp;&emsp;由于后台管理系统大部分的操作都是增删改查（数据库基于 MySQL，ORM 基于 Sequelize），所以可以抽象出一套这类的通用接口，从而就能避免在 Router 和 Service 两层中新增不必要的文件。

* api/get：读取一条数据（单表查询）
* api/gets：读取多条数据（单表查询）
* api/head：读取聚合数据，例如count()、sum()、max() 和 min()
* api/post：提交数据，用于增加记录
* api/put：更新数据

&emsp;&emsp;由于接口的参数是一个JSON格式的对象，因此全部采用post的请求方式，以 api/get 为例，它的参数是：
```javascript
{
   TableName : { 查询条件 }
}
```
&emsp;&emsp;其中 TableName 是服务端中Model的文件名（并非数据库中的表名），对象中的字段都是SQL的查询条件（语法参照 Sequelize）。

&emsp;&emsp;已将这些请求封装在 utils/request.js 文件中，可直接导入至需要的位置，例如 apiGet()、apiPost() 等。

&emsp;&emsp;在 pages/template/list/model.js 中，演示了上述方法的使用 demo，以及需要传递的参数。

# 监控系统
&emsp;&emsp;前端监控地基本目的：了解当前项目实际使用的情况，有哪些异常，在追踪到后，对其进行分析，并提供合适的解决方案。

#### 1）SDK
&emsp;&emsp;[SDK](https://www.cnblogs.com/strick/p/14574492.html)（采用ES5语法）取名为 shin.js，其作用就是将数据通过 JavaScript 采集起来，统一发送到后台，采集的方式包括监听或劫持原始方法，获取需要上报的数据，并通过 gif 传递数据。

&emsp;&emsp;整个系统大致的运行流程如下：

![监控架构](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/1.png)

&emsp;&emsp;监控的内容包括：

* 异常，包括运行时错误、通信错误（502、504等）、框架错误（Vue和React）、[页面白屏](https://www.cnblogs.com/strick/p/14986378.html)等。
* 行为，包括用户行为、浏览器行为、控制台打印等。
* [小程序](https://www.cnblogs.com/strick/p/14850757.html)，包括通信和错误。
* 其他，环境信息，身份标识。

&emsp;&emsp;可配置的参数包括：

* toekn：监控项目的唯一标识（必填）
* subdir：一个项目下的子目录
* src：监控数据的接收地址
* isDebug：默认是非调试环境，而在调试中时，将不会重写 console.log
* isCrash：是否监控页面奔溃
* validateCrash：自定义奔溃规则函数，例如页面白屏判断的条件，返回值包括 {success: true, prompt:'提示'}
* psrc：性能数据的接收地址
* pkey：性能监控的项目key，在性能项目页面创建
* rate：随机采样率，用于性能搜集，取值范围1~10
* setFirstScreen：自定义首屏时间函数

```javascript
shin.setParam({
  token: "shin-app",
  src: "//127.0.0.1:8000/api/ma.gif",
  isDebug: false,
  psrc: "//127.0.0.1:8000/api/pe.gif",
  pkey: "fa768d7dbb2505c6",
  rate: 10,
  setFirstScreen: function () {
    this.firstScreen = _calcCurrentTime();
  },
  isCrash: true,
  validateCrash: () => {
    return {
      success: document.getElementById("root").innerHTML.length > 0,
      prompt: "页面出现空白"
    };
  },
  subdir: "operate"
});
```

#### 2）存储和分析
&emsp;&emsp;监控日志目前只存储在MySQL中，但当数据量很大时，MySQL难以关键字查询，此时可将日志同步至ElasticSearch中。

&emsp;&emsp;具体的存储和分析的说明可[参考此处](https://www.cnblogs.com/strick/p/14577054.html)，服务端代码参考 [shin-server](https://github.com/pwstrick/shin-server)。

&emsp;&emsp;在监控看板中包含今日数据和往期趋势折线图，今日数据有今日和昨日的日志总数、错误总数和影响人数，通信、事件、打印和跳转等总数。

![监控看板](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/2.png)

![监控折线图](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/3.png)

&emsp;&emsp;在日志列表中会包含几个过滤条件：编号、关键字、日期范围、项目、日志类型和身份标识等。

![监控查询条件](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/4.png)

&emsp;&emsp;在实际使用时，又发现缺张能直观展示峰值的图表，例如我想知道在哪个时间段某个特定错误的数量最多，于是又加了个按钮和柱状图，支持跨天计算。

![监控峰值柱状图](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/5.png)

&emsp;&emsp;身份标识可以查询到某个用户的一系列操作，更容易锁定错误发生时的情境。

&emsp;&emsp;每次查询列表时，在后台就会通过Source Map文件映射位置，注意，必须得有列号才能还原，并且需要安装 [source-map](https://www.npmjs.com/package/source-map) 库。

![监控源码](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/6.png)

&emsp;&emsp;每天的凌晨4点，统计昨天的日志信息，还有个定时任务会在每天的凌晨3点，将一周前的数据清除，并将三周前的 map 文件删除。

#### 3）性能监控
&emsp;&emsp;[性能监控系统](https://www.cnblogs.com/strick/p/14578711.html)，用于分析线上的活动，要扎扎实实的提升用户体验。整个系统大致的运行流程如下：

![性能架构](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/7.png)

&emsp;&emsp;性能参数搜集的代码仍然写在前面的监控 [shin.js](https://github.com/pwstrick/shin-admin/blob/main/public/shin.js)（SDK） 中，为了兼容两个版本的性能标准，专门编写了一个函数。

```javascript
function _getTiming() {
  var timing =
    performance.getEntriesByType("navigation")[0] || performance.timing;
  var now = 0;
  if (!timing) {
    return { now: now };
  }
  var navigationStart;
  if (timing.startTime === undefined) {
    navigationStart = timing.navigationStart;
    /**
     * 之所以老版本的用 Date，是为了防止出现负数
     * 当 performance.now 是最新版本时，数值的位数要比 timing 中的少很多
     */
    now = new Date().getTime() - navigationStart;
  } else {
    navigationStart = timing.startTime;
    now = shin.now() - navigationStart;
  }
  return {
    timing: timing,
    navigationStart: navigationStart,
    now: _rounded(now)
  };
}
```

&emsp;&emsp;网上有很多种统计性能参数的计算方式，大部分都差不多，我选取了其中较为常规的参数，包括白屏、首屏等时间。

&emsp;&emsp;首屏时间很难计算，一般有几种计算方式。

* 第一种是算出首屏页面中所有图片都加载完后的时间，这种方法难以覆盖所有场景，并且计算结果并不准。
* 第二种是自定义首屏时间，也就是自己来控制何时算首屏全部加载好了，这种方法相对来说要精确很多。

```javascript
shin.setFirstScreen = function() {
  this.firstScreen = performance.now();
}
```

&emsp;&emsp;本次上报与之前不同，需要在页面关闭时上报。而在此时普通的请求可能都无法发送成功，那么就需要 [navigator.sendBeacon()](https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon) 的帮忙了。

&emsp;&emsp;在实际使用中发现，iOS 设备上调试发现不会触发 beforeunload 事件，安卓会将其触发，一番查找后，根据iOS支持的事件和社区的解答，发现得用 pagehide 事件替代。

&emsp;&emsp;但还是会有环境无法支持上述两个事件，想了个比较迂回的方法，那就是在后台跑个定时器，每 200ms 缓存一次要搜集的性能数据，在第二次进入时，再上报到后台。

#### 4）性能看板
&emsp;&emsp;在性能看板中，会有四张折线图，当要统计一天的数据时，横坐标为小时（0~23），纵坐标为在这个小时内正序后处于 95% 位置的日志，也就是 95% 的用户打开页面的时间。

![性能看板](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/8.png)

&emsp;&emsp;点击图表的 label 部分，可以在后面列表中显示日志细节，其中原始参数就是从浏览器中得到的计算前的性能数据。

![性能日志](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/9.png)

&emsp;&emsp;后面又增加了对比功能，就是将几天的数据放在一起对比，可更加直观的展示趋势。

![性能对比](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/monitor/10.png)

&emsp;&emsp;在每天的凌晨 3点30 分，统计昨天的日志信息。

&emsp;&emsp;还有个定时任务会在每天的凌晨 4点30 分执行，将四周前的日志和统计数据清除。

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