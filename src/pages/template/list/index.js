/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 10:34:41
 * @LastEditTime: 2021-07-21 15:54:56
 * @Description: 列表模板
 * @FilePath: /strick/shin-admin/src/pages/template/list/index.js
 */
import React from "react";
import { connect } from "dva";
import {
  Select,
  Input,
  Button,
  Tag,
  Divider,
  Popconfirm,
  Popover,
  Icon,
  DatePicker
} from "antd";
import Prompt from "components/Common/Template/Prompt";
import SelectTabs from "components/Common/Template/SelectTabs";
import Btns from "components/Common/Template/List/Btns";
import Query from "components/Common/Template/List/Query";
import Batch from "components/Common/Template/List/Batch";
import List from "components/Common/Template/List/List";
import CreateModal from "components/Common/Template/CreateModal";
import AddField from "components/Common/Template/Form/AddField";
import PhotoUpload from "components/Common/Upload/PhotoUpload";
import FileUpload from "components/Common/Upload/FileUpload";
import CsvUpload from "components/Common/Upload/CsvUpload";
import TabModal from "components/Common/Template/TabModal";
import { setColumn, breakWord, formatDate } from "utils/tools";
import api from "api";
import { TEMPLATE_MODEL } from "utils/constants";
/* eslint-disable */
const Option = Select.Option;
const ListDemo = ({ dispatch }) => {
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
  //SelectTabs组件属性
  const tabsProps = {
    categories: [
      { value: "普通列表", key: 1 },
      { value: "拖拽列表", key: 2 },
      { value: "图像列表", key: 3 }
    ],
    initTab: (category) => {
      switch (category.key) {
        case 1:
          return (
            <>
              <Query {...query1Props}></Query>
              <Batch {...batch1Props}></Batch>
              <List {...list1Props}></List>
            </>
          );
        case 2:
          return (
            <>
              <Query {...query2Props}></Query>
              <List {...list2Props}></List>
            </>
          );
        case 3:
          return (
            <>
              <Query {...query3Props}></Query>
              <Batch {...batch3Props}></Batch>
              <List {...list3Props}></List>
            </>
          );
      }
    }
  };
  const albumList = [
    { id: "123456", name: "七里香" },
    { id: "234567", name: "叶惠美" },
    { id: "345678", name: "八度空间" }
  ];
  /**
   * 只有当包含返回值时，才会执行成功
   */
  function csvImportComplete(data) {
    console.log("complete", data);
  }
  //CreateModal组件属性
  const modalProps = {
    url: api.templateCreate,
    initUrl: api.templateQuery,
    listName: "list1",
    attrs: {
      name: "add",
      width: 800,
      title: "新建配置"
    },
    btns: {
      // onOk: (errors, values, record) => {
      //     // console.log(errors)
      //     if (errors) return;
      //     const params = { ...values };
      //     if(record.id !== undefined)
      //         params.id = record.id
      //     dispatch({
      //         type: "template/handle",
      //         payload: {
      //             params,
      //             url: "template/create",
      //             initUrl: "template/query",
      //             modalName: "add",
      //             listName: "list1"
      //         }
      //     });
      //     // console.log(values);
      // }
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
          initialValue: record.name
        },
        control: <Input />
      },
      {
        label: "价格",
        name: "price",
        params: {
          rules: [{ required: true, message: "价格不能为空" }],
          initialValue: record.price
        },
        control: (
          <Input
            addonAfter="元"
            disabled={record.price === undefined ? false : true}
          />
        )
      },
      {
        label: "icon",
        name: "icon",
        type: "upload",
        params: {
          // rules: [{ required: true, message: 'icon不能为空' }],
          initialValue: record.icon
        },
        initControl: (props) => <PhotoUpload dir="demo" count={3} {...props} />
      },
      {
        label: "主页",
        name: "urls",
        type: "addfield",
        params: {
          rules: [{ required: true, message: "主页不能为空" }],
          initialValue: record.urls
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
        label: "用户导入",
        name: "csv",
        type: "import",
        params: {
          initialValue: record.csv
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
          initialValue: record.file
        },
        initControl: (props) => <FileUpload dir="demo" count={3} {...props} />
      }
    ]
  };
  //TabModal组件属性
  const tabModalProps = {
    type: "card",
    attrs: {
      name: "read",
      width: 600,
      title: "信息阅览"
    },
    initPanes: record => [
      {
        name: "用户信息",
        key: "logout",
        controls: [
          { label: "uid", control: "123" },
          { label: "手机", control: "+186138****00" },
          { label: "性别", control: "男" }
        ]
      },
      {
        name: "账号信息",
        key: "account",
        controls: [
          { label: "微信", control: <Button>解绑</Button> },
          { label: "手机", control: <Button>解绑</Button> }
        ]
      },
      {
        name: "设备信息",
        key: "device"
      }
    ]
  };
  function showDetail(record) {
    return (
      <div>
        <p>{`扩展参数：${JSON.stringify(record.ext) || "无"}`}</p>
        <p>{`创建时间：${formatDate(record.createTime)}`}</p>
      </div>
    );
  }
  //List组件属性
  const list1Props = {
    url: api.templateQuery,
    name: "list1",
    columns: [
      setColumn("id", "id"),
      setColumn("专辑", "name"),
      setColumn("价格", "price"),
      setColumn("状态", "status", { render: (text) => tags[text] }),
      setColumn("注册日期", "date", { render: (prop) => formatDate(prop) }),
      setColumn("登录日期", "udate", { render: (prop) => formatDate(prop) }),
      setColumn("个人主页", "url", { width: "30%", render: breakWord }),
      setColumn("操作", "id", {
        key: "operate",
        fixed: "right",
        render: (id, record) => {
          return (
            <div>
              {
                <Popover
                  placement="left"
                  title="详细信息"
                  content={showDetail(record)}
                >
                  <a>更多</a>
                  <Divider type="vertical" />
                </Popover>
              }
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
    rowSelection: {
      onChange(selectedRowKeys, selectedRows) {
        dispatch({
          type: TEMPLATE_MODEL.SELECTED,
          payload: {
            params: {
              selectedRowKeys,
              selectedRows
            },
            listName: list1Props.name
          }
        });
      }
    },
    scroll: { x: true }
  };
  const list2Props = {
    url: api.templateQuery,
    name: "list2",
    type: "drag",
    columns: [
      setColumn("id", "id"),
      setColumn("专辑", "name"),
      setColumn("价格", "price"),
      setColumn("状态", "status", { render: (text) => tags[text] }),
      setColumn("注册日期", "date", {
        width: "20%",
        render: (prop) => formatDate(prop)
      }),
      setColumn("登录日期", "udate", {
        width: "20%",
        render: (prop) => formatDate(prop)
      })
    ],
    options: {
      onUpdate: (newList) => {
        //拖拽后的更新回调
        console.log(newList);
        dispatch({
          type: TEMPLATE_MODEL.HANDLE,
          payload: {
            params: { list: newList },
            url: api.templateHandle,
            initUrl: list2Props.url,
            listName: list2Props.name
          }
        });
      }
    }
  };
  function cardFooter(record) {
    return (
      <>
        <p>
          被举报人:
          <a>{record.name}</a>
        </p>
        <Popover title="举报详情" content="321" placement="right">
          <Icon
            type="right-circle"
            style={{ position: "absolute", right: 5, bottom: 10, fontSize: 20 }}
          />
        </Popover>
      </>
    );
  }
  const list3Props = {
    url: api.templateQuery,
    name: "list3",
    type: "photo",
    rowSelection: {
      selectedRowKeys: [],
      onChange: (selectedRowKeys) => {
        //触发组件更新
        dispatch({
          type: TEMPLATE_MODEL.SELECTED,
          payload: {
            params: {
              selectedRowKeys,
            },
            listName: list3Props.name
          }
        });
      }
    },
    options: {
      footer: cardFooter
    }
  };
  //Query组件属性（列表形式）
  const { RangePicker } = DatePicker;
  const query1Props = {
    url: list1Props.url,
    listName: list1Props.name,
    btns: {
      formatValues(values) {
        if (values.dates) {
          values.from = formatDate(values.dates[0]); //改成别名
          values.to = formatDate(values.dates[1]);
        }
        return values;
      }
    },
    controls: [
      [
        {
          name: "name",
          control: <Input placeholder="专辑名称" style={{ width: 200 }}></Input>
        },
        {
          name: "mobile",
          control: <Input placeholder="手机号" style={{ width: 200 }}></Input>
        },
        { name: "dates", control: <RangePicker /> }
      ],
      [
        {
          name: "state",
          control: (
            <Select name="state" style={{ width: 200 }}>
              <Option value="0">状态</Option>
              <Option value="1">永久禁用</Option>
              <Option value="2">正常</Option>
              <Option value="3">警告</Option>
            </Select>
          ),
          params: { initialValue: "0" }
        },
        "search" //查询按钮占位符
      ]
    ],
    callback: (response) => {
      dispatch({
        type: "templateList/callback",
        payload: response
      });
      dispatch({
        type: "templateList/callbackSuccess"
      });
    }
  };
  //Btns组件属性
  const btnsProps = {
    btns: [
      {
        type: "create",
        data: {
          params: { modalName: modalProps.attrs.name }
        }
      },
      {
        type: "export",
        data: {
          url: "download/appHotRankList",     //导出CSV文件
          params: { type: "anchor_today" }
        }
      },
      {
        type: "text",
        onClick: () => {
          dispatch({
            type: TEMPLATE_MODEL.CREATE,
            payload: { modalName: tabModalProps.attrs.name }
          });
        },
        icon: "tags",
        text: "查看"
      }
    ]
  };
  //Query组件属性（表单形式）
  const query2Props = {
    url: list2Props.url,
    listName: list2Props.name,
    type: "form",
    controls: [
      {
        label: "专辑",
        name: "name",
        control: <Input style={{ width: 200 }}></Input>
      },
      {
        label: "手机",
        name: "mobile",
        control: <Input style={{ width: 200 }}></Input>
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
      }
    ]
  };
  const query3Props = {
    url: list3Props.url,
    listName: list3Props.name,
    controls: [
      [
        {
          name: "name",
          control: <Input placeholder="专辑名称" style={{ width: 200 }}></Input>
        },
        "search" //查询按钮占位符
      ]
    ]
  };

  function revoke(selectedItem, listProps) {
    dispatch({
      type: TEMPLATE_MODEL.HANDLE,
      payload: {
        params: {
          ids: selectedItem.selectedRowKeys
        },
        url: api.templateCreate,
        initUrl: listProps.url,
        listName: listProps.name,
        // type: 'create'
      }
    });
  }
  //Batch组件属性
  const batch1Props = {
    listName: list1Props.name,
    initControl: (selectedItem) => (
      <>
        <span>已选择条{selectedItem.selectedRowKeys.length}记录</span>
        <Button
          icon="check"
          style={{ marginLeft: 10 }}
          onClick={() => revoke(selectedItem, list1Props)}
        >
          撤销
        </Button>
        <Button icon="close" style={{ marginLeft: 10 }} type="danger">
          禁用
        </Button>
      </>
    ),
    affix: {
      offsetTop: 0
    }
  };
  const batch3Props = {
    listName: list3Props.name,
    initControl: (selectedItem) => (
      <>
        <span>已选择条{selectedItem.selectedRowKeys.length}记录</span>
        <Button
          icon="check"
          style={{ marginLeft: 10 }}
          onClick={() => revoke(selectedItem, list3Props)}
        >
          批量通过
        </Button>
      </>
    )
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
        initUrl: list1Props.url,
        listName: list1Props.name
      }
    });
  }
  return (
    <>
      <Prompt {...promptProps}></Prompt>
      <Btns {...btnsProps}></Btns>
      <SelectTabs {...tabsProps}></SelectTabs>
      <CreateModal {...modalProps}></CreateModal>
      <TabModal {...tabModalProps}></TabModal>
    </>
  );
};

export default connect((data) => data.templateList)(ListDemo);
