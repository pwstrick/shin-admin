/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-04-01 18:11:45
 * @LastEditTime: 2021-09-06 11:36:34
 * @Description: 
 * @FilePath: /strick/shin-admin/src/pages/monitor/log/components/Chart.js
 */
/* eslint-disable */
import { useEffect, useState } from "react";
import { connect } from 'dva';
import { Spin, Row, Col } from 'antd';
require('components/Common/Chart');
const ChartList = ({ chartListStatis, loading }) => {
  // 柱状图
  const [ charts, setCharts] = useState({})
  const fillChart = ({ id, label, labels, data, backgroundColor }) => {
    return new Chart(document.getElementById(id), {
      type: "bar",
      data: {
        labels,
        options: {
          // maintainAspectRatio: false,
          // responsive: false,
        },
        datasets: [
          {
            label,
            data,
            backgroundColor,
            fill: false,
            // lineTension: 0,
            // borderWidth: 2
          }
        ]
      }
    });
  };

  /**
   * 销毁图表
   */
  function destroyChart() {
    charts.logChart && charts.logChart.destroy();
  }
  /**
   * 创建图表
   */
  useEffect(() => {
    destroyChart();
    // console.log("logChart", logChart, chartListStatis);
    if(!chartListStatis.x)
      return;
    const x = Object.values(chartListStatis.x);
    charts.logChart = fillChart({ 
      id: "log", 
      label: '日志数量趋势图', 
      labels: x, 
      data: Object.values(chartListStatis.y), 
      backgroundColor: "rgb(75, 192, 192)",
    });
    // setCharts(charts);
    // logChart.canvas.parentNode.style.height = '40vh';
    return () => {
      //组件卸载时销毁
      destroyChart();
    };
  }, [chartListStatis]);
  return <Spin spinning={loading}>
    <Row gutter={[16, 16]}>
      <Col span={24} >
        <canvas id="log" height="80"></canvas>
      </Col>
    </Row>
  </Spin>;
};  
export default connect(data => data.monitorList)(ChartList);