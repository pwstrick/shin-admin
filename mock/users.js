/*
 * @Author: strick
 * @Date: 2020-12-27 19:30:16
 * @LastEditTime: 2021-02-04 11:35:07
 * @LastEditors: strick
 * @Description: 账户接口
 * @FilePath: /strick/shin-admin/mock/users.js
 */
import _ from 'lodash';
const mockjs = require('mockjs');
const qs = require('qs');

const Random = mockjs.Random;
const userRoles = mockjs.mock({
  'list|10': [{
    _id: '@string(16)',
    'roleName|1': [
      '管理员',
      '客服',
      '网警',
      '运营',
      'iOS工程师',
      '安卓工程师',
      '市场',
      '设计',
      '超级管理员',
    ],
    roleDesc: '@csentence()',
    'status|1': [0, 1],
    rolePermission: [
      'backend',
      'backend.user',
      'backend.user.account',
      'backend.user.account.list',
    ],
  }],
});

module.exports = {
    'GET /api/user/list' (req, res) {
      // const { page } = qs.parse(req.query);
      const data = mockjs.mock({
        'data|100': [{
          _id: /\w{16}/,
          userName: '@email',
          realName: '@cname',
          cellphone: /(13|14|15|18)[0-9]{9}/,
          "roles": [
            Random.pick(_.map(userRoles.list, '_id')),
            Random.pick(_.map(userRoles.list, '_id')),
            Random.pick(_.map(userRoles.list, '_id')),
          ],
          "status|1": [0, 1],
        }],
        count: 100
      });
  
      res.json({
        code: 0,
        data: data.data,
        count: data.count,
      });
    },
  
    'POST /api/user/login' (req, res) {
      res.json({
        code: 0,
        //token采用的是JWT的跨域认证解决方案   https://jwt.io/
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmODEyODhkMzU3OGJiMDA1YTc5Y2RjMSIsInVzZXJOYW1lIjoicHdzdHJpY2tAMTYzLmNvbSIsInJlYWxOYW1lIjoic3RyaWNrIiwiaWF0IjoxNjA5MDY5ODQ0LCJleHAiOjE2MDkxMTMwNDR9.H8WtilifQQEighczhXtpA_W-YP0Nm4Ci48OITRlmnCg',
        expireDays: 90,
        nodeEnv: 'development',
        authorities: [
            'backend',
            'backend.user',
            'backend.user.account',
            'backend.user.account.list',
            'backend.user.role',
            'backend.user.role.list',
            'backend.user.upload',
            'backend.template',
            'backend.template.list',
            'backend.template.form',
            'backend.template.photo',
            'backend.tool',
            'backend.tool.shortChain',
            'backend.tool.config',
        ],
      });
    },
  
    // 查询用户信息
    'GET /api/user': (req, res) => {
      const auth = req.get('Authorization');
      //后台所有的请求都必须带Authorization头，它的值就是登录时获取的token
      if (auth.indexOf('null') !== -1) {
        return res.status(401).send('UnAuthorization');
      }
      res.json({
        username: '测试用户',
      });
    },
  
    // 新增用户
    'POST /api/user': (req, res) => {
      const _id = Random.string(16);
      res.json({
        ...req.body,
        code: 0,
        _id,
      });
    },
    // 更新用户
    'PUT /api/user': (req, res) => {
      res.json(req.body);
    },
    // 禁用用户
    'POST /api/user/disable': (req, res) => {
      res.json({
        code: 0,
      });
    },
    
    // 删除用户
    'DELETE /api/user': (req, res) => {
      res.json({
        code: 0,
      });
    },
  
    // 获取用户角色列表
    'GET /api/user/role/list': (req, res) => {
      res.json(userRoles);
    },
  
    // 创建用户角色
    'POST /api/user/role': (req, res) => {
      res.json({
        ...req.body,
        _id: Random.string(16),
        status: 1,
      });
    },
  
    // 更新用户角色信息
    'PUT /api/user/role': (req, res) => {
      res.json(req.body);
    },
  
    // 禁用用户角色
    'POST /api/user/role/disable': (req, res) => {
      res.json({
        roleId: req.body.roleId,
        status: 0,
      });
    },
  
    // 启用用户角色
    'POST /api/user/role/enable': (req, res) => {
      res.json({
        roleId: req.body.roleId,
        status: 1,
      });
    },
  
    // 删除用户角色
    'DELETE /api/user/role': (req, res) => {
      res.json({
        roleId: req.body.roleId,
      });
    },
  
    // 修改密码
    'PUT /api/user/password': (req, res) => {
      res.json({
        code: 0,
      });
    },

    // 登出
    'POST /api/user/logout': (req, res) => {
      res.json({
        code: 0,
      });
    },

    // 会员信息
    'GET /api/appuser/detail': (req, res) => {
      res.json({
        code: 0,
      });
    },
  };