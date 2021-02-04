/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 10:35:23
 * @LastEditTime: 2021-02-03 16:54:58
 * @Description: 表单模板
 * @FilePath: /strick/shin-admin/src/pages/template/form/index.js
 */
import React from "react";
import { connect } from "dva";
import { Select, Input, Tag, Divider, Popconfirm } from "antd";
import Prompt from "components/Common/Template/Prompt";
import CreateModal from "components/Common/Template/CreateModal";
import List from "components/Common/Template/List/List";
import CustomForm from "components/Common/Template/Form/CustomForm";
import AddField from "components/Common/Template/Form/AddField";
import PhotoUpload from "components/Common/Upload/PhotoUpload";
import FileUpload from "components/Common/Upload/FileUpload";
import CsvUpload from "components/Common/Upload/CsvUpload";
import { setColumn, formatDate } from "utils/tools";
import api from "api";
import { TEMPLATE_MODEL } from "utils/constants";


/* eslint-disable */
const Option = Select.Option;
const FormDemo = ({ dispatch }) => {
  //Prompt组件属性
  const promptProps = {
    message: "使用需知",
    description: (
      <span>
        可以选择csv文件上传(<a href="#">点击下载uid的示例</a>
        )或手动输入uid(英文逗号隔开，不允许存在空格)。
      </span>
    )
  };
  const albumList = [
    { id: "123456", name: "七里香" },
    { id: "234567", name: "叶惠美" },
    { id: "345678", name: "八度空间" }
  ];
  //List组件属性
  const list1Props = {
    url: api.templateQuery,
    columns: [
      setColumn("id", "id"),
      setColumn("专辑", "name"),
      setColumn("价格", "price"),
      setColumn("状态", "status", { render: (text) => tags[text] }),
      setColumn("注册日期", "date", { render: (prop) => formatDate(prop) }),
      setColumn("操作", "id", {
        key: "operate",
        fixed: "right",
        render: (id, record) => {
          return (
            <div>
              {
                <span>
                  <a onClick={() => edit(record)}>编辑</a>
                  <Divider type="vertical" />
                </span>
              }
              {
                <span>
                  <Popconfirm title="确定要删除吗" onConfirm={() => del(id)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              }
            </div>
          );
        }
      })
    ],
    scroll: { x: true }
  };
  //CreateModal组件属性
  const modalProps = {
    attrs: {
      name: "add",
      width: 800,
      title: "新建配置"
    },
    btns: {
      onOk: (errors, values, record) => {
        // console.log(errors)
        if (errors) return;
        const params = { ...values };
        if (record.id !== undefined) params.id = record.id;
        dispatch({
          type: TEMPLATE_MODEL.HANDLE,
          payload: {
            params,
            url: api.templateCreate,
            initUrl: list1Props.url,
            modalName: modalProps.attrs.name
          }
        });
        // console.log(values);
      }
    },
    initControls: (record) => [
      {
        label: "专辑",
        name: "aid",
        params: {
          initialValue: record.id ? String(record.id) : ""
        },
        control: (
          <Select style={{ width: 350 }}>
            {albumList.map((item) => (
              <Option key={item.id} value={item.id}>
                {item.name}
              </Option>
            ))}
          </Select>
        )
      },
      {
        label: "名称",
        name: "name",
        params: {
          rules: [{ required: true, message: "名称不能为空" }],
          initialValue: record && record.name
        },
        control: <Input />
      },
      {
        label: "价格",
        name: "price",
        params: {
          rules: [{ required: true, message: "价格不能为空" }],
          initialValue: record && record.price
        },
        control: <Input addonAfter="元" />
      },
      {
        label: "封面",
        name: "cover",
        control: <span>暂无</span>
      },
      {
        label: "主页",
        name: "urls",
        type: "addfield",
        params: {
          rules: [{ required: true, message: "主页不能为空" }],
          initialValue: record && record.urls
        },
        control: (index) => (
          <Input
            placeholder={`第 ${index} 条主页地址`}
            style={{ width: "80%" }}
          />
        ),
        initControl: (props) => <AddField {...props}></AddField>
      },
      {
        label: "icon3",
        name: "icon3",
        type: "upload",
        params: {
          rules: [{ required: true, message: "icon不能为空" }],
          initialValue: record && record.icon
        },
        initControl: (props) => <PhotoUpload dir="demo" count={3} {...props} />
      },
      {
        label: "用户导入",
        name: "csv",
        type: "import",
        params: {
          initialValue: record && record.csv
        },
        initControl: (props) => (
          <CsvUpload
            onComplete={csvImportComplete}
            prompt={
              <div>
                第一列必须是img，第二列必须是tab<a href="#">点击下载示例</a>
              </div>
            }
            {...props}
          />
        )
      }
    ]
  };
  const tags = {
    0: <Tag>未提交</Tag>,
    1: <Tag color="blue">待审核</Tag>,
    2: <Tag color="green">已通过</Tag>,
    3: <Tag color="brown">已废弃</Tag>
  };
  function edit(record) {
    dispatch({
      type: TEMPLATE_MODEL.MODAL,
      payload: {
        params: record,
        modalName: modalProps.attrs.name
      }
    });
  }
  function del(id) {
    dispatch({
      type: TEMPLATE_MODEL.HANDLE,
      payload: {
        params: { id },
        url: api.templateHandle,
        initUrl: list1Props.url
      }
    });
  }

  /**
   * 只有当包含返回值时，才会执行成功
   */
  function csvImportComplete(data) {
    console.log("complete", data);
  }
  //CustomForm组件属性
  const customFormProps = {
    url: api.templateCreate,
    initUrl: list1Props.url,
    btns: {
      // onOk: (errors, values) => {
      //   console.log("custom ok");
      // },
    },
    controls: [
      {
        label: "专辑",
        name: "name",
        control: <Input style={{ width: 200 }}></Input>
      },
      {
        label: "价格",
        name: "price",
        control: <Input addonAfter="元" style={{ width: 200 }} />,
        params: {
          rules: [{ required: true, message: "价格不能为空" }]
        }
      },
      {
        label: "状态",
        name: "state",
        control: (
          <Select name="state" style={{ width: 200 }}>
            <Option value="0">全部</Option>
            <Option value="1">永久禁用</Option>
            <Option value="2">正常</Option>
            <Option value="3">警告</Option>
          </Select>
        ),
        params: { initialValue: "0" }
      },
      {
        label: "主页",
        name: "urls",
        type: "addfield",
        params: {
          rules: [{ required: true, message: "主页不能为空" }],
          initialValue: ["http://www.pwstrick.com", "https://www.cnblogs.com/strick"]
        },
        control: (index) => (
          <Input
            placeholder={`第 ${index} 条主页地址`}
            style={{ width: "80%" }}
          />
        ),
        initControl: (props) => <AddField {...props}></AddField>
      },
      {
        label: "封面",
        name: "covers",
        type: "addfield",
        control: (index) => (
          <Input
            placeholder={`第 ${index} 条封面地址`}
            style={{ width: "80%" }}
          />
        ),
        initControl: (props) => <AddField {...props}></AddField>
      },
      {
        label: "icon",
        name: "icon",
        type: "upload",
        params: {
          rules: [{ required: true, message: "icon不能为空" }],
          initialValue: [
            // "//www.pwstrick.com/upload/avatar.png",
            "http://localhost:6060/img/avatar.png",
            // "//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg"
            "http://localhost:6060/img/cover.jpg",
          ]
        },
        initControl: (props) => <PhotoUpload dir="demo" count={3} {...props} />
      },
      {
        label: "icon2",
        name: "icon2",
        type: "upload",
        params: {
          initialValue: [
            // "//www.pwstrick.com/upload/avatar.png"   //MOCK数据采用此地址
            "http://localhost:6060/img/avatar.png"      //开启本地server服务器时采用此地址
          ]
        },
        initControl: (props) => <PhotoUpload count={3} {...props} />
      },
      {
        label: "用户导入",
        name: "csv",
        type: "import",
        params: {
          initialValue: [
            { nick: "justify", uid: "1" },
            { nick: "freedom", uid: "2" }
          ]
        },
        initControl: (props) => (
          <CsvUpload
            onComplete={csvImportComplete}
            prompt={
              <div>
                第一列必须是img，第二列必须是tab<a href="#">点击下载示例</a>
              </div>
            }
            {...props}
          />
        )
      },
      {
        label: "附件",
        name: "file",
        type: "upload",
        params: {
          initialValue: [
            // "//www.pwstrick.com/upload/avatar.png"
            "http://localhost:6060/img/avatar.png"
          ]
        },
        initControl: (props) => <FileUpload count={3} {...props} />
      }
    ]
  };
  return (
    <>
      <Prompt {...promptProps}></Prompt>
      <CreateModal {...modalProps}></CreateModal>
      <CustomForm {...customFormProps}></CustomForm>
      <List {...list1Props}></List>
    </>
  );
};

export default connect((data) => data.templateForm)(FormDemo);
