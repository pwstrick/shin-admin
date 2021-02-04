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

#### 4）CreateModal.js
&emsp;&emsp;依托[Modal组件](https://3x.ant.design/components/modal-cn/)和[Form组件](https://3x.ant.design/components/form-cn/)，参数：
* url：与服务端的通信地址
* initUrl：列表初始化地址（用于创建成功后的列表初始化）
* listName：交互的列表名称（当页面出现多个列表时使用）
* attrs：模态窗口的属性（只开放了部分）
* initControls：初始化控件的函数，参数是 record
* btns：窗口底部的按钮回调函数集合
  * onOk()：提交确认方法
  * formatValues()：格式化 values 的值，必须有返回值
* record：当前数据记录（在编辑时使用），声明于models/template.js文件
* form：传递进来的表单，用于关联表单和控件

&emsp;&emsp;在下面的示例中，除了 AntD 提供的组件之外，还可以引入封装的 AddField 和 3个上传组件，都会多一个 type参数 和 initControl() 函数，用于补充组件的属性（就是label、name、params等）。
```javascript
/**
 * 只有当包含返回值时，才会执行成功
 */
function csvImportComplete(data) {
  console.log("complete", data);
}
const modalProps = {
  url: "template/create",
  initUrl: "template/query",
  listName: "list1",
  attrs: {
    name: "add",
    width: 800,
    title: "新建配置"
  },
  btns: {
    // onOk: (errors, values, record) => {
    //     // console.log(errors)
    //     if (errors) return;
    //     const params = { ...values };
    //     if(record.id !== undefined)
    //         params.id = record.id
    //     dispatch({
    //         type: "template/handle",
    //         payload: {
    //             params,
    //             url: "template/create",
    //             initUrl: "template/query",
    //             modalName: "add",
    //             listName: "list1"
    //         }
    //     });
    //     // console.log(values);
    // }
  },
  initControls: (record) => [
    {
      label: "专辑",
      name: "aid",
      params: {
        initialValue: record.id ? String(record.id) : ""
      },
      control: (
        <Select style={{ width: 350 }}>
          {albumList.map((item) => (
            <Option key={item.id} value={item.id}>
              {item.name}
            </Option>
          ))}
        </Select>
      )
    },
    {
      label: "价格",
      name: "price",
      params: {
        rules: [{ required: true, message: "价格不能为空" }],
        initialValue: record.price
      },
      control: (
        <Input
          addonAfter="元"
          disabled={record.price === undefined ? false : true}
        />
      )
    },
    {
      label: "icon",
      name: "icon",
      type: "upload",
      params: {
        // rules: [{ required: true, message: 'icon不能为空' }],
        initialValue: record.icon
      },
      initControl: (props) => <PhotoUpload dir="demo" count={3} {...props} />
    },
    {
      label: "主页",
      name: "urls",
      type: "addfield",
      params: {
        rules: [{ required: true, message: "主页不能为空" }],
        initialValue: record.urls
      },
      control: (index) => (
        <Input
          placeholder={`第 ${index} 条主页地址`}
          style={{ width: "80%" }}
        />
      ),
      initControl: (props) => <AddField {...props}></AddField>
    },
    {
      label: "用户导入",
      name: "csv",
      type: "import",
      params: {
        initialValue: record.csv
      },
      initControl: (props) => (
        <CsvUpload
          onComplete={csvImportComplete}
          prompt={
            <div>
              第一列必须是img，第二列必须是tab<a href="#">点击下载示例</a>
            </div>
          }
          {...props}
        />
      )
    },
    {
      label: "附件",
      name: "file",
      type: "upload",
      params: {
        initialValue: record.file
      },
      initControl: (props) => <FileUpload dir="demo" count={3} {...props} />
    }
  ]
};
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/7.png" width="500"/>
</p>

#### 5）TabModal.js
&emsp;&emsp;带标签栏的模态窗口，可用于展示一些只读信息。参数：
* attrs：模态窗口的属性，只开放了部分：宽度、标题
* type：标签栏类型，默认为 card
* panes：标签栏内容
```javascript
const tabModalProps = {
  type: "card",
  attrs: {
    name: "read",
    width: 600,
    title: "信息阅览"
  },
  panes: [
    {
      name: "用户信息",
      key: "logout",
      controls: [
        { label: "uid", control: "123" },
        { label: "手机", control: "+186138****00" },
        { label: "性别", control: "男" }
      ]
    },
    {
      name: "账号信息",
      key: "account",
      controls: [
        { label: "微信", control: <Button>解绑</Button> },
        { label: "手机", control: <Button>解绑</Button> }
      ]
    },
    {
      name: "设备信息",
      key: "device"
    }
  ]
};
```
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/8.png" width="500"/>
</p>

#### 6）AddField.js
&emsp;&emsp;需要注意，在表单提交时，要去除数组中的空元素（可调用 tools.js中的 removeEmptyInArray() ），因为控件的名称是数组，例如“urls[]”。参数：
* name：组件名称
* params：组件属性，[getFieldDecorator()](https://3x.ant.design/components/form-cn/#getFieldDecorator(id,-options)-%E5%8F%82%E6%95%B0)的参数
* label：新增按钮中的文本
* control：动态新增的控件，文本框、选择框等
* form：关联的表单
<p align="center">
  <img src="https://github.com/pwstrick/shin-admin/blob/main/docs/assets/9.png" width="500"/>
</p>