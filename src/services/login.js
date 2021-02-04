import request from '../utils/request';
/**
 * 登录
 */
export async function login(data) {
  return request('/api/user/login', {
    method: 'POST',
    data,
  });
}
