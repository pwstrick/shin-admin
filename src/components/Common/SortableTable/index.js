/**
 * 可拖拽排序的表格
 */
import React from 'react';
import { Checkbox } from 'antd';
import _ from 'lodash';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import styles from './sortableTable.less';

const SortableTable = ({ columns, dataSource, onUpdate, rowSelection }) => {
  const ListItem = SortableElement(({ value }) => {
    const renderRow = () => {
      const rowData = value;
      const tds = columns.map((columnItem) => {
        let rowDom = null;
        if (columnItem.render) {
          rowDom = columnItem.render(rowData[columnItem.dataIndex], rowData);
        } else {
          rowDom = rowData[columnItem.dataIndex];
        }
        return (
          <td className={styles.td} key={columnItem.key}>{rowDom}</td>
        );
      });
      if (rowSelection) {
        tds.unshift(
          <td className={styles.td} key="select">
            <Checkbox
              checked={rowSelection.selectedRowKeys.indexOf(rowData.id) !== -1}
              onChange={e => onSelectChange(rowData.id, e.target.checked)}
            />
          </td>,
        );
      }
      return tds;
    };
    return (
      <tr className={styles.tr} style={{cursor: "move"}}>{renderRow()}</tr>
    );
  });
  const SortableList = SortableContainer(({ items }) => (
    <tbody>
      {
        items && items.length && items.map((dataItem, index) =>
          <ListItem
            key={index}
            index={index}
            value={dataItem}
            collection={dataItem.collection || 0}
          />,
        )
      }
    </tbody>
  ));
  const onSortEnd = ({ oldIndex, newIndex }) => {
    onUpdate(arrayMove(dataSource, oldIndex, newIndex));
  };
  const onSelectAllChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      return rowSelection.onChange(
        _.map(dataSource, 'id'),
      );
    }
    return rowSelection.onChange([]);
  };
  const onSelectChange = (indexId, checked) => {
    const selectedRowKeys = rowSelection.selectedRowKeys;
    if (checked) {
      selectedRowKeys.push(indexId);
    } else {
      selectedRowKeys.splice(selectedRowKeys.indexOf(indexId), 1);
    }
    rowSelection.onChange(selectedRowKeys);
  };
  const renderSelectAll = () => {
    if (rowSelection) {
      const checked = rowSelection.selectedRowKeys.length === dataSource.length;
      return (
        <th className={styles.th} key="select">
          <span>
            <Checkbox onChange={onSelectAllChange} checked={checked} />
          </span>
        </th>
      );
    }
    return null;
  };
  return (
    <table className={styles.table}>
      <colgroup>
        {
          rowSelection && <col key="select" style={{ width: 50 }} />
        }
        {
          columns.map((item, index) =>
            <col key={index} style={item.width ? { width: item.width } : {}} />)
        }
      </colgroup>
      <thead>
        <tr>
          {
            renderSelectAll()
          }
          {
            columns.map(item =>
              <th className={styles.th} key={item.key}><span>{item.title}</span></th>,
            )
          }
        </tr>
      </thead>
      <SortableList
        helperClass={styles.helperClass}
        pressDelay={200}
        items={dataSource}
        onSortEnd={onSortEnd}
        useWindowAsScrollContainer
      />
    </table>
  );
};

export default SortableTable;
