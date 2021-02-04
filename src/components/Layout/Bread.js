/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2021-02-02 13:58:53
 * @LastEditors: strick
 * @Description: 
 * @FilePath: /strick/shin-admin/src/components/Layout/Bread.js
 */
import React from 'react';
import { Breadcrumb } from 'antd';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import authority from '@/authority';

function Bread() {
  let current = '';
  //确定当前路径
  for (const item of authority) {
    if (item.routers === window.location.pathname) {
      current = item;
    }
  }
  const pathArray = [];
  //递归的检索出面包屑路径
  const getArrayPath = (item) => {
    pathArray.unshift(item);
    if (item.pid) {
      const index = _.findIndex(authority, { id: item.pid });
      getArrayPath(authority[index]);
    }
  };
  getArrayPath(current);
  return (
    <Breadcrumb style={{ marginBottom: 20 }}>
      { pathArray.map(item => (
        item &&
        <Breadcrumb.Item key={item.id}>
          { item.routers ? (
            <Link to={item.routers}>
              { item.name }
            </Link>
          ) : item.name }
        </Breadcrumb.Item>)) }
    </Breadcrumb>
  );
}

export default Bread;
