/*
 * @Author: strick
 * @Date: 2021-01-14 20:03:01
 * @LastEditTime: 2021-02-03 13:04:32
 * @LastEditors: strick
 * @Description: 批量操作组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/List/Batch.js
 */

import { connect } from 'dva';
import { Card, Affix } from 'antd';
/**
 * listName：关联的列表名称
 * initControl：控件初始化函数，参数为 selectedItems，其属性包括：
 *  selectedRowKeys:[]  由id组成的数组
 *  selectedRows:[]     由记录组成的数组
 * affix：固定位置，参考Affix组件 https://3x.ant.design/components/affix-cn/
 */
const Batch = ({ listName, initControl, affix, state }) => {
  const { setListNameFunc } = state;
  const selectedItem = state[setListNameFunc(listName, "selectedItem")] || {
    selectedRowKeys: [],
    selectedRows:[]
  };
  if(affix)
    return <Affix {...affix}>
      <Card style={{ marginBottom: 20 }}>{ initControl(selectedItem) }</Card>
    </Affix>;
  return <Card style={{ marginBottom: 20 }}>{ initControl(selectedItem) }</Card>;
}
export default connect(data => ({ state: data.template }))(Batch);