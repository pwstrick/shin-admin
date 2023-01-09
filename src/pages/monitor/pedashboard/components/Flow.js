/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2022-07-25 14:06:51
 * @LastEditTime: 2023-01-09 15:43:14
 * @Description: 时序流程图
 * @FilePath: /strick/shin-admin/src/pages/monitor/pedashboard/components/Flow.js
 */
import { connect } from 'dva';
import {
  Input, Tooltip, DatePicker, Cascader,
} from 'antd';
import Query from 'components/Common/Template/List/Query';
import api from 'api/index';
import { setColumn, formatDate, breakWord } from 'utils/tools';
import List from 'components/Common/Template/List/List';
import { COLORS, MONITOR_PERFORMANCE_CASCADER } from 'utils/constants';

const { RangePicker } = DatePicker;
const flowColors = ['TTFB', 'responseDocumentTime', 'initDomTreeTime', 'parseDomTime', 'loadEventTime'];
function Flow() {
  const getInfo = (record) => {
    const measure = JSON.parse(record.measure);
    return (
      <div>
        <div>
          readyStart：
          {measure.readyStart}
        </div>
        <div>
          unloadEventTime：
          {measure.unloadEventTime}
        </div>
        <div>
          redirectTime：
          {measure.redirectTime}
        </div>
        <div>
          appcacheTime：
          {measure.appcacheTime}
        </div>
        <div>
          lookupDomainTime：
          {measure.lookupDomainTime}
        </div>
        <div>
          connectTime：
          {measure.connectTime}
        </div>
        <p>
          requestDocumentTime：
          {measure.requestDocumentTime}
        </p>
        <div>
          TTFB：
          {measure.TTFB}
        </div>
        <div>
          responseDocumentTime：
          {measure.responseDocumentTime}
        </div>
        <div>
          initDomTreeTime：
          {measure.initDomTreeTime}
        </div>
        <div>
          parseDomTime：
          {measure.parseDomTime}
        </div>
        <p>
          loadEventTime：
          {measure.loadEventTime}
        </p>
        <div>
          firstPaintStart：
          {measure.firstPaintStart}
        </div>
        <div>
          paint：
          {record.paint}
        </div>
        <div>
          load：
          {record.load}
        </div>
        <p>
          screen：
          {record.screen}
        </p>
        <div>
          redirectCount：
          {measure.redirectCount}
        </div>
        <div>
          connectSslTime：
          {measure.connectSslTime}
        </div>
        <p>
          compression：
          {measure.compression}
        </p>
        <div>
          创建日期：
          {formatDate(record.ctime)}
        </div>
      </div>
    );
  };
  const getTiming = (record) => {
    const timing = JSON.parse(record.timing);
    return (
      <pre style={{
        background: 'none', whiteSpace: 'pre-wrap', wordWrap: 'break-word', wordBreak: 'break-all',
      }}
      >
        {JSON.stringify(timing, null, 2)}
      </pre>
    );
  };
  // List组件属性
  const listProps = {
    name: 'flowList',
    url: api.monitorPerformanceFlow,
    page: {
      isScrollToTop: false,
    },
    columns: [
      setColumn('id', 'id', {
        width: 150,
        render: (id, record) => {
          return (
            <>
              <Tooltip placement="right" title={getInfo(record)} overlayStyle={{ minWidth: 300 }}>
                <span>{id}</span>
              </Tooltip>
            </>
          );
        },
      }),
      setColumn('时序图', 'measure', {
        render: (params, record) => {
          const measure = JSON.parse(params);
          // 总时间
          const total = flowColors.reduce((previous, current) => previous + measure[current], 0);
          if (total <= 0) {
            return (
              <>
                <span style={{ marginRight: 10 }}>
                  总时间:
                  {total}
                </span>
                <Tooltip placement="right" title={getTiming(record)} overlayStyle={{ minWidth: 500 }}>
                  <span>{record.referer}</span>
                </Tooltip>
              </>
            );
          }
          const paint = `${(record.paint / total) * 100}%`;
          const screen = `${(record.screen / total) * 100}%`;
          return (
            <>
              <div style={{
                width: '100%', display: 'flex', height: 20, marginBottom: 5, position: 'relative',
              }}
              >
                {flowColors.map((item, index) => (
                  measure[item] > 0 && (
                  <Tooltip title={`${item}：${measure[item]}`} key={item}>
                    <div style={{ background: COLORS[index], width: `${(measure[item] / total) * 100}%` }} />
                  </Tooltip>
                  )
                ))}
                {
                    record.paint <= total ? (
                      <Tooltip title={`paint：${record.paint}`}>
                        <div style={{
                          position: 'absolute', width: 2, height: 30, background: '#F60', left: paint, top: -5,
                        }}
                        />
                      </Tooltip>
                    ) : null
                }
                {
                    record.screen <= total ? (
                      <Tooltip title={`screen：${record.screen}`}>
                        <div style={{
                          position: 'absolute', width: 2, height: 30, background: '#000', left: screen, top: -5,
                        }}
                        />
                      </Tooltip>
                    ) : null
                }
              </div>
              {
                breakWord(<>
                  <span style={{ marginRight: 10 }}>
                    总时间:
                    {total}
                  </span>
                  <Tooltip placement="right" title={getTiming(record)} overlayStyle={{ minWidth: 500 }}>
                    <span>{record.referer}</span>
                  </Tooltip>
                </>)
              }
            </>
          );
        },
      }),
    ],
  };
  const queryProps = {
    url: api.monitorPerformanceFlow,
    listName: listProps.name,
    btns: {
      formatValues(values) {
        if (values.day) {
          values.start = formatDate(values.day[0]); // 格式化
          values.end = formatDate(values.day[1]); // 格式化
        } else {
          values.start = formatDate(new Date(), 'YYYY-MM-DD 00:00'); // 格式化
          values.end = formatDate(); // 格式化
        }
        if (values.params) {
          values.type = values.params[0];
          values.range = values.params[1];
        }
        delete values.day;
        delete values.params;
        return values;
      },
    },
    controls: [
      [
        {
          name: 'id',
          control: <Input placeholder="性能日志编号" style={{ width: 200 }} />,
        },
        {
          name: 'identity',
          control: <Input placeholder="身份" style={{ width: 200 }} />,
        },
        {
          name: 'params',
          control: <Cascader placeholder="参数和范围" options={MONITOR_PERFORMANCE_CASCADER} />,
        },
      ],
      [
        {
          name: 'day',
          control: <RangePicker format="YYYY-MM-DD HH:mm" showTime />,
        },
        {
          name: 'path',
          control: <Input placeholder="来源路径" style={{ width: 200 }} />,
        },
        'search',
      ],
    ],
  };
  return (
    <>
      <Query {...queryProps} />
      <div style={{ display: 'flex', marginBottom: 10 }}>
        {flowColors.map((item, index) => (
          <div
            key={item}
            style={{
              padding: 5, background: COLORS[index], marginRight: 5, color: '#FFF',
            }}
          >
            {item}
          </div>
        ))}
      </div>
      <List {...listProps} />
    </>
  );
}

export default connect((data) => data.monitorPeDashboard)(Flow);
