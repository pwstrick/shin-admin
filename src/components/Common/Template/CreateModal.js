/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 14:05:03
 * @LastEditTime: 2021-02-02 13:58:35
 * @Description: 创建模态窗口组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/CreateModal.js
 */
import { connect } from 'dva';
import { Modal, Form } from 'antd';
import { removeEmptyInArray } from 'utils/tools';
const FormItem = Form.Item;
/**
 * url：与服务端的通信地址
 * initUrl：列表初始化地址（用于创建成功后的列表初始化）
 * listName：交互的列表名称（当页面出现多个列表时使用）
 * attrs：模态窗口的属性（只开放了部分）
 * initControls：初始化控件的函数，参数是 record
 * btns：窗口底部的按钮回调函数集合，包括 onOk()，formatValues()
 * record：当前数据记录（在编辑时使用），声明于models/template文件
 * form：传递进来的表单，用于关联表单和控件
 * Modal组件：https://3x.ant.design/components/modal-cn/
 * Form组件：https://3x.ant.design/components/form-cn/
 */
const CreateModal = ({ url, initUrl, listName, attrs, initControls, btns={}, state, dispatch, form }) => {
  const { setCreatingModalNameFunc, record } = state;
  const { onOk, formatValues } = btns;
  const visible = state[setCreatingModalNameFunc(attrs.name)];
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  const { getFieldDecorator, validateFields, resetFields } = form;
  function create() {
    validateFields((errors, values) => {
      if (errors) return;
      //格式化values
      if(formatValues) {
        values = formatValues(values);
      }
      //移除数组中的空元素
      for(let key in values) {
        if(Array.isArray(values[key]))
          values[key] = removeEmptyInArray(values[key]);
      }
      /**
       * 确认按钮
       * errors：错误信息
       * values：表单中的数据
       * record：当编辑时，会带上旧数据
       */
      if(btns && onOk) {
        onOk(errors, values, record);
        return;
      }
      const params = { ...values };
      if(record.id !== undefined || record._id !== undefined) {
        params.id = record.id;
        params._id = record._id;
      } 
      dispatch({
        type: "template/handle",
        payload: {
          params,
          url,
          initUrl,
          modalName: attrs.name,
          listName
        }
      });
    });
  }
  function hide() {
    dispatch({
      type: 'template/hideCreate',
      //用于区分需要显示的模态窗口
      payload: { modalName: attrs.name }
    });
  }

  //初始化控件
  const controls = initControls(record);
  // console.log("initControls")
  /**
   * 特殊组件特殊处理
   */
  function hanldeSpecialControl(item) {
    let curControl;
    switch(item.type) {
      case "addfield":
      case "upload":
      case "import":
        curControl = item.initControl({ form, ...item });
        break;
      default:
        curControl = getFieldDecorator(item.name, item.params)(item.control);
    }
    return curControl;
  }
  /**
   * 判断当前字段是否必填
   */
  function isRequired(item) {
    if(!item.params || !item.params.rules)
      return false;
    return item.params.rules.some(value => value.required);
  }
  return <Modal 
    width = {attrs.width}
    title = {attrs.title}
    footer = {attrs.footer}
    visible = {visible}
    onCancel = {hide}
    onOk = {create}
    afterClose={resetFields}>
        <Form>
          {controls && controls.map(item => 
            <FormItem 
            style={{marginBottom: 10}}
            label={item.label} 
            {...formItemLayout} 
            key={item.name}
            required={isRequired(item)}>
              {hanldeSpecialControl(item)}
            </FormItem>
          )}
        </Form>
    </Modal>;
};
export default connect(data => ({state: data.template}))(Form.create()(CreateModal));