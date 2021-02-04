<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/logo.png" width="300"/>
</p>

shin 的读音是[ʃɪn]，谐音就是行，寓意可行的后台管理系统，它的特点是：

* 站在巨人的肩膀上，依托[Umi 2](https://v2.umijs.org/zh/)、[Dva 2](https://dvajs.com/)、[Ant Design 3](https://3x.ant.design/index-cn)和[React 16.8](https://zh-hans.reactjs.org/)搭建的定制化后台。
* 介于半成品和成品之间，有很强的可塑性，短期内你就能把控全局。
* 借助模板组件可快速交付90%以上的页面。
* 多样的权限粒度，大到菜单，小到接口。
* 容易扩展，例如引入统计用的图表或富文本编辑器等。

当然它还有一些不友好的地方：

* 大流程绝对能跑起来，但仍潜伏着很多细节BUG有待解决。
* 有一定的学习成本，需要学习Umi配置，Dva数据流方案，Ant Design组件以及React语法等。

# 安装
在将项目下载下来后，来到其根目录，运行安装命令，自动将依赖包下载到本地。
```bash
$ npm install
```
启动开发服务器，默认会打开系统主页（下图），由于会调用本地的Mock数据，所以即使没有后端服务器，项目也能运行。
```bash
$ npm start
```
![主页](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/main.png)
