# 模板组件
#### 1）Prompt.js
&emsp;&emsp;依托[Alert组件](https://3x.ant.design/components/alert-cn/)可配置标题、描述和图标。参数：
* message：标题
* description：描述
* showIcon：图标是否显示，默认是true
```javascript
const promptProps = {
  message: "使用需知",
  description: (
    <span>
      可以选择csv文件上传(<a href="#">点击下载uid的示例</a>
      )或手动输入uid(英文逗号隔开，不允许存在空格)。
    </span>
  )
};
```
![Prompt.js](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/4.png)

#### 2）SelectTabs.js
&emsp;&emsp;依托[Tabs组件](https://3x.ant.design/components/tabs-cn/)可配置标题和子组件等。参数：
* categories：键值对数组 [{key:"", value:""}]
* onTabChanges：选择标签时触发的事件
* animated：动画
* initTab：初始化TabPane中组件的函数
* type：标签栏类型，默认为 line
```javascript
const tabsProps = {
  categories: [
    { value: "普通列表", key: 1 },
    { value: "拖拽列表", key: 2 },
    { value: "图像列表", key: 3 }
  ],
  initTab: (category) => {
    switch (category.key) {
      case 1:
        return (
          <>
            <Query {...query1Props}></Query>
            <Batch {...batch1Props}></Batch>
            <List {...list1Props}></List>
          </>
        );
      case 2:
        return (
          <>
            <Query {...query2Props}></Query>
            <List {...list2Props}></List>
          </>
        );
      case 3:
        return (
          <>
            <Query {...query3Props}></Query>
            <Batch {...batch3Props}></Batch>
            <List {...list3Props}></List>
          </>
        );
    }
  }
};
```
![SelectTabs.js](https://github.com/pwstrick/shin-admin/blob/main/docs/assets/5.png)

#### 3）PhotoCard.js
&emsp;&emsp;依托[Card组件](https://3x.ant.design/components/card-cn/)，参数：
* id：组件的唯一标识，用于多选
* url：照片地址
* footer：底部自定义组件（例如图中的举报信息）
* selection：选中的值以及回调事件 onChange(selectedRowKeys)
```javascript
const imgs = [
  { id: 1, url: "http://localhost:6060/img/avatar.png", name: "freedom" },
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
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/6.png" width="300"/>
</p>