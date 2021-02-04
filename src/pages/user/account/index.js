/**
 * 账号管理
 */
import React from 'react';
import { connect } from 'dva';
import UserList from './components/UserList';
import UserSearch from './components/UserSearch';
import UserModal from './components/UserModal';


const Users = ({ users, dispatch }) => {
  const {
    list, total, curPage,
    currentItem, modalVisible, modalType,
    userRoles
  } = users;

  const userSearchProps = {
    userRoles,
    /**
     * 账号搜索
     */
    onSearch(query) {
      dispatch({
        type: 'users/query',
        payload: {
          ...query
        },
      });
    },
    /**
     * 新增账号
     */
    onAddUser() {
      dispatch({
        type: 'users/showModal',
        payload: {
          type: 'add',
        },
      });
    },
  };
  const userListProps = {
    dataSource: list,
    total,
    curPage,
    userRoles,
    // 触发列表查询
    onQueryChange: (pageNum) => {
      dispatch({
        type: 'users/query',
        payload: {
          curPage: pageNum,
        },
      });
    },
    // 更新账号状态（禁用/解禁）
    onUpdateUserStatus: (userId, enable) => {
      if (enable) {
        dispatch({
          type: 'users/enableUser',
          payload: {
            userId,
            status: enable,
          },
        });
      } else {
        dispatch({
          type: 'users/disableUser',
          payload: {
            userId,
            status: enable,
          },
        });
      }
    },
    // 删除账号
    onDeleteUser: (userId) => {
      dispatch({
        type: 'users/deleteUser',
        payload: {
          userId,
        },
      });
    },
    // 编辑账号
    onEditUser: (userId) => {
      dispatch({
        type: 'users/showModal',
        payload: {
          type: 'update',
          userId,
        },
      });
    },
    // 修改密码
    resetPassword: (record) => {
      dispatch({
        type: 'resetPassword/showModal',
        payload: { type: 'forget', record },
      });
    },
  };
  const userModalProps = {
    userRoles,
    modalVisible,
    modalType,
    currentItem,
    // 弹窗取消
    handleCancel() {
      dispatch({
        type: 'users/hideModal',
      });
    },
    // 确定更新
    handleUpdate(id, userData) {
      dispatch({
        type: 'users/update',
        payload: {
          id,
          userData,
        },
      });
    },
    // 保存新账号
    handleAdd(userData) {
      dispatch({
        type: 'users/create',
        payload: userData,
      });
    },
  };

  return (
    <div>
      {/* 用户筛选搜索框 */}
      <UserSearch {...userSearchProps} />
      <div style={{ marginBottom: 20 }} />
      {/* 用户信息展示列表 */}
      <UserList {...userListProps} />
      {/* 用户信息弹窗 */}
      <UserModal {...userModalProps} />
    </div>
  );
};


function mapStateToProps(data) {
  const { users } = data;
  return { users };
}

export default connect(mapStateToProps)(Users);
