/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-03-17 14:30:20
 * @LastEditTime: 2021-09-06 11:33:13
 * @Description: 图表趋势
 * @FilePath: /strick/shin-admin/src/pages/monitor/dashboard/components/Chart.js
 */
/* eslint-disable */
import { useEffect, useState } from "react";
import { Row, Col, Select, DatePicker, Spin } from 'antd';
import Query from "components/Common/Template/List/Query";
import moment from 'moment';
import { MONITOR_PROJECT } from 'utils/constants';
import api from "api";
import { formatDate } from "utils/tools";
require('components/Common/Chart');
import { connect } from 'dva';
const { Option } = Select;
const { RangePicker } = DatePicker;
const ChartDashboard = ({ dispatch, chart, chartLoading }) => {
    // 图表变量
    const [charts, setCharts] = useState({})
    const {
      daysErrorHash={},
      days500ErrorHash={},
      days502ErrorHash={},
      days504ErrorHash={},
      daysAllCountHash={}
    } = chart;
    const fillChart = ({ id, label, labels, data, borderColor }) => {
      return new Chart(document.getElementById(id), {
        type: 'line',
        data: {
          labels,
          datasets: [{
            label,
            data,
            borderColor,
            fill: false,
            lineTension: 0,
            borderWidth: 2,
          }]
        },
      });
    }
    // console.log("charts", charts)
    /**
     * 销毁图表
     */
    function destroyChart() {
      if(!charts.chartError)
        return;
      // console.log("destroyChart");
      charts.chartError.destroy();
      charts.chart500.destroy();
      charts.chart502.destroy();
      charts.chart504.destroy();
      charts.chartAll.destroy();
      // setCharts(charts);
    }
    useEffect(() => {
      /**
       * https://chartjs.bootcss.com/docs/
       * Chart 文档说明
       */
      const errorX = Object.keys(daysErrorHash),
        errorY = Object.values(daysErrorHash);
      if(errorX.length === 0)
        return;
      // console.log("createChart");
      charts.chartError = fillChart({ 
        id: "error", 
        label: "错误趋势图", 
        labels: errorX, 
        data: errorY, 
        borderColor: "rgb(75, 192, 192)" 
      });
      charts.chart500 = fillChart({ 
        id: "error500", 
        label: "500错误趋势图", 
        labels: Object.keys(days500ErrorHash), 
        data: Object.values(days500ErrorHash), 
        borderColor: "#7cb305" 
      });
      charts.chart502 = fillChart({ 
        id: "error502", 
        label: "502错误趋势图", 
        labels: Object.keys(days502ErrorHash), 
        data: Object.values(days502ErrorHash), 
        borderColor: "#096dd9" 
      });
      charts.chart504 = fillChart({ 
        id: "error504", 
        label: "504错误趋势图", 
        labels: Object.keys(days504ErrorHash), 
        data: Object.values(days504ErrorHash), 
        borderColor: "#d4b106" 
      });
      charts.chartAll = fillChart({ 
        id: "all", 
        label: "日志总数趋势图", 
        labels: Object.keys(daysAllCountHash), 
        data: Object.values(daysAllCountHash), 
        borderColor: "#ff7a45" 
      });
      // setCharts(charts);
      return () => {
        //组件卸载时销毁
        destroyChart();
      };
    }, [chart]);

    //不可选择的日期，即大于等于今天的日期
    const disabledDate = current => {
      const end = ~~formatDate(current, "YYYYMMDD");
      const today = ~~formatDate(moment(), "YYYYMMDD");
      return end >= today;
    };
    const queryProps = {
      url: api.monitorChart,
      btns: {
        formatValues(values) {
          if (values.dates) {
            values.start = formatDate(values.dates[0], "YYYYMMDD"); //改成别名
            values.end = formatDate(values.dates[1], "YYYYMMDD");
            delete values.dates;
          }
          return values;
        }
      },
      controls: [
        [
          {
            name: "project",
            control: (
              <Select name="project" style={{ width: 200 }} placeholder="项目">
                {
                  MONITOR_PROJECT.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
                }
              </Select>
            ),
          },
          { name: "dates", control: <RangePicker disabledDate={disabledDate} /> },
          "search" //查询按钮占位符
        ]
      ],
      callback: (response) => {
        destroyChart();
        dispatch({
          type: 'monitorDashboard/chartSuccess',
          payload: {
            chart: response.data,
          },
        });
      }
    };
    return (<Spin spinning={chartLoading}>
      <Query {...queryProps}></Query>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <canvas id="error"></canvas>
        </Col>
        <Col span={12}>
          <canvas id="error500"></canvas>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <canvas id="error502"></canvas>
        </Col>
        <Col span={12}>
          <canvas id="error504"></canvas>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <canvas id="all"></canvas>
        </Col>
      </Row>
    </Spin>);
  };
  
  export default connect(data => data.monitorDashboard)(ChartDashboard);