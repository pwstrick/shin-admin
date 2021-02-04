/*
 * @Author: strick
 * @Date: 2021-01-04 17:10:04
 * @LastEditTime: 2021-02-03 17:04:10
 * @LastEditors: strick
 * @Description: 上传组件
 * @FilePath: /strick/shin-admin/src/components/Common/Upload/PhotoUpload.js
 */
import { useState, useEffect } from "react";
import { Upload , Icon, Modal, Form } from 'antd';
/**
 * 读取图像的Base64格式
 */
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
const FormItem = Form.Item;
/**
 * 初始化传递进来的文件数组
 */
function formatInitFileList(initialValue) {
  return initialValue.map((value, index) => ({
    uid: Math.random().toString() + (index+  1),
    status: 'done',
    thumbUrl: value
  }));
}
/**
 * 图像上传组件
 * name：组件名称
 * params：getFieldDecorator()的参数
 * dir：保存的目录，默认是img
 * count：可上传的图像数量
 * fileUrl：静态资源的域名，会与得到的图像地址拼接，默认是shin-server
 * action：上传地址，默认是shin-server的地址
 * form：关联的表单
 * Upload组件：https://3x.ant.design/components/upload-cn/
 */
/* eslint-disable */
const PhotoUpload = ({name, params={}, dir = "img", count = 1, fileUrl = "http://localhost:6060/", action = "/api/common/upload", form}) => {
  const { initialValue=[] } = params;
  const { getFieldDecorator } = form;
  const formatInitValue = formatInitFileList(initialValue);
  const [fileList, setFileList] = useState(formatInitValue);
  const [previewObj, setPreviewObj] = useState({});

  useEffect(() => {
    //定义初始化的fileList
    setFileList(formatInitFileList(initialValue));
  }, [params.initialValue]);
  //预览
  async function preview(file) {
    if (file.status === "done") {
      file.preview = file.thumbUrl;
    }else {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewObj({
      previewImage: file.preview,
      previewVisible: true
    });
  }
  function hidePreview() {
    setPreviewObj({
      previewImage: "",
      previewVisible: false
    });
  }
  //显示上传按钮
  function renderUploadBtn() {
    return (
      <div >
        <Icon type="plus" />
        <div>上传</div>
      </div>
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
  // 获取已上传的图片地址
  function getUploadImageUrl(file) {
    return fileUrl + file.response.key;
  }

  function onUploadChange(data) {
    const { fileList } = data;
    //获取图片地址
    fileList.forEach(item => {
      if (item && item.status === 'done' && item.response) {
        item.thumbUrl = getUploadImageUrl(item);
      }
    });
    // console.log(fileList)
    setFileList(fileList);
  }
  const uploadProps = {
    action,   //上传地址
    listType: 'picture-card',
    onPreview: preview,
    data: { dir },
  };
  return <FormItem style={{marginBottom: 0}}>
    {getFieldDecorator(name, {
      ...params,
      initialValue: formatInitValue.length > 0 ? getUploadValues({ fileList: formatInitValue }) : [],
      validateTrigger: ['onChange'],
      getValueFromEvent: getUploadValues
    })(
      <Upload
        style={{float: "none"}}
        accept='image/*'
        {...uploadProps}
        fileList={fileList}
        onChange={onUploadChange}>
        { fileList.length >= count ? null : renderUploadBtn() }
      </Upload>
    )}
    <Modal visible={previewObj.previewVisible} footer={null} onCancel={hidePreview}>
      <img style={{ width: '100%' }} src={previewObj.previewImage} />
    </Modal>
  </FormItem>
}

export default PhotoUpload;