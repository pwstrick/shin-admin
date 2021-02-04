/*
 * @Author: strick
 * @Date: 2020-10-24 15:39:07
 * @LastEditTime: 2021-02-02 13:59:21
 * @LastEditors: strick
 * @Description: 页面整体结构
 * @FilePath: /strick/shin-admin/src/layouts/index.js
 */
import styles from './index.css';
import React from 'react';
import { connect, router } from 'dva';
import { ConfigProvider, BackTop } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import Menu from 'components/Layout/Menu';
import Header from 'components/Layout/Header';
import Bread from 'components/Layout/Bread';

function App({ children, location, dispatch, app }) {
  const { siderFold, user } = app;
  if (location.pathname === '/login') {
    return (<div>{ children }</div>);
  }
  const headerProps = {
    siderFold,
    user,
    logout() {
      dispatch({
        type: 'app/logout',
      });
    },
    switchSider() {
      dispatch({
        type: 'app/switchSider',
      });
    },
    resetPassword() {
      dispatch({
        type: 'resetPassword/showModal',
        payload: { type: 'reset' },
      });
    },
    onSearch(keywords) {
      if (keywords.trim()) {
        dispatch({
          type: 'appuser/quickSearch',
          payload: keywords.trim(),
        });
      }
    },
    onIdTypeChange(key) {
      dispatch({
        type: 'appuser/quickSearchTypeChange',
        payload: key,
      });
    },
  };
  return (
    <div className={styles.layout}>
      {
        !siderFold ? <aside className={styles.sider}>
          <Menu path={location.pathname}/>
        </aside> : ''
      }
      <div className={styles.main}>
        <Header {...headerProps} />
        <div className={styles.container}>
          <Bread />
          <div className={styles.content}>
            { children }
          </div>
        </div>
      </div>
      <BackTop />
    </div>
  );
}

function MyApp(data) {
  return (
    <ConfigProvider locale={zhCN}><App {...data} /></ConfigProvider>
  );
}

export default router.withRouter(connect(({ app }) => ({ app }))(MyApp));
