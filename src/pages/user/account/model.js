import _ from 'lodash';
import {
  query,
  enableUser,
  disableUser,
  deleteUser,
  getUserRoleList,
  createUser,
  updateUser,
} from 'services/user';

export default {
  namespace: 'users',
  state: {
    list: [],
    query: {},        //过滤条件
    total: null,
    loading: false,   // 控制加载状态
    curPage: 1,       // 当前分页信息
    currentItem: {},  // 当前操作的用户对象
    modalVisible: false,  // 弹出窗的显示状态
    modalType: 'create',  // 弹出窗的类型（添加用户，编辑用户）
    userRoles: [],
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user/account') {
          dispatch({
            type: 'query',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    *query({ payload }, { call, put, select }) {
      //合并查询条件
      let params = yield select(state => state.users.query);
      params = Object.assign(params, payload);
      yield put({ type: 'showLoading' });
      const { data } = yield call(query, params);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.data,
            total: data.count,
            query: params
          },
        });
        yield put({
          type: 'queryUserRoles',
          payload: {
            limit: 100,
          },
        });
      }
    },
    *queryUserRoles({ payload }, { call, put }) {
      const { data } = yield call(getUserRoleList, payload);
      if (data) {
        yield put({
          type: 'queryUserRolesSuccess',
          payload: data.list,
        });
      }
    },
    *create({ payload }, { call, put }) {
      const res = yield call(createUser, payload);
      yield put({ type: 'hideModal' });
      yield put({
        type: 'createSuccess',
        payload: res.data,
      });
    },
    *update({ payload }, { call, put }) {
      const res = yield call(updateUser, payload.id, payload.userData);
      yield put({ type: 'hideModal' });
      yield put({ type: 'updateSuccess', payload: res.data });
    },
    *enableUser({ payload }, { call, put }) {
      const { userId, status } = payload;
      yield call(enableUser, userId);
      yield put({
        type: 'updateUserStatusSuccess',
        payload: {
          userId,
          status,
        },
      });
    },
    *disableUser({ payload }, { call, put }) {
      const { userId, status } = payload;
      yield call(disableUser, userId);
      yield put({
        type: 'updateUserStatusSuccess',
        payload: {
          userId,
          status,
        },
      });
    },
    *deleteUser({ payload }, { call, put }) {
      yield call(deleteUser, payload.userId);
      yield put({ type: 'deleteSuccess', payload: payload.userId });
    },
  },
  reducers: {
    showLoading(state) {
      return { ...state, loading: true };
    },
    showModal(state, action) {
      const { type } = action.payload;
      let currentItem = null;
      if (type === 'add') {
        currentItem = {};
      } else {
        const { userId } = action.payload;
        currentItem = _.find(state.list, { _id: userId });
        const list = currentItem.roles.filter((item) => {
          for (let i = 0; i < state.userRoles.length; i += 1) {
            if (state.userRoles[i].value === item) return true;
          }
          return false;
        });
        currentItem.roles = list;
      }
      return {
        ...state,
        modalVisible: true,
        currentItem,
      };
    }, // 控制 Modal 显示状态的 reducer
    hideModal(state) {
      return {
        ...state,
        modalVisible: false,
      };
    },
    // 使用静态数据返回
    querySuccess(state, action) {
      return { 
        ...state, 
        ...action.payload,
        curPage: state.query.curPage,
        loading: false
      };
    },
    queryUserRolesSuccess(state, action) {
      const userRoles = action.payload.map(role => (
        {
          value: role._id,
          label: role.roleName,
        }
      ));
      return {
        ...state,
        userRoles,
      };
    },
    updateUserStatusSuccess(state, { payload }) {
      const { userId, status } = payload;
      const userList = state.list;
      userList[_.findIndex(userList, { _id: userId })].status = status;
      return {
        ...state,
        list: userList,
      };
    },
    createSuccess(state, { payload }) {
      const userList = state.list;
      userList.unshift(payload);
      return {
        ...state,
        list: userList,
      };
    },
    deleteSuccess(state, { payload }) {
      const id = payload;
      const userList = state.list;
      const index = _.findIndex(userList, { _id: id });
      userList.splice(index, 1);
      return {
        ...state,
        list: userList,
      };
    },
    updateSuccess(state, { payload }) {
      const { id } = payload;
      const userList = state.list;
      const index = _.findIndex(userList, { _id: id });
      userList[index].cellphone = payload.cellphone;
      userList[index].realName = payload.realName;
      userList[index].roles = payload.roles;
      userList[index].userName = payload.userName;
      return {
        ...state,
        list: userList,
      };
    },
  },
};
