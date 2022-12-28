/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2022-07-07 11:34:32
 * @LastEditTime: 2022-12-28 17:07:29
 * @Description: 资源瀑布图
 * @FilePath: /strick/shin-admin/src/pages/monitor/pedashboard/components/Waterfall.js
 */
/* eslint-disable */
import { useEffect, useState } from 'react';
import { connect } from 'dva';

require('components/Common/Chart');

function Waterfall({ resource, measure }) {
  // 图表变量
  const [charts] = useState({});
  /**
  * https://chartjs.bootcss.com/docs/
  * Chart 文档说明
  */
  const fillChart = ({ id }) => {
    const labels = [];
    const data = [];
    // 会有空对象传进来
    if (!resource.forEach) return;
    destroyChart();
    // 过滤掉没有统计信息的数据
    resource.forEach((value) => {
      const url = new URL(value.name);
      const path = url.pathname.split('/');
      const name = path[path.length - 1];
      labels.push(name);
      data.push([value.startTime, value.startTime + value.duration]);
    });
    return new Chart(document.getElementById(id), {
      type: 'horizontalBar',
      data: {
        labels,
        datasets: [
          {
            backgroundColor: '#F60',
            borderColor: '#F60',
            borderWidth: 1,
            type: 'line',
            label: '白屏时间',
            data: [{
              x: measure.paint,
              y: 0,
            }, {
              x: measure.paint,
              y: 1000,
            }],
          },
          {
            backgroundColor: '#FC0',
            borderColor: '#FC0',
            borderWidth: 1,
            type: 'line',
            label: 'DOMContentLoaded',
            data: [{
              x: measure.ready,
              y: 0,
            }, {
              x: measure.ready,
              y: 1000,
            }],
          },
          {
            backgroundColor: '#7cb305',
            borderColor: '#7cb305',
            borderWidth: 1,
            type: 'line',
            label: 'load',
            data: [{
              x: measure.load,
              y: 0,
            }, {
              x: measure.load,
              y: 1000,
            }],
          },
          {
            backgroundColor: '#000',
            borderColor: '#000',
            borderWidth: 1,
            type: 'line',
            label: '首屏时间',
            data: [{
              x: measure.screen,
              y: 0,
            }, {
              x: measure.screen,
              y: 1000,
            }],
          },
          {
            backgroundColor: 'rgb(54, 162, 235)',
            label: '资源瀑布图',
            data,
          },
        ],
      },
      options: {
        // maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [{ ticks: { beginAtZero: true } }],
          // yAxes: [{ ticks: { beginAtZero: true } }],
        },
        tooltips: {
          callbacks: {
            // 聚焦时显示的信息
            label(tooltipItem) {
              switch (tooltipItem.datasetIndex) {
                // case 0: {
                //   if (tooltipItem.xLabel === measure.paint) { return [`paint：${measure.paint}`]; }
                //   break;
                // }
                case 0:
                  return [`paint：${measure.paint}`];
                case 1:
                  return [`DOMContentLoaded：${measure.ready}`];
                case 2:
                  return [`load：${measure.load}`];
                case 3:
                  return [`screen：${measure.screen}`];
                default:
                  return [
                    resource[tooltipItem.index].name,
                    resource[tooltipItem.index].duration,
                    tooltipItem.value,
                  ];
              }
            },
          },
        },
      },
    });
  };
  /**
   * 销毁图表
   */
  function destroyChart() {
    if (!charts.waterfall) return;
    charts.waterfall.destroy();
  }
  useEffect(() => {
    charts.waterfall = fillChart({ id: 'waterfall' });
    // setCharts(charts);
    return () => {
      // 组件卸载时销毁
      destroyChart();
    };
  }, [resource]);
  return <canvas id="waterfall" height="150" />;
}

export default connect((data) => data.monitorPeDashboard)(Waterfall);
