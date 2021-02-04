/*
 * @Author: strick
 * @Date: 2021-01-14 14:02:47
 * @LastEditTime: 2021-02-02 14:19:28
 * @LastEditors: strick
 * @Description: 带标签栏的模态窗口
 * @FilePath: /strick/shin-admin/src/components/Common/Template/TabModal.js
 */

import { connect } from 'dva';
import { Modal, Form, Tabs } from 'antd';
const FormItem = Form.Item,
    TabPane = Tabs.TabPane;
/**
 * attrs：模态窗口的属性，只开放了部分：宽度、标题
 * type：标签栏类型，默认为 card
 * panes：标签栏内容
 */
const TabModal = ({ attrs, type="card", panes, state, dispatch }) => {
  const { setCreatingModalNameFunc } = state;
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
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
      {panes.map(item => <TabPane tab={item.name} key={item.key} style={{height:300, overflow:"auto"}}>
        <Form>
          {item.controls && item.controls.map(value => 
            <FormItem label={value.label} {...formItemLayout} key={value.label} style={{marginBottom:0}}>
              {value.control}
            </FormItem>
          )}
        </Form>
      </TabPane>)}
    </Tabs>
  </Modal>;
}
export default connect(data => ({state: data.template}))(TabModal);