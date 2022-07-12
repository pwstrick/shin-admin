/*
 * @Author: strick
 * @Date: 2021-02-02 10:22:02
 * @LastEditTime: 2022-07-12 16:24:04
 * @LastEditors: strick
 * @Description: 接口API映射
 * @FilePath: /strick/shin-admin/src/api/index.js
 */
export default {
  get: "get",       //通用读取一条，select
  gets: "gets",     //通用读取多条，select
  head: "head",     //通用聚合，包括count、sum、min和max
  post: "post",     //通用提交，create
  put: "put",       //通用更新，update
  
  templateCreate: "template/create",    //模板示例中的创建和编辑
  templateQuery: "template/query",      //模板示例中的查询
  templateHandle: "template/handle",    //模板示例中的数据处理

  shortChainCreate: "tool/short/create",    //短链创建和编辑
  shortChainQuery: "tool/short/query",      //短链查询
  shortChainDel: "tool/short/del",          //短链删除

  toolConfigCreate: "tool/config/create",   //通用配置创建和编辑
  toolConfigQuery: "tool/config/query",     //通用配置查询
  toolConfigDel: "tool/config/del",         //通用配置删除

  monitorList: "monitor/list",                  //监控日志列表
  monitorListChart: "monitor/list/chart",       //监控日志明细折线图
  monitorContext: "monitor/context",            //监控日志上下文
  monitorStatistic: "monitor/statistic",        //监控日志面板
  monitorChart: "monitor/chart",                //监控日志图表
  monitorDate: "monitor/date",                  //按天读取监控日志
  monitorPerformanceProjectList: "monitor/performance/project/list",            //性能监控项目列表
  monitorPerformanceProjectCreate: "monitor/performance/project/create",        //性能监控项目创建
  monitorPerformanceProjectDel: "monitor/performance/project/del",              //性能监控项目删除
  monitorPerformanceStatistic: "monitor/performance/statistic",                 //性能监控统计信息
  monitorPerformanceChart: "monitor/performance/chart",                         //性能监控图表信息
  monitorPerformanceGet: 'monitor/performance/get',                             //性能监控请求一条信息
}