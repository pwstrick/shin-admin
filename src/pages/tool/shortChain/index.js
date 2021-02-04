/*
 * @Author: strick
 * @Date: 2021-01-18 17:52:30
 * @LastEditTime: 2021-02-02 15:15:33
 * @LastEditors: strick
 * @Description: 短链服务
 * @FilePath: /strick/shin-admin/src/pages/tool/shortChain/index.js
 */
import { connect } from 'dva';
import {
  Input,
  Divider,
  Popconfirm
} from "antd";
import Btns from "components/Common/Template/List/Btns";
import Query from "components/Common/Template/List/Query";
import List from "components/Common/Template/List/List";
import CreateModal from "components/Common/Template/CreateModal";
import { setColumn, setValueByNodeEnv } from "utils/tools";
import { TEMPLATE_MODEL } from "utils/constants";
import api from "api";
/* eslint-disable */
const ShortChain = ({ dispatch }) => {
  //TODO 短链域名可自定义
  const getCompleteUrl = (short) => setValueByNodeEnv({
    test: `https://test-s.pwstirck.com/c/${short}`,
    pre: `https://pre-s.pwstirck.comc/${short}`,
    pro: `https://s.pwstirck.com/c/${short}`
  });
  //CreateModal组件属性
  const modalProps = {
    url: api.shortChainCreate,
    initUrl: api.shortChainQuery,
    attrs: {
      name: "add",
      width: 800,
      title: "短链处理"
    },
    initControls: (record) => [
      {
        label: "原始地址",
        name: "url",
        params: {
          rules: [
            { required: true, message: "地址不能为空" },
            { 
              pattern: /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i, 
              message: "地址格式不正确"
            }
          ],
          initialValue: record.url
        },
        control: <Input />
      },
      {
        label: "短链地址",
        name: "short",
        control: <span>{record.short ? getCompleteUrl(record.short) : "在创建时为空，而在编辑时会展示生成的短链"}</span>
      },
    ]
  };
  //顶部按钮
  const btnsProps = {
    btns: [
      {
        type: "create",
        data: {
          params: { modalName: modalProps.attrs.name }
        }
      }
    ]
  };
  /**
   * 编辑短链
   */
  function edit(record) {
    dispatch({
      type: TEMPLATE_MODEL.MODAL,
      payload: {
        params: record,
        modalName: modalProps.attrs.name
      }
    });
  }
  /**
   * 删除短链
   */
  function del(id) {
    dispatch({
      type: TEMPLATE_MODEL.HANDLE,
      payload: {
        params: { id },
        url: api.shortChainDel,
        initUrl: listProps.url,
      }
    });
  }
  //List组件属性
  const listProps = {
    url: api.shortChainQuery,
    columns: [
      setColumn("短链地址", "short", { width: "40%", render: (text, record) => {
        //拼接地址和参数
        let url = getCompleteUrl(text);
        //换行
        return <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          <a href={url} target="_blank">{url}</a>
        </div>;
      }}),
      setColumn("原始地址", "url", { width: "40%", render: (text, record) => {
        return <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
          <a href={text} target="_blank">{text}</a>
        </div>;
      }}),
      setColumn("操作", "id", {
        key: "operate",
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
  };
  //Query组件属性
  const queryProps = {
    url: listProps.url,
    controls: [
      [
        {
          name: "short",
          control: <Input placeholder="短链地址" style={{ width: 200 }}></Input>
        },
        {
          name: "url",
          control: <Input placeholder="原始地址" style={{ width: 200 }}></Input>
        },
        "search" //查询按钮占位符
      ]
    ]
  };
  return (
    <>
      <Btns {...btnsProps}></Btns>
      <CreateModal {...modalProps}></CreateModal>
      <Query {...queryProps}></Query>
      <List {...listProps}></List>
    </>
  );
};
export default connect(data => data.ShortChain)(ShortChain);