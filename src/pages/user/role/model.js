import _ from 'lodash';
import {
  getUserRoleList,
  createUserRole,
  updateUserRole,
  enableUserRole,
  disableUserRole,
  removeUserRole,
} from 'services/user';

export default {
  namespace: 'userRole',

  state: {
    list: [], // 角色列表
    modalVisible: false, // 对话框显示状态
    title: '', // 对话框标题
    currentRoleItem: {},
    page: {},
    query: {},    //查询条件
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/user/role') {
          dispatch({
            type: 'query',
            payload: {},
          });
        }
      });
    },
  },

  effects: {
    // 获取用户角色列表
    *query({ payload }, { call, put }) {
      const { data } = yield call(getUserRoleList, payload);
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            data,
            query: payload
          },
        });
      }
    },

    // 创建用户角色
    *create({ payload }, { call, put }) {
      const { data } = yield call(createUserRole, payload);
      yield put({
        type: 'createSuccess',
        payload: data,
      });
    },

    // 更新角色
    *update({ payload }, { call, put }) {
      const { data } = yield call(updateUserRole, payload);
      yield put({
        type: 'updateSuccess',
        payload: data,
      });
    },

    // 禁用/解禁角色
    *updateStatus({ payload }, { call, put }) {
      const { roleId, status } = payload;
      const fn = status ? enableUserRole : disableUserRole;
      const { data } = yield call(fn, roleId);
      yield put({
        type: 'updateStatusSuccess',
        payload: data,
      });
    },

    // 删除角色
    *remove({ payload }, { call, put }) {
      const { data } = yield call(removeUserRole, payload.roleId);
      yield put({
        type: 'removeSuccess',
        payload: data,
      });
    },
  },

  reducers: {
    // 获取角色列表成功
    querySuccess(state, { payload }) {
      return {
        ...state,
        ...payload.data,
        query: payload.query
      };
    },

    // 创建角色成功
    createSuccess(state, action) {
      const roleList = state.list;
      roleList.unshift(action.payload);
      return {
        ...state,
        list: roleList,
        modalVisible: false,
      };
    },

    // 更新角色信息成功
    updateSuccess(state, { payload }) {
      const data = payload;
      const roleList = state.list;
      const itemIndex = _.findIndex(roleList, { _id: data.roleId });
      roleList[itemIndex].roleName = data.roleName;
      roleList[itemIndex].roleDesc = data.roleDesc;
      roleList[itemIndex].rolePermission = data.rolePermission;
      return {
        ...state,
        list: roleList,
        modalVisible: false,
      };
    },

    // 更新角色状态成功
    updateStatusSuccess(state, { payload }) {
      const { list } = state;
      const arr = list.map((item) => {
        const cur = item;
        if (cur._id === payload.roleId) {
          cur.status = payload.status;
        }
        return cur;
      });
      return { ...state, list: arr };
    },

    // 删除角色成功
    removeSuccess(state, action) {
      const { roleId } = action.payload;
      const roleList = _.cloneDeep(state.list);
      const index = _.findIndex(roleList, { _id: roleId });
      roleList.splice(index, 1);
      return { ...state, list: roleList };
    },

    // 显示对话框
    showModal(state, action) {
      const { title } = action.payload;
      return {
        ...state,
        modalVisible: true,
        currentRoleItem: action.payload.record || {},
        title,
      };
    },

    // 隐藏对话框
    hideModal(state) {
      return { ...state, modalVisible: false, currentRoleItem: {} };
    },
  },
};

