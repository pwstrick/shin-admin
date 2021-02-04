import request from '../utils/request';

/**
 * 账户列表
 */
export async function query(params) {
  return request('/api/user/list', { params });
}
/**
 * 读取当前账号信息
 */
export async function getUser() {
  return request('/api/user');
}
/**
 * 禁用账户
 */
export async function disableUser(userId) {
  return request('/api/user/disable', {
    method: 'POST',
    data: {
      id: userId,
      status: 0,
      operateObject: userId,
    },
  });
}
/**
 * 启用账户
 */
export async function enableUser(userId) {
  return request('/api/user/enable', {
    method: 'POST',
    data: {
      id: userId,
      status: 1,
      operateObject: userId,
    },
  });
}
/**
 * 删除账户
 */
export async function deleteUser(userId) {
  return request('/api/user', {
    method: 'DELETE',
    data: {
      userId,
      operateObject: userId,
    },
  });
}
/**
 * 账户详情
 */
export async function getUserDetail(userId) {
  return request(`/api/user/detail/${userId}`, {
    method: 'GET',
  });
}
/**
 * 创建账户
 */
export async function createUser(data) {
  return request('/api/user', {
    method: 'POST',
    data: {
      ...data,
      operateObject: data.realName,
    },
  });
}
/**
 * 更新账户
 */
export async function updateUser(id, data) {
  return request('/api/user', {
    method: 'PUT',
    data: {
      ...data,
      id,
      operateObject: id,
    },
  });
}
/**
 * 获取账户角色列表
 */
export async function getUserRoleList(params) {
  return request('/api/user/role/list', { params });
}
/**
 * 创建账户角色
 */
export async function createUserRole(data) {
  return request('/api/user/role', {
    method: 'POST',
    data: {
      ...data,
      operateObject: data.roleName,
    },
  });
}
/**
 * 更新账户角色信息
 */
export async function updateUserRole(data) {
  return request('/api/user/role', {
    method: 'PUT',
    data: {
      ...data,
      operateObject: data.roleId,
    },
  });
}
/**
 * 禁用账户角色
 */
export async function disableUserRole(roleId) {
  return request('/api/user/role/disable', {
    method: 'POST',
    data: {
      roleId,
      operateObject: roleId,
    },
  });
}
/**
 * 启用账户角色
 */
export async function enableUserRole(roleId) {
  return request('/api/user/role/enable', {
    method: 'POST',
    data: {
      roleId,
      operateObject: roleId,
    },
  });
}
/**
 * 删除账户角色
 */
export async function removeUserRole(roleId) {
  return request('/api/user/role', {
    method: 'DELETE',
    data: {
      roleId,
      operateObject: roleId,
    },
  });
}
/**
 * 账户注销
 */
export async function logout() {
  return request('/api/user/logout', {
    method: 'POST',
  });
}
/**
 * 修改密码
 */
export async function resetPassword(data) {
  return request('/api/user/password', {
    method: 'PUT',
    data,
  });
}
