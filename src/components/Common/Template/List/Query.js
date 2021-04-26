/*
 * @Author: strick
 * @Date: 2021-01-04 18:27:12
 * @LastEditTime: 2021-04-26 14:37:47
 * @LastEditors: strick
 * @Description: 列表模板中的过滤条件，可按回车直接提交
 * @FilePath: /strick/shin-admin/src/components/Common/Template/List/Query.js
 */
import { connect } from 'dva';
import { Form, Card, Button } from 'antd';
const FormItem = Form.Item;
/**
 * url：查询的请求地址
 * listName：关联的列表名称，当一个页面中包含多个列表时使用
 * type：两种类别的过滤条件 list（列表）和form（表单）
 * controls：组件集合
 * btns：按钮回调事件集合
 *    formatValues()：自定义函数，格式化读取到的字段值
 *    fieldsValues：无需定义，默认提供的属性，表单中的字段值
 * callback：自定义的回调函数，参数是列表数据
 * form：由 Form.create() 创建
 * Card组件：https://3x.ant.design/components/card-cn/
*/
const Query = ({ url, listName, type="list", controls, btns={}, callback, state, dispatch, form }) => {
  const { getFieldDecorator, validateFields, getFieldsValue } = form;
  const { formatValues } = btns;
  const onClick = (e) => {
    e.preventDefault();
    validateFields((errors, values) => {
      if (errors) return;
      //格式化values
      if(formatValues) {
        values = formatValues(values);
      }
      dispatch({
        type: "template/query",
        payload: { 
          params: values, 
          url, 
          callback,
          listName
        }
      });
    });
  };
  // 字段读取
  btns.fieldsValues = formatValues ? formatValues(getFieldsValue()) : getFieldsValue();
  const func = type === "list" ? listQuery : formQuery;
  return <Card style={{ marginBottom: 20 }}>
    { func(onClick, getFieldDecorator, controls, state) }
  </Card>;
};
/**
 * 列表形式的过滤条件
 * controls 中会将多个需要在一行中显示的组件合并成数组，例如下面是两行组件集合
 * {
 *   [组件1，组件2],
 *   [组件3, "search"]
 * }
 * 其中 search 是一个占位符，会渲染成提交按钮
*/
function listQuery(onClick, getFieldDecorator, controls, state) {
  return <Form onSubmit={onClick} layout="inline">
    {controls.map((item, index1) => <div key={index1}>
      {
        item.map((child, index2) => <FormItem key={index2}>{
          child === "search" ? 
          <Button type="primary" icon="search" onClick={onClick} loading={state.queryLoading} htmlType="submit">查询</Button> : 
            getFieldDecorator(child.name, child.params || {})(child.control)
          }
        </FormItem>)
      }
      </div>
    )}
  </Form>;
}
/**
 * 表单形式的过滤条件
 * 每个组件占一行，并且不需要 search 占位符
*/
function formQuery(onClick, getFieldDecorator, controls, state) {
  const formItemLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
  };
  return <Form onSubmit={onClick}>
      {controls.map((item, index) => <FormItem style={{marginBottom: 10}} key={index} label={item.label} {...formItemLayout}>{
          getFieldDecorator(item.name, item.params || {})(item.control)
        }
        </FormItem>)
      }
      <FormItem wrapperCol={{ offset: 4 }}>
        <Button type="primary" icon="search" onClick={onClick} loading={state.queryLoading} htmlType="submit">查询</Button>
      </FormItem>
  </Form>;
}

export default connect(data => ({state: data.template}))(Form.create()(Query));