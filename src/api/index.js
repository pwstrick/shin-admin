/*
 * @Author: strick
 * @Date: 2021-02-02 10:22:02
 * @LastEditTime: 2021-02-02 15:11:50
 * @LastEditors: strick
 * @Description: 接口API映射
 * @FilePath: /strick/shin-admin/src/api/index.js
 */
export default {
  templateCreate: "template/create",    //模板示例中的创建和编辑
  templateQuery: "template/query",      //模板示例中的查询
  templateHandle: "template/handle",    //模板示例中的数据处理

  shortChainCreate: "tool/short/create",    //短链创建和编辑
  shortChainQuery: "tool/short/query",      //短链查询
  shortChainDel: "tool/short/del",          //短链删除

  toolConfigCreate: "tool/config/create",   //通用配置创建和编辑
  toolConfigQuery: "tool/config/query",     //通用配置查询
  toolConfigDel: "tool/config/del",         //通用配置删除
}