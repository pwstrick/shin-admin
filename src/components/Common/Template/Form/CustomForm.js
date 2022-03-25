/*
 * @Author: strick
 * @Date: 2021-01-06 15:02:12
 * @LastEditTime: 2022-03-25 16:06:32
 * @LastEditors: strick
 * @Description: 自定义表单组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/Form/CustomForm.js
 */
import { connect } from 'dva';
import { Form, Button } from 'antd';
import { removeEmptyInArray } from 'utils/tools';

const FormItem = Form.Item;
/**
 * url：表单提交的地址
 * initUrl：列表数据更新的地址
 * listName：关联的列表名称
 * controls：表单中的控件，特殊控件包括 addfield、upload和csv
 * btns：自定义按钮回调对象，包括
 *    onOk()：自定义点击事件
 *    formatValues()：格式化表单数据
 *    btnText：自定义按钮文本
 *    others：其它按钮对象组成的数组，与提交按钮放置在一行
 *      { click:"点击事件", text:"按钮文本" }
 *    currentForm：无需配置，读取当前组件的Form表单
 * form：由 Form.create() 创建的表单对象
 */
 const CustomForm = ({ url, initUrl, listName, controls, btns={}, state, dispatch, form }) => {
  const { queryLoading } = state;
  const { getFieldDecorator, validateFields } = form;
  const { onOk, formatValues, btnText, others=[] } = btns;
  btns.currentForm = form;
  const onClick = () => {
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
      //自定义提交逻辑
      if(onOk) {
        onOk(errors, values);
        return;
      }
      // console.log(values);
      dispatch({
        type: "template/handle",
        payload: {
          params: values, 
          url,
          initUrl,
          listName,
        }
      });
    });
  };
  const onOtherClick = (click) => {
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
      click(values);
    });
  };
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
  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  };
  /**
   * 判断当前字段是否必填
   */
  function isRequired(item) {
    if(!item.params)
      return false;
    //手动添加必填标记
    if(item.params.required)
      return true;
    if(!item.params.rules)
      return false;
    //根据验证规则显示必填标记
    return item.params.rules.some(value => value.required);
  }
  return <Form>
      {
        controls.map((item, index) => <FormItem 
          style={{marginBottom: 10}} 
          key={index}
          label={item.label} 
          {...formItemLayout}
          required={isRequired(item)}>
        {
          hanldeSpecialControl(item)
        }
        </FormItem>)
      }
      <FormItem wrapperCol={{ offset: 6 }}>
        <Button style={{marginRight: 10}} type="primary" onClick={onClick} loading={queryLoading}>{ btnText || '提交' }</Button>
        {
          others.map(item => 
          <Button style={{marginRight: 10}} onClick={() => onOtherClick(item.click)} loading={queryLoading}>{ item.text }</Button>)
        }
      </FormItem>
  </Form>;
}
export default connect(data => ({ state: data.template }))(Form.create()(CustomForm));