/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-04-23 14:08:42
 * @LastEditTime: 2021-09-06 11:36:21
 * @Description: 按日来统计的信息
 * @FilePath: /strick/shin-admin/src/pages/monitor/dashboard/components/Date.js
 */
import Query from "components/Common/Template/List/Query";
import { Row, Col, Select, DatePicker, Table } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import { MONITOR_PROJECT } from 'utils/constants';
import { formatDate, setColumn, breakWord } from "utils/tools";
import api from "api";
const { Option } = Select;
const DateDashboard = ({ dispatch, dateStatis, dateLoading }) => {
  //不可选择的日期，即大于等于今天的日期
  const disabledDate = current => {
    const end = ~~formatDate(current, "YYYYMMDD");
    const today = ~~formatDate(moment(), "YYYYMMDD");
    return end >= today;
  };
  const queryProps = {
    url: api.monitorDate,
    btns: {
      formatValues(values) {
        values.date = formatDate(values.date, "YYYYMMDD");
        return values;
      }
    },
    controls: [
      [
        {
          name: "project",
          control: (
            <Select name="project" style={{ width: 200 }} placeholder="项目">
              <Option value="">项目</Option>
              {
                MONITOR_PROJECT.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
              }
            </Select>
          ),
          params: {
            rules: [{ required: true, message: "请选择项目" }],
          }
        },
        { 
          name: "date", 
          control: <DatePicker disabledDate={disabledDate} />,
          params: {
            rules: [{ required: true, message: "请选择日期" }],
          }
        },
        "search" //查询按钮占位符
      ],
    ],
    callback: (response) => {
      const { data } = response;
      const { error504=[] } = data;
      dispatch({
        type: 'monitorDashboard/setDateStatis',
        payload: {
          list: error504.map( item => ({path: item[0], number: item[1]})),
        },
      });
    }
  };
  //表格头
  const columns = [
    setColumn('路径', 'path', { render: breakWord }),
    setColumn('次数', 'number'),
  ];
  return <>
    <Query {...queryProps}></Query>
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Table columns={columns} dataSource={dateStatis} loading={dateLoading} rowKey="path" />
      </Col>
    </Row>
  </>;
};
export default connect(data => data.monitorDashboard)(DateDashboard);