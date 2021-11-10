/*
 * @Author: strick
 * @Date: 2021-01-06 15:46:49
 * @LastEditTime: 2021-11-10 13:16:58
 * @LastEditors: strick
 * @Description: 动态添加控件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/Form/AddField.js
 */
import { useState, useEffect } from "react";
import { Form, Button, Icon } from 'antd';
const FormItem = Form.Item;
/* eslint-disable */
export default function AddField(props) {
  /**
   * name：组件名称
   * params：组件属性，getFieldDecorator() 的参数
   * label：新增按钮中的文本
   * control：动态新增的控件，文本框、选择框等
   * onRemove：自定义移除回调，参数 K 从0开始算起
   * form：关联的表单
   */
  const { name, params={}, label, control, form, onRemove } = props;
  const keyName = name + 'keys';   //控件集合的唯一标识
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;
  const [curParams, setParams] = useState(params);
  let [id, setId] = useState(0);
  useEffect(() => {
    //当初始值发生变化时更新curParams
    setParams(params);
  }, [params.initialValue]);
  //添加
  const add = () => {
    delete curParams.initialValue;   //删除初始数据
    const keys = getFieldValue(keyName);
    id++;
    const nextKeys = keys.concat(id);
    setFieldsValue({
      [keyName]: nextKeys,
    });
    setId(id);
  };
  //移除
  const remove = (k, index) => {
    const keys = getFieldValue(keyName);
    if (keys.length === 1) {
      return;
    }
    //自定义移除回调
    onRemove && onRemove(index);
    setFieldsValue({
      [keyName]: keys.filter(key => key !== k),
    });
  };

  //初始化控件中的值
  const controlParams = [];
  if(curParams && curParams.initialValue) {
    curParams.initialValue.forEach(value => controlParams.push({...curParams, initialValue: value}));
    id === 0 && (id = controlParams.length);
  }
  //当有initialValue的值时，需要增加控件数量
  getFieldDecorator(keyName, { initialValue: controlParams.length > 0 ? 
    new Array(controlParams.length).join().split(",").map((value, index) => {
      return index;
    }) : [0]
  });

  const keys = getFieldValue(keyName);
  const formItems = keys.map((k, index) => (
    <FormItem key={k} style={{marginBottom: 10}}>
      {getFieldDecorator(`${name}[${k}]`, controlParams[index] || curParams)(control(index + 1))}
      {
        keys.length > 1 ? (<Icon type="minus-circle-o" disabled={keys.length === 1} onClick={() => remove(k, index)} style={{marginLeft: 5}}/>) : null
      }
    </FormItem>
  ));
  return <div>
    {formItems}
    <Button type="dashed" onClick={add} style={{ width: '60%' }}>
      <Icon type="plus" /> { label }
    </Button>
  </div>
}