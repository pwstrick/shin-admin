/*
 * @Author: strick
 * @Date: 2021-01-14 14:02:47
 * @LastEditTime: 2021-12-21 17:02:17
 * @LastEditors: strick
 * @Description: 带标签栏的模态窗口
 * @FilePath: /strick/shin-admin/src/components/Common/Template/TabModal.js
 */
/* eslint-disable */ 
import { useEffect } from "react";
import { connect } from 'dva';
import { Modal, Form, Tabs } from 'antd';
const FormItem = Form.Item,
    TabPane = Tabs.TabPane;
/**
 * attrs：模态窗口的属性，所有属性皆能配置
 * type：标签栏类型，默认为 card
 * initPanes：标签栏内容回调函数，参数为 record，当标签栏只有一项时，将不显示菜单
 * effectCallback：useEffect钩子中的回调函数，参数是 record
 * tabParams：Tabs组件的属性
 * formItemLayout：自定义表单项中 label 和 wrapper 的宽度
 */
const TabModal = ({ attrs, type="card", initPanes, state, dispatch, effectCallback, tabParams, formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}}) => {
  const { setCreatingModalNameFunc, record } = state;
  useEffect(() => {
    effectCallback && effectCallback(state.record);
  }, [state.record]);
  function hide() {
    dispatch({
      type: 'template/hideCreate',
      //用于区分需要显示的模态窗口
      payload: { modalName: attrs.name }
    });
  }
  // 若只有一个菜单，那就不需要Tabs组件
  const list = initPanes(record);
  return <Modal 
  {...attrs}
  footer = {null}
  visible = {state[setCreatingModalNameFunc(attrs.name)]}
  onCancel = {hide}>
    {
      list.length > 1 ? 
      <Tabs type={type} animated={true} {...tabParams}>
        {list.map(item => <TabPane tab={item.name} key={item.key} style={{height:500, overflow:"auto"}}>
          <Form>
            {item.controls && item.controls.map((value, index) => 
              <FormItem label={value.label} {...formItemLayout} key={value.label || index} style={{marginBottom:0}}>
                {value.control}
              </FormItem>
            )}
          </Form>
        </TabPane>)}
      </Tabs> : 
      <Form>
        {list[0].controls && list[0].controls.map((value, index) => 
          <FormItem label={value.label} {...formItemLayout} key={value.label || index} style={{marginBottom:0}}>
            {value.control}
          </FormItem>
        )}
      </Form>
    }
  </Modal>;
}
export default connect(data => ({state: data.template}))(TabModal);