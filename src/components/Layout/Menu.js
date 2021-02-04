/*
 * @Author: strick
 * @Date: 2020-11-26 17:15:19
 * @LastEditTime: 2021-02-04 10:30:18
 * @LastEditors: strick
 * @Description: 侧边栏 根据用户权限去渲染侧边栏
 * @FilePath: /strick/shin-admin/src/components/Layout/Menu.js
 */
import React from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import styles from './Menu.less';
import { createAuthTree } from 'utils/menu';
import logo from 'assets/logo-vertical.png';

function Menus(props) {
  let tree = createAuthTree(props);
  const createMenu = (menu) => {
    return menu.map((item) => {
      //过滤掉操作类型的菜单
      if (item.type === 2) {
        return null;
      }
      if (item.children) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={<span>{item.icon ? <Icon type={item.icon} /> : ''}{item.name}</span>}
          >
            {createMenu(item.children)}
          </Menu.SubMenu>
        );
      } else {
        return item.routers ? (<Menu.Item key={item.id}>
            <Link to={item.routers}>
              {item.icon ? <Icon type={item.icon} /> : ''}{item.name}
            </Link>
          </Menu.Item>) : null;
      }
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img alt={'logo'} src={logo} />
      </div>
      <Menu
        mode="inline"
        defaultSelectedKeys={tree.defaultSelectedKeys}
        defaultOpenKeys={tree.defaultOpenKeys}
      >
        { createMenu(tree.menuTree) }
      </Menu>
    </div>
  );
}

export default Menus;
