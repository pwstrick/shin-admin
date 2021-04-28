/*
 * @Author: strick
 * @Date: 2021-01-05 14:52:45
 * @LastEditTime: 2021-04-28 14:03:50
 * @LastEditors: strick
 * @Description: 列表数据组件
 * @FilePath: /strick/shin-admin/src/components/Common/Template/List/List.js
 */
import { connect } from 'dva';
import { useState } from "react";
import { Table, Pagination, Empty, Spin } from 'antd';
import SortTable from '../../SortableTable';
import PhotoCard from '../PhotoCard';
import { scrollToTop } from 'utils/tools';

/**
 * url：列表的请求地址
 * name：列表名称
 * columns：Table组件的列信息，https://3x.ant.design/components/table-cn/#Column
 * rowKey：表格行key的取值
 * scroll：表格滚动 配置项：https://3x.ant.design/components/table-cn/#scroll
 * rowSelection：选择配置，https://3x.ant.design/components/table-cn/#rowSelection
 * page：分页配置，https://3x.ant.design/components/pagination-cn/#API
 * type：列表类型，包括普通列表、拖拽列表（drag）和图像列表（photo）
 * options：组件的其他自定义参数，例如：
 *    onChange()、urlPropName、footer等
 *    其中 showTotal() 函数属于 Pagination 组件，用于显示总数
 * Table组件：https://3x.ant.design/components/table-cn/
 * SortTable组件：https://github.com/clauderic/react-sortable-hoc
 */
const List = ({ url, name, columns, rowKey="id", scroll, rowSelection, page={}, type, options={}, state, dispatch }) => {
  // console.log(state)
  const { listLoading, setListNameFunc } = state;
  const total = state[setListNameFunc(name, "total")],
    curPage = state[setListNameFunc(name, "curPage")],
    query = state[setListNameFunc(name, "query")],
    list = state[setListNameFunc(name, "list")],
    selectedItem = state[setListNameFunc(name, "selectedItem")];
  const {
    showQuickJumper=true, 
    showSizeChanger=true,
    pageSizeOptions=['10', '20', '30', '40', '50']
  } = page;
  const [pageSize, setPageSize] = useState(page.pageSize || 10);

  let pagination = false;
  function queryFunc(curPage, pageSize) {
    dispatch({
      type: "template/query",
      payload: {
        url,
        params: {
          ...query,
          curPage,
          pageSize,
        },
        listName: name
      }
    });
  }
  if(total > 0) {
    pagination = {
      current: curPage,
      total,
      pageSize,
      showTotal: options.showTotal,
      showQuickJumper,
      showSizeChanger,
      pageSizeOptions,
      onChange: page => {
        queryFunc(page, pageSize);
        scrollToTop();    //回到顶部
      },
      onShowSizeChange: (current, size) => {
        //更新 pageSize 的值
        setPageSize(size);
        queryFunc(current, size);
        scrollToTop();    //回到顶部
      }
    };
  }
  
  if(rowSelection && selectedItem) {
    rowSelection.selectedRowKeys = selectedItem.selectedRowKeys;
  }
  //拖拽表格
  if(type === 'drag') {
    return <Spin spinning={listLoading}>
      <SortTable 
        columns={columns}
        dataSource={list}
        rowKey={rowKey}
        {...options}
      />
      { pagination ? 
        <Pagination {...pagination} style={{marginTop: 20, textAlign: "right"}}/> : 
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{borderBottom: "1px solid #E8E8E8", marginTop:0, marginBottom:0, paddingTop:32, paddingBottom:32}}/>
      }
    </Spin>
  }
  //图像列表
  if(type === 'photo') {
    return <Spin spinning={listLoading}>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        { list && list.map(item => <PhotoCard 
            key={item[rowKey]} 
            id={item[rowKey]} 
            url={options.urlPropName ? item[options.urlPropName] : item.url}    //未定义URL的属性名，则默认使用url
            footer={options.footer(item)} 
            selection={rowSelection}/>)
        }
      </div>
      { pagination ? 
        <Pagination {...pagination} style={{marginTop: 20, textAlign: "right"}}/> : 
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} style={{borderBottom: "1px solid #E8E8E8", marginTop:0, marginBottom:0, paddingTop:32, paddingBottom:32}}/>
      }
    </Spin>
  }
  return <Table
    columns={columns}
    dataSource={list}
    scroll={scroll}
    pagination={pagination}
    rowKey={rowKey}
    loading={listLoading}
    rowSelection={rowSelection}
    {...options}
  />
}
export default connect(data => ({state: data.template}))(List);