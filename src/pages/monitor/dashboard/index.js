/*
 * @Author: strick
 * @Date: 2021-02-25 15:21:41
 * @LastEditTime: 2021-09-06 11:26:59
 * @LastEditors: strick
 * @Description: 前端监控面板
 * @FilePath: /strick/shin-admin/src/pages/monitor/dashboard/index.js
 */
import { Statistic, Card, Row, Col, Icon, Spin, Select } from 'antd';
import { MONITOR_PROJECT } from 'utils/constants';
import ChartDashboard from './components/Chart';
import DateDashboard from './components/Date';
import { connect } from 'dva';
const { Option } = Select;

const MonitorDashboard = ({ dispatch, loading, statistic }) => {
  const { todayCount,
    yesterdayCount,
    todayErrorCount,
    todayErrorSum,
    todayAjaxCount,
    todayConsoleCount,
    todayEventCount,
    todayRedirectCount,
    todayErrorCountRate=0,
    todayErrorSumRate=0,
    yesterday500ErrorCount=0,
    yesterday502ErrorCount=0,
    yesterday504ErrorCount=0,
    today500ErrorCount=0,
    today502ErrorCount=0,
    today504ErrorCount=0,
  } = statistic;
  
  const styleObj = (digit) => {
    // 大于0是红色，小于0是绿色
    const color = digit > 0 ? "#cf1322" : "#3f8600";
    const icon = digit > 0 ? <Icon type="arrow-up" /> : <Icon type="arrow-down" />;
    return {
      color,
      icon
    }
  };
  const errorCount = styleObj(todayErrorCountRate);
  const errorSum = styleObj(todayErrorSumRate);
  // 选择项目
  const changeProject = (value) => {
    dispatch({
      type: 'monitorDashboard/query',
      payload: {
        project: value,
      },
    });
  };
  return (<><Spin spinning={loading}>
    <div style={{ background: "#ECECEC", padding: 30, marginBottom: 20 }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Select name="project" style={{ width: '100%' }} onChange={changeProject} placeholder="项目">
            <Option value="">项目</Option>
            {
              MONITOR_PROJECT.map(item => <Option value={item.key} key={item.key}>{item.value}</Option>)
            }
          </Select>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="今日日志总数" value={todayCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="昨日日志总数" value={yesterdayCount} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="全局错误数"
              value={todayErrorSum}
            />
            <Statistic
              value={Math.abs(todayErrorSumRate)}
              precision={2}
              valueStyle={{ color: errorSum.color }}
              prefix={ errorSum.icon }
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="影响的用户数"
              value={todayErrorCount}
            />
            <Statistic
              value={Math.abs(todayErrorCountRate)}
              precision={2}
              valueStyle={{ color: errorCount.color }}
              prefix={errorCount.icon}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日通信错误" value={today500ErrorCount + today502ErrorCount + today504ErrorCount} />
            <Statistic prefix="500：" value={today500ErrorCount} valueStyle={{ fontSize: 16 }}/>
            <Statistic prefix="502：" value={today502ErrorCount} valueStyle={{ fontSize: 16 }}/>
            <Statistic prefix="504：" value={today504ErrorCount} valueStyle={{ fontSize: 16 }}/>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="昨日通信错误" value={yesterday500ErrorCount + yesterday502ErrorCount + yesterday504ErrorCount} />
            <Statistic prefix="500：" value={yesterday500ErrorCount} valueStyle={{ fontSize: 16 }}/>
            <Statistic prefix="502：" value={yesterday502ErrorCount} valueStyle={{ fontSize: 16 }}/>
            <Statistic prefix="504：" value={yesterday504ErrorCount} valueStyle={{ fontSize: 16 }}/>
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="通信总数" value={todayAjaxCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="事件总数" value={todayEventCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="打印总数" value={todayConsoleCount} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="跳转总数" value={todayRedirectCount} />
          </Card>
        </Col>
      </Row>
    </div>
  </Spin>
  <ChartDashboard></ChartDashboard>
  <DateDashboard></DateDashboard>
  </>);
};

export default connect(data => data.monitorDashboard)(MonitorDashboard);