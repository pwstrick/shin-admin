/*
 * @Author: strick
 * @LastEditors: strick
 * @Date: 2021-01-04 10:35:44
 * @LastEditTime: 2021-02-03 13:44:34
 * @Description: 照片墙模板
 * @FilePath: /strick/shin-admin/src/pages/template/photo/index.js
 */
import { connect } from 'dva';
import PhotoCard from 'components/Common/Template/PhotoCard';
import { Popover, Icon } from 'antd';
/* eslint-disable */
const PhotoDemo = ({ dispatch }) => {
  const imgs = [
    // { id: 1, url: "//www.pwstrick.com/upload/avatar.png", name: "strick"},   //MOCK数据采用此地址
    { id: 1, url: "http://localhost:6060/img/avatar.png", name: "strick"},      //开启本地server服务器时采用此地址
    // { id: 2, url: "//www.pwstrick.com/usr/uploads/2020/02/4250591636.jpg", name: "freedom" },
    { id: 2, url: "http://localhost:6060/img/cover.jpg", name: "freedom" },
  ];
  function cardFooter(record) {
    return <>
      <p>被举报人:
        <a>{record.name}</a>
      </p>
      <Popover title="举报详情" content="321" placement="right">
        <Icon type="right-circle" style={{position: "absolute", right: 5, bottom: 10, fontSize: 20}}/>
      </Popover>
    </>;
  }
  const selection = {
    selectedRowKeys: [],
    onChange: (selected) => {
      console.log("selected", selected)
    }
  }
  return <div style={{ display: 'flex', flexWrap: 'wrap' }}>
    { imgs.map(item => <PhotoCard key={item.id} id={item.id} url={item.url} footer={cardFooter(item)} selection={selection}/>) }
  </div>;
};
export default connect(data => data.templatePhoto)(PhotoDemo);