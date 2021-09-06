/*
 * @Author: strick
 * @Date: 2020-12-15 13:13:33
 * @LastEditTime: 2021-09-06 11:29:12
 * @LastEditors: strick
 * @Description: 全局常量
 * @FilePath: /strick/shin-admin/src/utils/constants.js
 */

//template的model文件中的操作
export const TEMPLATE_MODEL = {
  HANDLE: "template/handle",
  MODAL: "template/setRecordInModal",
  QUERY: "template/query",
  SELECTED: "template/selected",
  CREATE: "template/showCreate",
}

//监控项目
export const MONITOR_PROJECT = [
  { key: 'shin-app', value: 'Shin后台' },
  { key: 'shin-h5', value: 'Shin-H5' },
  { key: 'shin-mini', value: 'Shin小程序'}
];

//监控类型级联
export const MONITOR_CATEGORY_CASCADER = [
  {
    value: 'error',
    label: '错误',
    children: [
      {
        value: '',
        label: '全部',
      },
      {
        value: 'runtime',
        label: 'runtime',
      },
      {
        value: 'script',
        label: 'script',
      },
      {
        value: 'style',
        label: 'style',
      },
      {
        value: 'image',
        label: 'image',
      },
      {
        value: 'audio',
        label: 'audio',
      },
      {
        value: 'video',
        label: 'video',
      },
      {
        value: 'promise',
        label: 'promise',
      },
      {
        value: 'vue',
        label: 'vue',
      },
      {
        value: 'react',
        label: 'react',
      },
      {
        value: 'mini',
        label: '小程序'
      },
      {
        value: 'crash',
        label: '奔溃'
      }
    ],
  },
  {
    value: 'ajax',
    label: '通信',
    children: [
      {
        value: '',
        label: '全部',
      },
      {
        value: 'get',
        label: 'GET',
      },
      {
        value: 'post',
        label: 'POST',
      },
    ]
  },
  {
    value: 'event',
    label: '事件',
    children: [
      {
        value: '',
        label: '全部',
      },
      {
        value: 'click',
        label: '点击',
      },
    ]
  },
  {
    value: 'console',
    label: '打印',
    children: [
      {
        value: '',
        label: '全部',
      },
      {
        value: 'log',
        label: 'log',
      },
    ]
  },
  {
    value: 'redirect',
    label: '跳转',
  },
];
// 颜色
export const COLORS = [
  "#4BC0C0",
  "#7cb305",
  "#096dd9",
  "#d4b106",
  "#ffec3d",
  "#eb2f96",
  "#531dab",
  "#69c0ff",
  "#595959",
];