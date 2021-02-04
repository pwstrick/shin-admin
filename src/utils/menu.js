/*
 * @Author: strick
 * @Date: 2021-02-01 18:33:38
 * @LastEditTime: 2021-02-01 18:37:09
 * @LastEditors: strick
 * @Description: 菜单函数
 * @FilePath: /strick/shin-admin/src/utils/menu.js
 */
import config from './config';
import authority from '../authority';
/**
 * 将数组转换为树结构
 *
 * @export
 * @param {array} arr 需要转换的数组
 * @returns
 */
export function array2Tree(arr) {
  const localArr = arr.map(arrItem => (Object.assign({}, arrItem)));
  const hash = {};
  const result = [];
  localArr.forEach((item) => {
    hash[item.id] = item;
  });
  localArr.forEach((item) => {
    const parent = hash[item.pid];
    if (parent) {
      if (!parent.children) {
        parent.children = [];
      }
      parent.children.push(item);
    } else {
      result.push(item);
    }
  });
  return result;
}
/**
 * 创建菜单树
 * @param {object} arr 组件传递进来的属性
 */
export function createAuthTree(props) {
  // 过滤用户已有权限
  let authArr = [];
  let menuTree = '';
  //权限缓存在authorities中
  const authorities = localStorage.getItem(`${config.prefix}authorities`);
  if (authorities === '*') {              //超级管理员
    menuTree = array2Tree(authority);     //若不需要权限管理，则可以将else中的代码去掉
  } else {
    if (authorities) {
      authArr = authorities.split(',');   //分隔已有权限
    }
    const authList = authority.filter((item) => {
      //判断是否有当前菜单的权限，有就返回，否则过滤
      if (authArr.includes(item.id)) {
        return item;
      }
      return '';
    });
    menuTree = array2Tree(authList);
  }
  //深度优先 搜索当前菜单
  let defaultSelectedKeys = [],   //默认选中的菜单
    defaultOpenKeys = [],         //默认需要展开的菜单路径
    isFind = false;
  const dfs = (node, keys) => {
    if(!node) return;
    keys.push(node.id);
    if(node.routers === props.path) {
      isFind = true;
      defaultSelectedKeys.push(node.id);  
      defaultOpenKeys = keys;
      return;
    }
    node.children && node.children.forEach(value => {
      if(isFind)
        return;
      dfs(value, [...keys]);
    });
  };
  dfs(menuTree[0], []);
  return {
    menuTree,
    defaultSelectedKeys,
    defaultOpenKeys
  };
}