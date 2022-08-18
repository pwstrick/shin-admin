/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 11:51:35
 * @LastEditTime: 2022-08-18 18:02:22
 * @Description: 模板数据处理
 * @FilePath: /strick/shin-admin/src/models/template.js
 */
import { redirect, get, post, apiPost, apiPut  } from 'utils/request';
import { success } from 'utils/tools';
function setCreatingModalName(modalName) {
  return (modalName || 'is') + 'ModalCreating';
}
function setListName(name, suffix) {
  if(!name)
    return suffix;
  return name + suffix;
}
const commonGetUrls = ["get", "gets"];    //目前只支持两种通用查询接口
const initState = {
  exportLoading: false,   //导出Loading
  queryLoading: false,    //查询Loading
  listLoading: false,     //列表Loading
  setCreatingModalNameFunc: setCreatingModalName,  //控制弹框的显示与隐藏
  setListNameFunc: setListName,   //设置列表项相关状态的名称（当一个页面中包含多张列表时使用）
  query: {},    //查询条件
  list: [],     //列表项
  total: 0,     //列表总数
  curPage: 1,   //当前页码
  selectedItem: {
    selectedRowKeys: [],
    selectedRows: []
  }, //列表选中项，包含 selectedRowKeys 和 selectedRows
  record: {},   //需要修改的项
};
export default {
    namespace: 'template',
    state: { ...initState },
    subscriptions: {
      setup({ dispatch, history }) {
        //每次路由发生变化就清空state
        history.listen((location) => {
          dispatch({
            type: 'clear'
          });
        });
      },
    },
    effects: {
      //查询
      *query({ payload }, { call, put }) {
        yield put({ type: 'showQueryLoading' });
        const { url, params, modalName, listName } = payload;
        let result;
        // 若是通用URL，则采用POST提交
        if(commonGetUrls.indexOf(url) > -1) {
          result = yield call(post, url, params);
        }else {
          result = yield call(get, url, params);
        }
        const { data } = result;
        //将响应传递给自定义的回调函数
        payload.callback && payload.callback(data);
        yield put({
          type: 'querySuccess',
          payload: {
            data,
            query: params || {},
            modalName,    //用于隐藏弹框
            listName
          },
        });
      },
      //Excel导出
      *export({ payload }, { call, put }) {
        yield put({ type: 'showExportLoading' });
        yield call(redirect, payload.url, payload.params);
        yield put({ type: 'hideExportLoading' });
      },
      //处理数据，增删改
      *handle({ payload }, { call, put, select }) {
        yield put({ type: 'showQueryLoading' });
        const { url, params, modalName, listName, initUrl, type } = payload;
        let result;
        // type用于区分接口
        switch(type) {
          case 'create':
            result = yield call(apiPost, params);   //调用通用提交接口
            break;
          case 'put':
            result = yield call(apiPut, params);    //调用通用修改接口
            break;
          default:
            result = yield call(post, url, params); //调用自定义的接口
            break;
        }
        const { data } = result;
        if(!success(data) ||  //失败的响应
          !initUrl) {         //不存在初始化请求
          yield put({ type: 'hideQueryLoading' });
          return data;
        }
        const query = yield select(state => state.template[setListName(listName, "query")]);
        yield put({ type: 'query', payload: {
          url: initUrl,
          params: query,
          modalName,    //用于隐藏弹框
          listName
        }});
        return data;
      },
    },
    reducers: {
      clear() {
        return { ...initState }
      },
      showExportLoading(state) {
        return {
          ...state,
          exportLoading: true,
        };
      },
      hideExportLoading(state) {
        return {
          ...state,
          exportLoading: false,
        };
      },
      showCreate(state, { payload }) {
        return {
          ...state,
          [setCreatingModalName(payload.modalName)]: true,
          record: {}
        };
      },
      hideCreate(state, { payload }) {
        return {
          ...state,
          [setCreatingModalName(payload.modalName)]: false,
          record: {}
        };
      },
      showQueryLoading(state) {
        return {
          ...state,
          queryLoading: true,
          listLoading: true,
        };
      },
      hideQueryLoading(state) {
        return {
          ...state,
          queryLoading: false,
          listLoading: false,
        };
      },
      querySuccess(state, { payload }) {
        const { data, count } = payload.data;
        const { curPage=1 } = payload.query;
        const { modalName, listName, query } = payload;
        return {
          ...state,
          queryLoading: false,    //取消所有Loading
          listLoading: false,
          [setCreatingModalName(modalName)]: false,
          // record: {},    // 当弹框中的控件比较多时，点击弹框确认按钮会出现长时间的卡顿
          [setListName(listName, "selectedItem")]: {
            selectedRowKeys: [],
            selectedRows: []
          },
          [setListName(listName, "list")]: data,     //列表数据
          [setListName(listName, "total")]: count,   //总数
          [setListName(listName, "curPage")]: curPage,
          [setListName(listName, "query")]: query    //查询条件
        };
      },
      selected(state, { payload }) {  //列表中的选择
        const { listName, params } = payload;
        return {
          ...state,
          [setListName(listName, "selectedItem")]: params,    //选择与取消
        };
      },
      setRecordInModal(state, { payload }) {  //打开模态窗口，并初始化控件
        const { modalName, params } = payload;
        return {
          ...state,
          record: params,
          [setCreatingModalName(modalName)]: true
        };
      }
    },
  };