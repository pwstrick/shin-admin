/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-03-04 10:56:45
 * @LastEditTime: 2021-09-06 11:49:53
 * @Description: 上下文预览中的列表
 * @FilePath: /strick/shin-admin/src/pages/monitor/log/components/ContextList.js
 */
/* eslint-disable */
import { useEffect } from 'react';
import { Button, Table, Row } from 'antd';
import { connect } from 'dva';
import { setColumn, formatDate } from 'utils/tools';
import styles from "./index.less";
const ContextList = ({ dispatch, record, parseMessage, state }) => {
  const { contextList, loading, prevId, nextId } = state;
  useEffect(() => {
    record.id && dispatch({
      type: "monitorList/initContext",
      payload: {
        record: [record],
        prevId: +record.id,
        nextId: +record.id,
      }
    });
  }, [record.id]);
  // 列的信息
  const columns = [
    setColumn("编号", "id", { width: "150px" }),
    setColumn('项目', 'project', { width: '150px', render: (value, record) => <>
      <p>{value}</p>
      <p>{formatDate(record.ctime, 'MM-DD HH:mm:ss')}</p>
      <p>{record.source}</p>
      <p>{record.identity}</p>
    </> }),
    setColumn("类别", "category", { width: "100px" }),
    setColumn("内容", "message", {
      width: "60%",
      render: (value, record) => parseMessage(record)
    })
  ];
  // 行的样式
  const rowClassName = (item) => {
    if(item.id === record.id) 
      return styles["current-row"];
    return "";
  };
  //上10条
  const prev = () => {
    dispatch({
      type: "monitorList/context",
      payload: {
        prevId: prevId - 10
      }
    });
  };
  //下10条
  const next = () => {
    dispatch({
      type: "monitorList/context",
      payload: {
        nextId: nextId + 10
      }
    });
  };
  return (
    <>
      <Row type="flex" justify="center" style={{marginBottom: 10}}>
        <Button onClick={prev}>前面10条</Button>
      </Row>
      <Table
        width="100%"
        columns={columns}
        dataSource={contextList}
        loading={loading}
        pagination={false}
        rowClassName={rowClassName}
      />
      <Row type="flex" justify="center" style={{marginTop: 10}}>
        <Button onClick={next}>后面10条</Button>
      </Row>
    </>
  );
};

export default connect(data => ({ state: data.monitorList}))(ContextList);