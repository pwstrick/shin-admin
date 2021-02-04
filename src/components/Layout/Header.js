/*
 * @Author: strick
 * @Date: 2020-09-28 10:48:18
 * @LastEditTime: 2020-12-27 21:36:52
 * @LastEditors: strick
 * @Description: 
 * @FilePath: /strick/shin-admin/src/components/Layout/Header.js
 */
import React from 'react';
import { Icon, Menu } from 'antd';
import styles from './Header.less';
import ResetPassword from '../Common/ResetPassword';
import QuickSearch from './QuickSearch';

const SubMenu = Menu.SubMenu;
function Header({ switchSider, siderFold, user, logout, 
  resetPassword, onSearch, onIdTypeChange }) {
  const handleClickMenu = (e) => {
    switch (e.key) {
      case 'logout':
        logout();
        break;
      case 'resetPassword':
        resetPassword();
        break;
      default:
        break;
    }
  };
  return (
    <div className={styles.header}>
      <ResetPassword />
      <div className={styles.siderFoldBtn} onClick={switchSider}>
        <Icon type={siderFold ? 'menu-unfold' : 'menu-fold'} />
      </div>
      <QuickSearch {...{ onSearch, onIdTypeChange }} />
      <div className={styles.rightWarpper}>
        <Menu mode="horizontal" onClick={handleClickMenu}>
          <SubMenu
            style={{ float: 'right' }}
            title={<span> <Icon type="user" />{ user.username } </span>}
          >
            <Menu.Item key="resetPassword" style={{ textAlign: 'center' }}>
              <span style={{ color: '#000' }}>修改密码</span>
            </Menu.Item>
            <Menu.Item key="logout" style={{ textAlign: 'center' }}>
              <span style={{ color: '#000' }}>登出</span>
            </Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  );
}

export default Header;
