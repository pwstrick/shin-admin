/*
 * @Author: strick
 * @Date: 2021-01-14 14:02:47
 * @LastEditTime: 2021-02-02 14:19:16
 * @LastEditors: strick
 * @Description: 标签栏组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/SelectTabs.js
 */
import { Tabs } from 'antd';
const TabPane = Tabs.TabPane; 
function SelectTabs(props) {
  /**
   * categories：键值对数组 [{key:"", value:""}]
   * onTabChanges：选择标签时触发的事件
   * animated：动画
   * initTab：初始化TabPane中组件的函数
   * type：标签栏类型，默认为 line
   * Tabs组件：https://3x.ant.design/components/tabs-cn/
   */
  const { categories, onTabChanges, animated=true, initTab, type="line" } = props;
  return <Tabs onChange={onTabChanges} animated={animated} type={type}>
  {
    categories.map(category => (
      <TabPane tab={category.value} key={category.key}>
        {initTab(category)}
      </TabPane>
    ))
  }
  </Tabs>
}
export default SelectTabs;