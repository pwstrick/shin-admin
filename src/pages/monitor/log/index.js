/*
 * @Author: strick
 * @Date: 2021-02-25 15:21:48
 * @LastEditTime: 2022-12-21 17:39:45
 * @LastEditors: strick
 * @Description: 监控日志明细
 * @FilePath: /strick/shin-admin/src/pages/monitor/log/index.js
 */
/* eslint-disable */
import { Input, DatePicker, Select, Cascader, Button } from 'antd';
import { connect } from 'dva';
import ContextList from './components/ContextList';
import Query from 'components/Common/Template/List/Query';
import Prompt from 'components/Common/Template/Prompt';
import List from 'components/Common/Template/List/List';
import TabModal from 'components/Common/Template/TabModal';
import ChartList from './components/Chart';
import { setColumn, formatJsonInPre, formatDate, formatJsonInPreWithHTML } from 'utils/tools';
import { TEMPLATE_MODEL, MONITOR_PROJECT, MONITOR_CATEGORY_CASCADER } from 'utils/constants';
import api from "api";
import hljs from 'components/Common/Highlight/highlight';   //语法高亮
require('components/Common/Highlight/highlight-line-numbers');  //行号
const { Option } = Select;
const MonitorLog = ({ dispatch, keyword, match }) => {
  /**
   * 日志详情
   */
  function showDetail(record) {
    dispatch({
      type: TEMPLATE_MODEL.MODAL,
      payload: { 
        modalName: tabModalProps.attrs.name,
        params: record,
      }
    });
  }
  /**
   * 解析日志内容的展现格式
   */
  const parseMessage = (record, isModal=false, keyword) => {
    const message = JSON.parse(record.message);
    if(record.category === 'ajax') {
      // 捕获错误，会有非JSON格式的响应
      try {
        const { response, data } = message;
        typeof response === 'string' && response.indexOf("{") > -1 && (message.response = JSON.parse(response));
        typeof data === 'string' && data.indexOf("{") > -1 && (message.data = JSON.parse(data));
      } catch (e) { }
    }else if(record.category === 'console') {
      message.desc = JSON.parse(message.desc);
      try {
        message.desc = message.desc.map(JSON.parse);
      } catch (e) { }
    }else if(record.category === 'error') {
      if(message.type === 'promise') {
        // 解析字符串 response
        const { response } = message.desc;
        try {
          typeof response === 'string' && response.indexOf("{") > -1 && (message.desc.response = JSON.parse(response));
        } catch (e) { }
      }
    }
    if(isModal)
      return formatJsonInPre(message, { height: 300, overflow: 'auto', maxWidth: '100%', lineHeight: 1.5 });
    if(record.category === 'event')
      return formatJsonInPre(message);
    return formatJsonInPreWithHTML(message, { keyword });
  };

  // Prompt组件属性
  const promptProps = {
    message: "使用需知",
    description: <>
      <div>项目一列中，包含项目名称、日志创建时间、Source Map文件、身份标识</div>
      <div>类别一列中，包含日志类别、相同日志出现的次数</div>
      <div>注意：日志数据只保留两周，Source Map文件保留三周</div>
    </>
  };
  // List组件属性
  const listProps = {
    url: api.monitorList,
    // scroll: { x: true },
    options: {
      showTotal: total => `总共 ${total} 条`
    },
    columns: [
      setColumn('编号', 'id', { width: '150px' }),
      setColumn('项目', 'project', { width: '250px', render: (value, record) => <>
        <p>{value}</p>
        <p>{formatDate(record.ctime * 1000, 'MM-DD HH:mm:ss')}</p>
        <p>{record.source}</p>
        <p>{record.identity}</p>
      </> }),
      setColumn('类别', 'category', { width: '100px', render: (value, record) => <>
        <p>{value}</p>
        <p>{record.digit}</p>
      </> }),
      setColumn('内容', 'message', { width: '50%', render: (value, record) => parseMessage(record, false, keyword) }),
      // setColumn("代理", "ua", { width: "30%", render: value => formatJsonInPre(JSON.parse(value)) }),
      setColumn('操作', 'id', {
        key: 'operate',
        width: '8%',
        render: (id, record) => {
          return (
            <>
              <p>
                <a onClick={() => showDetail(record)}>详情</a>
              </p>
            </>
          );
        },
      }),
    ],
  };
  // Query组件属性
  const { RangePicker } = DatePicker;
  const generateChart = () => {
    dispatch({
      type: "monitorList/chart",
      payload: queryProps.btns.fieldsValues
    });
  };
  const generateClear = () => {
    dispatch({
      type: "monitorList/clearChart",
    });
  };
  const queryProps = {
    url: listProps.url,
    btns: {
      formatValues(values) {
        if (values.dates && values.dates.length > 0) {
          values.start = formatDate(values.dates[0]); // 改成别名
          values.end = formatDate(values.dates[1]);
        }else {
          delete values.start;
          delete values.end;
        }
        delete values.dates;
        return values;
      },
    },
    controls: [
      [
        {
          name: 'id',
          control: <Input placeholder="编号" style={{ width: 200 }} />,
        },
        { 
          name: 'dates', 
          control: <RangePicker format="YYYY-MM-DD HH:mm" showTime={true}/>,
          // params: {
          //   rules: [{
          //     message: '请选择日期范围',
          //     validator: (rule, value, callback) => {
          //       //当选择模糊匹配时，必须选择日期
          //       if(!match || match == 1)
          //         return true
          //       return !!value;
          //     }
          //   }],
          // },
        },
      ],
      [
        // {
        //   name: 'match',
        //   control: (
        //     <Select name="match" style={{ width: 200 }} placeholder="检索方式" onChange={changeMatch}>
        //       <Option value="">检索方式</Option>
        //       <Option value="1">全文检索</Option>
        //       <Option value="2">模糊匹配</Option>
        //     </Select>
        //   ),
        // },
        {
          name: 'msg',
          control: <Input placeholder="关键字" style={{ width: 200 }} />,
        },
        {
          name: 'identity',
          control: <Input placeholder="身份" style={{ width: 200 }} />,
        },
      ],
      [
        {
          name: 'path',
          control: <Input placeholder="请求路径" style={{ width: 200 }} />,
        },
        {
          name: 'status',
          control: <Input placeholder="响应状态码" style={{ width: 200 }} />,
        },
      ],
      [
        {
          name: 'project',
          control: (
            <Select name="project" style={{ width: 200 }} placeholder="项目">
              <Option value="">项目</Option>
              {
                MONITOR_PROJECT.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
              }
            </Select>
          ),
        },
        {
          name: 'category',
          control: (
            <Cascader options={[{value: '',label: '类别'}, ...MONITOR_CATEGORY_CASCADER]} placeholder="类别" style={{ width: 200 }}/>
            // <Select name="category" style={{ width: 100 }}>
            //   <Option value="">类别</Option>
            //   {
            //     MONITOR_CATEGORY.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
            //   }
            // </Select>
          ),
        },
        {
          name: 'chart',
          control: (
            <Select name="chart" style={{ width: 200 }} placeholder="统计类别">
              <Option value="">统计类别</Option>
              <Option value="1">天数</Option>
              <Option value="2">小时</Option>
            </Select>
          ),
        },
        
      ],
      [
        'search', // 查询按钮占位符
        {
          name: 'btnChart',
          control: <Button onClick={generateChart}>结果生成图表</Button>,
        },
        {
          name: 'btnClear',
          control: <Button onClick={generateClear}>清空图表</Button>,
        },
      ]
    ],
    callback(response) {
      dispatch({
        type: "monitorList/setKeyword",
        payload: { 
          msg: response.query.msg,
          chartListStatis: {}   //清空表格
        }
      });
    }
  };
  
  //TabModal组件属性
  const tabModalProps = {
    type: "card",
    attrs: {
      name: "read",
      width: "95%",
      title: "日志阅览"
    },
    formItemLayout: {},
    effectCallback: record => {
      // 代码高亮，延迟500ms
      setTimeout(() => {
        const { lineno } = record.sourceInfo || {};
        hljs.initHighlighting.called = false;
        hljs.initHighlighting();
        hljs.initLineNumbersOnLoad({ singleLine: true, complete: () => {
          const line = document.querySelector(`[data-line-number="${ lineno }"]`);
          line && (line.parentNode.style.background = "#FFECEC");
        }});
      }, 500);
    },
    initPanes: record => {
      const { code, path, lineno } = record.sourceInfo || {};
      return [
        {
          name: "详细内容",
          key: "message",
          controls: [
            { control:  record.message && parseMessage(record, true)
            },
            { control: <>
              <p style={{fontWeight: "bold", marginBottom: 0}}>源地址：{ path && path.replace("webpack:///", "") }</p>
              <p style={{fontWeight: "bold", marginBottom: 0}}>行号：{ lineno }</p>
              <pre className="hljs" style={{ lineHeight: 1.5, maxWidth: '100%' }}>
                <code className="javascript">{ code }</code>
              </pre> 
              </>
            },
          ]
        },
        {
          name: "设备信息",
          key: "ua",
          controls: [
            { control: record.ua && formatJsonInPre(
              JSON.parse(record.ua), 
              { height: 400, overflow: 'auto', maxWidth: '100%', lineHeight: 1.5 })
            },
          ]
        },
        {
          name: "上下文",
          key: "context",
          controls: [
            { control: <ContextList record={record} parseMessage={parseMessage}></ContextList> }
          ]
        },
      ]
    }
  };
  return (
    <>
      <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.5.0/build/styles/a11y-light.min.css" />
      <ChartList></ChartList>
      <Query {...queryProps} />
      <TabModal {...tabModalProps}></TabModal>
      <List {...listProps} />
      <Prompt {...promptProps}></Prompt>
    </>
  );
};

export default connect(data => data.monitorList)(MonitorLog);
