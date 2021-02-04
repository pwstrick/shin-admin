
/**
 * 权限列表
 * @param id      {string} 权限id
 * @param pid     {string} 父级权限id
 * @param status  {number} 是否开启 1 开启 2 关闭
 * @param type    {string} 权限类型 1 菜单 2 接口
 * @param name    {string} 权限名称
 * @param desc    {string} 权限描述
 * @param routers {string} 权限相关路由
 * @param icon    {string} 菜单图标
 */
export default [
    {
      id: 'backend',
      pid: '',
      status: 1,
      type: 1,
      name: '管理后台',
      desc: '',
      routers: '/',
      icon: 'desktop',
    },
    {
        id: 'backend.user',
        pid: 'backend',
        status: 1,
        type: 1,
        name: '用户管理',
        desc: '',
        icon: 'user',
    },
    {
        id: 'backend.user.account',
        pid: 'backend.user',
        status: 1,
        type: 1,
        name: '账号管理',
        desc: '',
    },
    {
        id: 'backend.user.account.list',
        pid: 'backend.user.account',
        status: 1,
        type: 1,
        name: '账号列表',
        desc: '',
        routers: '/user/account',
    },
    {
        id: 'backend.user.role',
        pid: 'backend.user',
        status: 1,
        type: 1,
        name: '角色管理',
        desc: '',
    },
    {
        id: 'backend.user.role.list',
        pid: 'backend.user.role',
        status: 1,
        type: 1,
        name: '角色列表',
        desc: '',
        routers: '/user/role',
    },
    {
      id: 'backend.user.upload',
      pid: 'backend',
      status: 1,
      type: 2,
      name: '文件上传',
      desc: '',
    },
    {
      id: 'backend.template',
      pid: 'backend',
      status: 1,
      type: 1,
      name: '全局模板',
      desc: '',
      routers: '/template',
      icon: 'file-text',
    },
    {
      id: 'backend.template.list',
      pid: 'backend.template',
      status: 1,
      type: 1,
      name: '列表模板',
      desc: '',
      routers: '/template/list',
    },
    {
      id: 'backend.template.form',
      pid: 'backend.template',
      status: 1,
      type: 1,
      name: '表单模板',
      desc: '',
      routers: '/template/form',
    },
    {
      id: 'backend.template.photo',
      pid: 'backend.template',
      status: 1,
      type: 1,
      name: '照片墙模板',
      desc: '',
      routers: '/template/photo',
    },
    {
        id: 'backend.tool',
        pid: 'backend',
        status: 1,
        type: 1,
        name: '业务工具',
        desc: '',
        routers: '/tool',
        icon: 'github',
      },
      {
        id: 'backend.tool.shortChain',
        pid: 'backend.tool',
        status: 1,
        type: 1,
        name: '短链服务',
        desc: '',
        routers: '/tool/shortChain',
      },
      {
        id: 'backend.tool.config',
        pid: 'backend.tool',
        status: 1,
        type: 1,
        name: '通用配置',
        desc: '',
        routers: '/tool/config',
      },
];
