/*
 * @Author: strick
 * @Date: 2021-01-06 15:02:12
 * @LastEditTime: 2021-02-02 13:09:16
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
 * btns：自定义按钮回调对象，包括 onOk()，formatValues()
 * form：由 Form.create() 创建的表单对象
 */
const CustomForm = ({ url, initUrl, listName, controls, btns={}, state, dispatch, form }) => {
  const { queryLoading } = state;
  const { getFieldDecorator, validateFields } = form;
  const { onOk, formatValues } = btns;
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
    if(!item.params || !item.params.rules)
      return false;
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
        <Button type="primary" onClick={onClick} loading={queryLoading}>提交</Button>
      </FormItem>
  </Form>;
}
export default connect(data => ({ state: data.template }))(Form.create()(CustomForm));