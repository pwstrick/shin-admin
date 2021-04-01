/*
 * @Author: strick
 * @Date: 2021-01-14 14:02:47
 * @LastEditTime: 2021-04-01 14:10:50
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
 * attrs：模态窗口的属性，只开放了部分：宽度、标题
 * type：标签栏类型，默认为 card
 * initPanes：标签栏内容回调函数，参数为 record
 * effectCallback：useEffect钩子中的回调函数，参数是 record
 * formItemLayout：自定义表单项中 label 和 wrapper 的宽度
 */
const TabModal = ({ attrs, type="card", initPanes, state, dispatch, effectCallback, formItemLayout = {
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
  return <Modal 
  width = {attrs.width}
  title = {attrs.title}
  footer = {null}
  visible = {state[setCreatingModalNameFunc(attrs.name)]}
  onCancel = {hide}>
    <Tabs type={type} animated={true}>
      {initPanes(record).map(item => <TabPane tab={item.name} key={item.key} style={{height:500, overflow:"auto"}}>
        <Form>
          {item.controls && item.controls.map((value, index) => 
            <FormItem label={value.label} {...formItemLayout} key={value.label || index} style={{marginBottom:0}}>
              {value.control}
            </FormItem>
          )}
        </Form>
      </TabPane>)}
    </Tabs>
  </Modal>;
}
export default connect(data => ({state: data.template}))(TabModal);