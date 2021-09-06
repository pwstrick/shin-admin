/*
 * @Author: strick
 * @Date: 2021-01-26 17:22:19
 * @LastEditTime: 2021-09-06 11:51:42
 * @LastEditors: strick
 * @Description: 性能监控项目
 * @FilePath: /strick/shin-admin/src/pages/monitor/project/index.js
 */
/* eslint-disable */
import { Input, Popconfirm } from 'antd';
import { connect } from 'dva';
import Btns from "components/Common/Template/List/Btns";
// import Query from "components/Common/Template/List/Query";
import List from "components/Common/Template/List/List";
import CreateModal from "components/Common/Template/CreateModal";
import { setColumn, breakWord } from "utils/tools";
import { TEMPLATE_MODEL } from "utils/constants";
import api from "api";

const Project = ({ dispatch }) => {
  //CreateModal组件属性
  const modalProps = {
    url: api.monitorPerformanceProjectCreate,
    initUrl: api.monitorPerformanceProjectList,
    attrs: {
      name: "add",
      width: 800,
      title: "创建项目"
    },
    initControls: (record) => [
      {
        label: "项目",
        name: "name",
        params: {
          rules: [
            { required: true, message: "项目不能为空" },
          ],
          initialValue: record.name
        },
        control: <Input />
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
   * 删除项目
   */
  function del(id) {
    dispatch({
      type: TEMPLATE_MODEL.HANDLE,
      payload: {
        params: { id },
        url: api.monitorPerformanceProjectDel,
        initUrl: listProps.url,
      }
    });
  }

  //List组件属性
  const listProps = {
    url: api.monitorPerformanceProjectList,
    columns: [
      setColumn("key", "key", { width: "40%", render: breakWord }),
      setColumn("项目", "name", { width: "40%", render: breakWord }),
      setColumn("操作", "id", {
        key: "operate",
        render: (id, record) => {
          return (
            <div>
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
  
  return (
    <>
      <Btns {...btnsProps}></Btns>
      <CreateModal {...modalProps}></CreateModal>
      <List {...listProps}></List>
    </>
  );
};

export default connect(data => data.monitorProject)(Project);