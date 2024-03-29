/*
 * @Author: strick
 * @Date: 2021-01-26 17:22:19
 * @LastEditTime: 2022-12-28 17:08:06
 * @LastEditors: strick
 * @Description: 
 * @FilePath: /strick/shin-admin/src/pages/monitor/pedashboard/index.js
 */
/* eslint-disable */
import { connect } from 'dva';
import { Table, Input } from 'antd';
import { setColumn, formatJsonInPre, formatDate } from 'utils/tools';
import Prompt from 'components/Common/Template/Prompt';
import Query from 'components/Common/Template/List/Query';
import api from 'api/index';
import ChartDashboard from './components/Chart';
import Waterfall from './components/Waterfall';
import Flow from './components/Flow';

function Pedashboard({
  dispatch, performanceList, resourceList, isShowWaterfall, measure
}) {
  const queryProps = {
    url: api.monitorPerformanceGet,
    controls: [
      [
        {
          name: 'id',
          control: <Input placeholder="性能日志编号" style={{ width: 200 }} />,
        },
        'search',
      ],
    ],
    callback: (response) => {
      if (!response.data) return;
      const {
        resource, paint, screen, timing,
      } = response.data;
      const originalTiming = JSON.parse(timing);
      resource && dispatch({
        type: 'monitorPeDashboard/showWaterfall',
        payload: {
          isShowWaterfall: true,
          resourceList: JSON.parse(resource),
          measure: {
            paint,
            screen,
            ready: originalTiming.domContentLoadedEventStart,
            load: originalTiming.loadEventStart,
          },
        },
      });
    },
  };
  const onShowFall = ({ resource, paint, screen }) => {
    resource && dispatch({
      type: 'monitorPeDashboard/showWaterfall',
      payload: { 
        isShowWaterfall: true, 
        resourceList: JSON.parse(resource),
        measure: { paint, screen },
      },
    });
    setTimeout(() => {
      const element = document.getElementById('waterfall');
      element && window.scrollTo({
        top: (window.scrollY + element.getBoundingClientRect().top - 50),
        behavior: 'smooth',
      });
    }, 500);
  };
  // 表格头
  const columns = [
    setColumn('编号', 'id', {
      width: '15%',
      render: (value, record) => (
        <>
          <p>
            id:
            {value}
          </p>
          <p>{formatDate(record.ctime, 'MM-DD HH:mm:ss')}</p>
          <p>
            hour:
            {record.hour}
          </p>
          <p>
            minute:
            {record.minute}
          </p>
        </>
      ),
    }),
    setColumn('参数', 'project', {
      width: '20%',
      render: (value, record) => (
        <>
          <p>
            load:
            {record.load}
          </p>
          <p>
            ready:
            {record.ready}
          </p>
          <p>
            paint:
            {record.paint}
          </p>
          <p>
            screen:
            {record.screen}
          </p>
          <p>{record.identity}</p>
          <p>{record.referer}</p>
          { record.resource ? <a onClick={() => onShowFall(record)}>资源瀑布图</a> : null}
        </>
      ),
    }),
    setColumn('其他参数', 'measure', {
      width: '25%',
      render: (value, record) => formatJsonInPre(JSON.parse(record.measure)),
    }),
    setColumn('原始参数', 'timing', {
      width: '20%',
      render: (value) => formatJsonInPre(JSON.parse(value)),
    }),
    setColumn('代理', 'ua', {
      width: '20%',
      render: (value) => formatJsonInPre(JSON.parse(value)),
    }),
  ];

  // 提示说明
  const promptProps = {
    message: '使用需知',
    description: <>
      <div>参数一列中包含：</div>
      <p>页面加载总时间（load）、用户可操作时间（ready）、白屏时间（paint）、首屏时间（screen）、日志创建时间、身份标识、来源地址</p>
      <div>其他参数一列中包含：</div>
      <div>
        <div>重定向：准备新页面耗时（readyStart）、重定向次数（redirectCount）、重定向的时间（redirectTime）</div>
        <div>DNS查询：DNS缓存耗时（appcacheTime）、DNS查询耗时（lookupDomainTime）</div>
        <div>TCP连接：SSL连接耗时（connectSslTime）、TCP连接耗时（connectTime）</div>
        <div>数据传输：开始请求文档到开始接收文档的时间（requestDocumentTime）、接收文档内容传输耗时（responseDocumentTime）、读取到页面首字节的时间（TTFB）、传输内容压缩百分比（compression）、内容加载完成的时间（requestTime）</div>
        <p>解析渲染：首次可交互时间（interactiveTime）、解析DOM树结构的时间（parseDomTime）、请求完毕至DOM加载耗时（initDomTreeTime）、Unload事件耗时（unloadEventTime）、load事件耗时（loadEventTime）</p>
      </div>
      <div>注意：数据只保留四周</div>
    </>,
  };
  const prompt2Props = {
    message: '资源瀑布图',
  };
  const prompt3Props = {
    message: '各阶段时序图',
    description: <>
      <div>当没有选择时间范围时，默认范围是一天</div>
      <div>橙色竖线表示白屏时间，黑色竖线表示首屏时间</div>
      <div>TTFB &gt;= redirectTime + appcacheTime + lookupDomainTime + connectTime + requestDocumentTime</div>
      <div>因为 requestStart 和 connectEnd 之间的时间没有算，即 TCP 连接建立后到发送请求这段时间</div>
    </>,
  };
  return (
    <>
      <ChartDashboard />
      <Table columns={columns} dataSource={performanceList} rowKey="id" pagination={false} style={{ marginBottom: 20 }} />
      <Prompt {...prompt2Props} />
      <Query {...queryProps} />
      {isShowWaterfall ? <Waterfall resource={resourceList} measure={measure} /> : null}
      <Prompt {...prompt3Props} />
      <Flow />
      <Prompt {...promptProps} />
      {/* <TabModal {...tabProps} /> */}
    </>
  );
}

export default connect((data) => data.monitorPeDashboard)(Pedashboard);