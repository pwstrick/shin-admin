/*
 * @Author: strick
 * @Date: 2020-11-06 14:15:30
 * @LastEditTime: 2021-09-06 13:38:07
 * @LastEditors: strick
 * @Description: 工具集合
 * @FilePath: /strick/shin-admin/src/utils/tools.js
 */
import { Modal } from "antd";
import moment from "moment";

/**
 * 处理服务器响应的提示
 */
export function success(data) {
  if (data.code !== 0) {
    Modal.error({ content: data.msg });
    return false;
  }
  return true;
}

/**
 * 配置分页
 */
export function setPage({
  curPage,
  pageSize = 10,
  total,
  action,
  others = {},
  onChange,
  dispatch
}) {
  return {
    current: curPage,
    total,
    pageSize,
    onChange: onChange ? onChange : ((page) => {
      others.curPage = page;
      others.pageSize = pageSize;
      dispatch({
        type: action,
        payload: others
      });
      //回到顶部
      scrollToTop();
    })
  };
}

/**
 * 平滑的滚动
 */
export function scrollToTop() {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c > 0) {
    window.requestAnimationFrame(scrollToTop);
    window.scrollTo(0, c - c / 8);
  }
}

/**
 * 配置表格头
 */
export function setColumn(title, dataIndex, others = {}) {
  const { key = dataIndex } = others;
  return {
    title,
    dataIndex,
    key,
    ...others
  };
}

/**
 * 移除数组中的空元素
 */
export function removeEmptyInArray(arr) {
  return arr.filter((value) => value !== undefined);
}

/**
 * 断行
 */
export function breakWord(text) {
  return (
    <div style={{ wordWrap: "break-word", wordBreak: "break-word" }}>
      {text}
    </div>
  );
}

/**
 * 格式化日期
 */
export function formatDate(date, format = "YYYY-MM-DD HH:mm:ss") {
  return moment(date).format(format);
}

/**
 * 在 pre 标签中显示格式化后的JSON数据
 */
 export function formatJsonInPre(
  data,
  params = { height: 300, overflow: 'auto', width: '100%', whiteSpace:"pre-wrap", wordWrap:"break-word" },
) {
  return <pre style={params}>{data && JSON.stringify(data, null, 2).replace(/\\n/g, '\n')}</pre>;
}

/**
 * 根据当前环境设置值
 */
export function setValueByNodeEnv({ test, pre, pro, dev}) {
  const nodeEnv = localStorage.getItem('nodeEnv');
  dev = dev || test;
  switch(nodeEnv) {
    case 'development':
      return dev;
    case 'test':
      return test;
    case 'pre':
      return pre;
    case 'production':
      return pro;
    default:
      return dev;
  }
}

/**
 * 在 pre 标签中显示格式化后的JSON数据
 * html 元素不会被转义
 */
 export function formatJsonInPreWithHTML(
  data,
  params = {},
  style = { height: 300, overflow: 'auto', width: '100%', whiteSpace:"pre-wrap", wordWrap:"break-word" }
) {
  let html = data && JSON.stringify(data, null, 2).replace(/\\n/g, '\n');
  const { keyword } = params;
  if(keyword) {
    html = html.replace(new RegExp(keyword, "gi"), match => `<span style="color:#ff4d4f">${match}</span>`)
  }
  return <pre style={style} dangerouslySetInnerHTML={{__html: html}}></pre>;
}