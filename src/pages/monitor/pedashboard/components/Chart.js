/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-03-23 16:25:53
 * @LastEditTime: 2021-09-06 11:44:44
 * @Description: 
 * @FilePath: /strick/shin-admin/src/pages/monitor/pedashboard/components/Chart.js
 */
/* eslint-disable */
import { useEffect, useState } from "react";
import { DatePicker, Row, Col, Spin, Select, Statistic, Card } from 'antd';
import Query from "components/Common/Template/List/Query";
import moment from 'moment';
import { connect } from 'dva';
import api from "api";
import { formatDate } from "utils/tools";
import { COLORS } from "utils/constants";
require('components/Common/Chart');
const { Option } = Select;
const { RangePicker } = DatePicker;

const PedashboardChart = ({ dispatch, projectList, statistic }) => {
  // 图表变量
  const [charts, setCharts] = useState({})
  /**
  * https://chartjs.bootcss.com/docs/
  * Chart 文档说明
  */
  const fillChart = ({ id, labels, params }) => {
    const currentDataSets = [];
    params.forEach(value => {
      currentDataSets.push({
        ...value.datasets,
        fill: false,
        lineTension: 0,
        borderWidth: 2,
      });
    });
    return new Chart(document.getElementById(id), {
      type: 'line',
      data: {
        labels,
        datasets: currentDataSets
      },
      options: {
        legend: {
          //点击标题填充列表
          onClick: function (e, legendItem) {
            dispatch({
              type: 'monitorPeDashboard/getPerformanceListSuccess',
              payload: {
                performanceList: params[legendItem.datasetIndex].list
              },
            });
          },
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem) {
              const list = params[tooltipItem.datasetIndex].list;
              if(!list[tooltipItem.index].id)
                return;
              return [
                formatDate(list[tooltipItem.index].ctime),
                'id: ' + list[tooltipItem.index].id,
                'duration: ' + tooltipItem.yLabel
              ];
            }
          }
        }
      }
    });
  }
  /**
   * 四舍五入一位小数
   */
  function round(number) {
    return Math.round(number / 100) / 10;
  }
  function round2(number) {
    return Math.round(number * 10) / 10;
  }
  // let loadChart, readyChart, paintChart, screenChart;
  /**
   * 销毁图表
   */
  function destroyChart() {
    if(!charts.loadChart)
      return;
    charts.loadChart.destroy();
    charts.readyChart.destroy();
    charts.paintChart.destroy();
    charts.screenChart.destroy();
  }
  useEffect(() => {
    // 过滤掉没有统计信息的数据
    const existStatistic = statistic.filter(value => value.x.length > 0);
    if(existStatistic.length === 0)
      return;
    const x = Object.values(existStatistic[0].x);
    const loadDataSets = [],
      readyDataSets = [],
      paintDataSets = [],
      screenDataSets = [];
    const accumulator = (number, current) => number + current;    //累计函数
    const zero = value => value !== 0;   //过滤0的元素
    existStatistic.forEach((statis, index) => {
      const color = COLORS[index % 9];
      const formatLoads = Object.values(statis.load).map(value => value !== 0 ? round(value.load) : value);  //格式化
      let average = formatLoads.reduce(accumulator);    //平均值
      statis.load.length > 0 && loadDataSets.push({
        datasets: {
          label: `${statis.day}页面加载总时间 平均：${round2(average / formatLoads.filter(zero).length)}`,
          data: formatLoads, 
          borderColor: color,
        },
        list: statis.load
      });
      const formatReadys = Object.values(statis.ready).map(value => value !== 0 ? round(value.ready) : value);
      average = formatReadys.reduce(accumulator);
      statis.ready.length > 0 && readyDataSets.push({
        datasets: {
          label: `${statis.day}用户可操作时间 平均：${round2(average / formatReadys.filter(zero).length)}`,
          data: formatReadys, 
          borderColor: color,
        },
        list: statis.ready
      });
      const formatPaints = Object.values(statis.paint).map(value => value !== 0 ? round(value.paint) : value);
      average = formatPaints.reduce(accumulator);
      statis.paint.length > 0 && paintDataSets.push({
        datasets: {
          label: `${statis.day}白屏时间 平均：${round2(average / formatPaints.filter(zero).length)}`,
          data: formatPaints, 
          borderColor: color,
        },
        list: statis.paint
      });
      const formatScreens = Object.values(statis.screen).map(value => value !== 0 ? round(value.screen) : value);
      average = formatScreens.reduce(accumulator);
      statis.screen.length > 0 && screenDataSets.push({
        datasets: {
          label: `${statis.day}首屏时间 平均：${round2(average / formatScreens.filter(zero).length)}`,
          data: formatScreens, 
          borderColor: color,
        },
        list: statis.screen
      });
    });
    charts.loadChart = fillChart({ 
      id: "dayLoad", 
      labels: x, 
      params: loadDataSets
    });
    charts.readyChart = fillChart({ 
      id: "dayReady", 
      labels: x, 
      params: readyDataSets
      // borderColor: "#7cb305",
    });
    charts.paintChart = fillChart({ 
      id: "dayPaint", 
      labels: x, 
      params: paintDataSets
      // borderColor: "#096dd9",
    });
    charts.screenChart = fillChart({ 
      id: "dayScreen", 
      labels: x, 
      params: screenDataSets
      // borderColor: "#d4b106",
    });
    // setCharts(charts);
    return () => {
      //组件卸载时销毁
      destroyChart();
    };
  }, [statistic]);

  //不可选择的日期，即大于今天的日期
  const disabledDate = current => {
    const end = ~~formatDate(current, "YYYYMMDD");
    const today = ~~formatDate(moment(), "YYYYMMDD");
    return end > today;
  };
  const hours = [];
  for(let i=0; i<24; i++)
    hours.push(i);
  const queryProps = {
    url: api.monitorPerformanceStatistic,
    btns: {
      formatValues(values) {
        if (values.day) {
          values.start = formatDate(values.day[0], "YYYYMMDD");  //格式化
          values.end = formatDate(values.day[1], "YYYYMMDD");  //格式化
        }
        delete values.day;
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
                projectList.map(item => <Option value={item.key} key={item.key}>{item.name}</Option>)
              }
            </Select>
          ),
          params: {
            rules: [{ required: true, message: "请选择项目" }],
          },
        },
        { 
          name: "day", 
          control: <RangePicker disabledDate={disabledDate} />,
          params: {
            rules: [{ required: true, message: "请选择日期" }],
          },
        },
        {
          name: "hour",
          control: (
            <Select name="hour" style={{ width: 100 }} placeholder="小时">
              <Option value="">小时</Option>
              {
                hours.map(item => <Option value={item} key={item}>{item}</Option>)
              }
            </Select>
          ),
        },
        "search" //查询按钮占位符
      ]
    ],
    callback: (response) => {
      destroyChart();
      dispatch({
        type: 'monitorPeDashboard/querySuccess',
        payload: {
          statistic: response.data,
        },
      });
    }
  };
  return (<Spin spinning={loading}>
    <div style={{marginBottom: 20}}>
      {/* {COLORS.map(value => <div style={{backgroundColor:value, width:50, height: 20}}></div>)} */}
      <Query {...queryProps}></Query>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card>
            <Statistic title="未执行load事件的数量" value={
              statistic.length > 0 ? 
              statistic.reduce((accumulator, current) => (accumulator + current.loadZero), 0) : 
              0
            } />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic title="日志总数" value={
              statistic.length > 0 ? 
              statistic.reduce((accumulator, current) => (accumulator + current.all), 0) : 
              0
            } />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <canvas id="dayLoad" height="100"></canvas>
        </Col>
        <Col span={24}>
          <canvas id="dayReady" height="100"></canvas>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <canvas id="dayPaint" height="100"></canvas>
        </Col>
        <Col span={24}>
          <canvas id="dayScreen" height="100"></canvas>
        </Col>
      </Row>
    </div>
  </Spin>);
};

export default connect(data => data.monitorPeDashboard)(PedashboardChart);