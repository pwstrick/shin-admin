/*
 * @Author: strick
 * @Date: 2021-01-12 11:24:55
 * @LastEditTime: 2021-02-03 12:52:04
 * @LastEditors: strick
 * @Description: 照片组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/PhotoCard.js
 */
import { Card, Icon } from 'antd';
import { useState, useEffect } from "react";
/**
 * id：组件的唯一标识，用于多选
 * url：照片地址
 * footer：底部自定义组件
 * selection：选中的值以及回调事件 onChange(selectedRowKeys)
 */
/* eslint-disable */
const PhotoCard = ({id, url, footer, selection={}}) => {
  const [checked, setChecked] = useState(false);
  const cursor = selection ? "pointer" : "defult";
  const { selectedRowKeys } = selection;
  useEffect(() => {
    //清空选中状态
    if(!selectedRowKeys || selectedRowKeys.length === 0)
      setChecked(false);
  }, [selectedRowKeys]);
  function onClick() {
    if(!selectedRowKeys)
      return;
    const status = !checked;
    if(status) {
      //选中则增加
      selection.selectedRowKeys.push(id);
    }
    else {
      //取消则移除
      selection.selectedRowKeys = selection.selectedRowKeys.filter(value => value !== id);
    }
    selection.onChange(selection.selectedRowKeys);
    setChecked(status);
  }
  return <>
    <Card style={{marginRight: 20, marginBottom: 20, width: 240, cursor}} bodyStyle={{ padding: 0 }} onClick={onClick}>
      <img src={ url } style={{width: "100%", height: 240, display: "block"}}/>
      <div style={{ padding: 10}}>
        { checked ? <Icon type="check-circle" style={{color:"#b7eb8f", fontSize:30, position:"absolute", top:5, right:5}}/> : null }
        { footer }
      </div>
    </Card>
  </>;
};
export default PhotoCard;