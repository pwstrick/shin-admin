/*
 * @Author: strick
 * @Date: 2021-01-04 17:22:43
 * @LastEditTime: 2021-02-02 13:09:42
 * @LastEditors: strick
 * @Description: CSV文件导入组件
 * @FilePath: /strick/shin-admin/src/components/Common/Upload/CsvUpload.js
 */
import { useState, useEffect } from "react";
import { Upload , Button, Tooltip, Icon, Modal, Form, message } from 'antd';
import Papa from 'papaparse';
import { formatJsonInPre } from "utils/tools";
const FormItem = Form.Item;
/**
 * name：控件名称
 * prompt：提示说明
 * onComplete：导入成功后的回调
 * params：getFieldDecorator()的参数
 * form：关联的表单
 * PapaParse组件：https://www.papaparse.com/
 */
/* eslint-disable */
const CsvUpload = ({name, prompt, onComplete, params={}, form}) => {
  const { initialValue=[] } = params;
  const [fileData, setFileData] = useState(initialValue);

  useEffect(() => {
    //定义初始化的fileData
    setFileData(initialValue);
  }, [params.initialValue]);
  const { getFieldDecorator, setFieldsValue } = form;
  //读取上传按钮中的地址
  const onUploadBefore = (fileObj) => {
    Papa.parse(fileObj, {
      header: true,
      complete: (results) => {
        let { data } = results;
        //过滤空白行
        if(data) {
          //先读取对象的值，再拼接成字符串，最后去除前后空白符，获取字符串长度
          data = data.filter(item => Object.values(item).join("").trim().length > 0);
        }
        //导入成功后对数据的特殊处理
        if(onComplete) {
          const handleData = onComplete(data);
          data = handleData ? handleData : data;
        }
        setFileData(data);
        setFieldsValue({[name]: data});
        message.success('导入成功');
      },
    });
  };
  const onRemove = () => {
    setFileData([]);
    setFieldsValue({[name]: []});
    message.error('移除成功');
  };
  const onPreview = () => {
    Modal.info({
      title: `已选择对象(${fileData.length}条)`,
      content: formatJsonInPre(fileData),
    });
  };

  return <FormItem style={{marginBottom: 0}}>
  {getFieldDecorator(name, {
    ...params,
  })(
    <Upload
      showUploadList={false}
      accept='.csv'
      fileList={[]}
      beforeUpload={onUploadBefore}
    >
      <Button  size="small">导入CSV</Button>
    </Upload>)}
    {
      prompt ? <Tooltip title={prompt}>
        <Icon style={{ marginLeft: 10 }} type="question-circle" />
      </Tooltip> : null
    }
    {
      fileData.length > 0 ? <span>
        <Button size="small" style={{ marginLeft: 10 }} onClick={onPreview}>预览</Button>
        <Button size="small" style={{ marginLeft: 10 }} type="danger" onClick={onRemove}>移除</Button>
      </span> : null
    }
  </FormItem>
}
export default CsvUpload;