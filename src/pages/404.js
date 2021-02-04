import React from 'react';
import { Icon } from 'antd';

const style = {
  position: 'relative',
  textAlign: 'center',
};
const Error404 = () => {
  return (
    <div style={style}>
      <Icon type="frown-o" style={{ fontSize: 30 }} />
      <h1>404 Not Found</h1>
      <h2>页面不存在</h2>
    </div>
  );
};

export default Error404;
