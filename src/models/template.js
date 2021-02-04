/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 11:51:35
 * @LastEditTime: 2021-02-02 13:59:55
 * @Description: 模板数据处理
 * @FilePath: /strick/shin-admin/src/models/template.js
 */
import { redirect, get, post } from 'utils/request';
import { success } from 'utils/tools';
function setCreatingModalName(modalName) {
  return (modalName || 'is') + 'ModalCreating';
}
function setListName(name, suffix) {
  if(!name)
    return suffix;
  return name + suffix;
}
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
        const { data } = yield call(get, url, params);
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
        const { url, params, modalName, listName, initUrl } = payload;
        const { data } = yield call(post, url, params);
        //处理响应的提示
        if(!success(data)) {
          yield put({ type: 'hideQueryLoading' });
          return;
        }
        const query = yield select(state => state.template[setListName(listName, "query")]);
        yield put({ type: 'query', payload: {
          url: initUrl,
          params: query,
          modalName,    //用于隐藏弹框
          listName
        }});
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
          [setCreatingModalName(payload.modalName)]: true
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
          record: {},
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