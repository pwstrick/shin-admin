/*
 * @Author: strick
 * @Date: 2021-01-12 17:57:11
 * @LastEditTime: 2021-04-20 10:02:46
 * @LastEditors: strick
 * @Description: 普通文件上传组件
 * @FilePath: /strick/shin-admin/src/components/Common/Upload/FileUpload.js
 */
import { useState, useEffect } from "react";
import { Upload , Icon, Form, Button } from 'antd';
const FormItem = Form.Item;
/**
 * 初始化传递进来的文件数组
 */
function formatInitFileList(initialValue) {
  return initialValue.map((value, index) => {
    const segments = value.split("/");
    return {
      uid: Math.random().toString() + (index + 1),
      status: 'done',
      thumbUrl: value,
      name: segments[segments.length - 1]
    };
  });
}
/**
 * 文件上传组件
 * name：组件名称
 * params：getFieldDecorator()的参数
 * dir：保存的目录，默认是file
 * count：可上传的文件数量
 * fileUrl：静态资源的域名，会与得到的文件地址拼接，默认是shin-server
 * action：上传地址，默认是shin-server的地址
 * form：关联的表单
 * accept: 接受的文件类型
 * uploadChange：会在 onChange 事件中执行，参数包含 File和fileList 的对象
 */
/* eslint-disable */
const FileUpload = ({name, params={}, dir = "file", count = 1, 
  fileUrl = "http://localhost:6060/", action = "/api/common/upload", form,
  accept, uploadChange
}) => {
  const { initialValue=[] } = params;
  const { getFieldDecorator } = form;
  const formatInitValue = formatInitFileList(initialValue);
  const [fileList, setFileList] = useState(formatInitValue);

  useEffect(() => {
    //定义初始化的fileList
    setFileList(formatInitFileList(initialValue));
  }, [params.initialValue]);

  //显示上传按钮
  function renderUploadBtn() {
    return (
      <Button size="small">
        <Icon type="upload" /> 点击上传
      </Button>
    );
  }
  //读取上传按钮中的地址
  function getUploadValues(data) {
    const { fileList } = data;
    if(!fileList)
      return "";
    const list = fileList.filter(item => item.status === 'done').map(item => item.thumbUrl);
    if(count === 1)
      return list.join("");
    return list;
  }
  // 获取已上传的文件地址
  function getUploadFileUrl(file) {
    return fileUrl + file.response.key;
  }

  function onUploadChange(data) {
    const { fileList } = data;
    //获取文件地址
    fileList.forEach(item => {
      if (item && item.status === 'done' && item.response) {
        item.thumbUrl = getUploadFileUrl(item);
      }
    });
    uploadChange && uploadChange({ file:data.file, fileList});
    setFileList(fileList);
  }
  const uploadProps = {
    action,
    data: { dir },
    accept
  };
  return <FormItem style={{marginBottom: 0}}>
    {getFieldDecorator(name, {
      ...params,
      initialValue: formatInitValue.length > 0 ? getUploadValues({ fileList: formatInitValue }) : [],
      validateTrigger: ['onChange'],
      getValueFromEvent: getUploadValues
    })(
      <Upload
        {...uploadProps}
        fileList={fileList}
        onChange={onUploadChange}>
        { fileList.length >= count ? null : renderUploadBtn() }
      </Upload>
    )}
  </FormItem>
}

export default FileUpload;