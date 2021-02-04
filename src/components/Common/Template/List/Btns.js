/*
 * @Author: strick
 * @Date: 2021-01-14 14:02:47
 * @LastEditTime: 2021-02-02 14:19:47
 * @LastEditors: strick
 * @Description: 列表模板按钮集合组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/List/Btns.js
 */

import { connect } from 'dva';
import { Button } from 'antd';
const Btns = ({ btns, dispatch, state }) => {
  const { exportLoading } = state;
  //新建事件
  const createClick = (params) => {
    dispatch({
      type: 'template/showCreate',
      payload: params,
    });
  };
  //导出事件
  const exportClick = (params) => {
    dispatch({
      type: 'template/export',
      payload: params,
    });
  };
  /**
    * btns是一个对象数组，其属性如下：
    *   type: 根据按钮类型初始化按钮，默认提供新建（create）和导出两个按钮（export）
    *   text：按钮文案
    *   data：需要额外传递的参数，例如url、params等
    *   onClick：点击事件
    *   icon：图标
    * Button组件：https://3x.ant.design/components/button-cn/
    */
  const initBtns = btns.map((item, index) => {
    let btn;
    switch(item.type) {
      case "create":
        btn = <Button style={{marginRight: 10}} icon="plus" key={index} 
            onClick={() => createClick(item.data.params)}>{item.text ? item.text : "新建"}</Button>
        break;
      case "export":
        btn = <Button style={{marginRight: 10}} icon="download" loading={exportLoading} key={index} 
            onClick={() => exportClick(item.data)}>{item.text ? item.text : "导出"}</Button>
        break;
      default:
        //自定义按钮
        btn = <Button style={{marginRight: 10}} icon={item.icon} key={index} 
            onClick={item.onClick}>{item.text}</Button>
        break;
      }
      return btn;
  });
  return <div style={{marginBottom: 20}}>
    {initBtns}
  </div>
};
export default connect(data => ({ state: data.template }))(Btns);
